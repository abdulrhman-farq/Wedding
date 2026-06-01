type IconName =
  | 'close'
  | 'share'
  | 'download'
  | 'back'
  | 'search'
  | 'grid'
  | 'moon'
  | 'sun'
  | 'play'
  | 'check'
  | 'photos'
  | 'library'
  | 'heart'
  | 'tag'
  | 'info'
  | 'chevronLeft'
  | 'chevronRight'
  | 'people'
  | 'music'
  | 'musicOff'
  | 'slideshow'
  | 'pause'
  | 'gridLarge'
  | 'gridComfortable'
  | 'gridCompact'
  | 'add'
  | 'menu'
  | 'plane'
  | 'bed'
  | 'idcard'
  | 'document'
  | 'route'
  | 'sos'
  | 'suitcase'
  | 'note'
  | 'clock'
  | 'checkCircle'
  | 'plus'

const PATHS: Record<IconName, string> = {
  close: 'M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z',
  share:
    'M18 16.1c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L9.04 9.81C8.5 9.31 7.79 9 7 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.1 18 16.1z',
  download: 'M12 16 7 11l1.4-1.4L11 12.2V4h2v8.2l2.6-2.6L17 11zM5 18h14v2H5z',
  back: 'M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z',
  search:
    'M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5 1.5-1.5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z',
  grid: 'M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z',
  moon: 'M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36A5.39 5.39 0 0 1 12.6 3.1c-.2-.06-.4-.1-.6-.1z',
  sun: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  play: 'M8 5v14l11-7z',
  check: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
  photos:
    'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5z',
  library:
    'M4 6H2v14a2 2 0 0 0 2 2h14v-2H4zm16-4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-1 9-2.5-1.5L14 15V4h5z',
  heart:
    'M12 21s-7.5-4.9-10-9.5C.5 8.4 2 5 5.3 5c2 0 3.4 1.2 4.2 2.4l2.5 3 2.5-3C15.3 6.2 16.7 5 18.7 5 22 5 23.5 8.4 22 11.5 19.5 16.1 12 21 12 21z',
  tag: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z',
  info: 'M11 7h2v2h-2zm0 4h2v6h-2zm1-9a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
  chevronLeft: 'M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12z',
  chevronRight: 'M8.6 7.4 10 6l6 6-6 6-1.4-1.4L13.2 12z',
  people:
    'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  music: 'M12 3v10.55A4 4 0 1 0 14 17V7h4V3z',
  musicOff:
    'M12 3v3.18l2-2V3zm6 0h-4v1.18L18 8V3zM4.3 3 3 4.3 12 13.3v.25A4 4 0 1 0 14 17v-.7l5.7 5.7 1.3-1.3z',
  slideshow:
    'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm7 3v8l6-4z',
  pause: 'M6 5h4v14H6zm8 0h4v14h-4z',
  gridLarge: 'M4 4h16v16H4z',
  gridComfortable: 'M3 3h7.5v7.5H3zm10.5 0H21v7.5h-7.5zM3 13.5h7.5V21H3zm10.5 0H21V21h-7.5z',
  gridCompact:
    'M2 2h4.2v4.2H2zM9.9 2h4.2v4.2H9.9zM17.8 2h4.2v4.2h-4.2zM2 9.9h4.2v4.2H2zM9.9 9.9h4.2v4.2H9.9zM17.8 9.9h4.2v4.2h-4.2zM2 17.8h4.2v4.2H2zM9.9 17.8h4.2v4.2H9.9zM17.8 17.8h4.2v4.2h-4.2z',
  add: 'M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z',
  plus: 'M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z',
  menu: 'M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z',
  plane: 'M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z',
  bed: 'M7 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm12-2h-8V7H3V5H1v14h2v-3h18v3h2v-8a3 3 0 0 0-3-3z',
  idcard:
    'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM8 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm4 9H4v-1c0-1.6 2.7-2.5 4-2.5s4 .9 4 2.5v1zm8-1h-6v-1.5h6zm0-3h-6V11h6zm0-3h-6V8h6z',
  document:
    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z',
  route:
    'M19 15.5a2.5 2.5 0 0 0-2.4 1.8H10a2 2 0 0 1 0-4h4a4 4 0 0 0 0-8H7.4a2.5 2.5 0 1 0 0 2H14a2 2 0 0 1 0 4h-4a4 4 0 0 0 0 8h6.6a2.5 2.5 0 1 0 2.4-3.8z',
  sos: 'M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5zm1 14h-2v-2h2zm0-4h-2V7h2z',
  suitcase:
    'M17 6V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6zM9 4h6v2H9zm-1 4v11H6V8zm10 11h-2V8h2z',
  note: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10l6-6V5a2 2 0 0 0-2-2zM7 8h10v2H7zm0 4h6v2H7zm7 7v-4h4z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 11h-5v-2h3V7h2z',
  checkCircle: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8z',
}

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const stroke = name === 'sun'
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={stroke ? 'none' : 'currentColor'}
      stroke={stroke ? 'currentColor' : 'none'}
      strokeWidth={stroke ? 2 : 0}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
