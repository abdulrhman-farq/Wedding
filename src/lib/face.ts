import type { MediaItem } from '../types'

/** A face found in a photo, with a normalized centre (0..1) and its 128-d signature. */
export interface DetectedFace {
  cx: number
  cy: number
  w: number
  h: number
  descriptor: number[]
}

type FaceApi = typeof import('@vladmandic/face-api')

let faPromise: Promise<FaceApi | null> | null = null
let modelsLoaded = false
const detectionCache = new Map<string, DetectedFace[]>()

async function getFA(): Promise<FaceApi | null> {
  if (!faPromise) {
    faPromise = (async () => {
      try {
        const fa = await import('@vladmandic/face-api')
        // face-api lazily initializes its TF backend (WebGL when available).
        await Promise.all([
          fa.nets.tinyFaceDetector.loadFromUri('/models'),
          fa.nets.faceLandmark68Net.loadFromUri('/models'),
          fa.nets.faceRecognitionNet.loadFromUri('/models'),
        ])
        modelsLoaded = true
        return fa
      } catch {
        return null
      }
    })()
  }
  return faPromise
}

/** Preload models (e.g. when tag mode opens) so the first detection is quick. */
export async function warmUpFaceModels(): Promise<boolean> {
  return (await getFA()) !== null && modelsLoaded
}

function loadImage(item: MediaItem): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.referrerPolicy = 'no-referrer'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    // For remote Drive photos use Google's image CDN, which generally allows
    // cross-origin canvas reads; embedded items are same-origin data URIs.
    img.src = item.remote
      ? `https://lh3.googleusercontent.com/d/${item.driveId}=w1000`
      : item.full ?? item.poster
  })
}

/** Detect faces for one moment. Returns [] on any failure (tainted canvas, no model, etc.). */
export async function detectForItem(item: MediaItem): Promise<DetectedFace[]> {
  if (detectionCache.has(item.id)) return detectionCache.get(item.id)!
  let faces: DetectedFace[] = []
  try {
    const fa = await getFA()
    const img = fa && (await loadImage(item))
    if (fa && img) {
      const w = img.naturalWidth || img.width
      const h = img.naturalHeight || img.height
      const results = await fa
        .detectAllFaces(img, new fa.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.4 }))
        .withFaceLandmarks()
        .withFaceDescriptors()
      faces = results.map((r) => {
        const b = r.detection.box
        return {
          cx: (b.x + b.width / 2) / w,
          cy: (b.y + b.height / 2) / h,
          w: b.width / w,
          h: b.height / h,
          descriptor: Array.from(r.descriptor as Float32Array),
        }
      })
    }
  } catch {
    faces = []
  }
  detectionCache.set(item.id, faces)
  return faces
}

function distance(a: number[], b: number[]): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i]
    sum += d * d
  }
  return Math.sqrt(sum)
}

export interface KnownFace {
  name: string
  descriptor: number[]
}

/** Best matching known name for a descriptor, or null if none is close enough. */
export function bestMatch(
  descriptor: number[],
  known: KnownFace[],
  threshold = 0.52,
): { name: string; distance: number } | null {
  let best: { name: string; distance: number } | null = null
  for (const k of known) {
    if (!k.descriptor || k.descriptor.length !== descriptor.length) continue
    const d = distance(descriptor, k.descriptor)
    if (!best || d < best.distance) best = { name: k.name, distance: d }
  }
  return best && best.distance <= threshold ? best : null
}

/** The detected face whose box contains (or is nearest to) a normalized point. */
export function faceAtPoint(faces: DetectedFace[], x: number, y: number): DetectedFace | null {
  let inside: DetectedFace | null = null
  let nearest: DetectedFace | null = null
  let nearestD = Infinity
  for (const f of faces) {
    const within =
      Math.abs(x - f.cx) <= f.w / 2 + 0.02 && Math.abs(y - f.cy) <= f.h / 2 + 0.02
    if (within) inside = f
    const d = Math.hypot(x - f.cx, y - f.cy)
    if (d < nearestD) {
      nearestD = d
      nearest = f
    }
  }
  // accept the nearest only if reasonably close
  return inside ?? (nearestD < 0.12 ? nearest : null)
}
