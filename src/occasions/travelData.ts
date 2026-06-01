/** Sample travel content for the Honeymoon (Bali) hub. Edit freely. */

export interface DocField {
  label: string
  value: string
}

export interface TravelDoc {
  id: string
  icon: 'flight' | 'hotel' | 'passport' | 'visa' | 'itinerary' | 'emergency' | 'packing' | 'notes'
  title: string
  subtitle: string
  fields?: DocField[]
  /** Checklist items (packing). */
  checklist?: string[]
  /** Free-text lines (notes / itinerary days). */
  lines?: string[]
}

export const TRIP = {
  destinationAr: 'بالي · إندونيسيا',
  destinationEn: 'Bali, Indonesia',
  startISO: '2026-06-02',
  endISO: '2026-06-12',
  nights: 10,
}

export const TRAVEL_DOCS: TravelDoc[] = [
  {
    id: 'flight',
    icon: 'flight',
    title: 'تذاكر الطيران',
    subtitle: 'الرياض ✈ دنباسار · ٢ يونيو',
    fields: [
      { label: 'الذهاب', value: 'RUH → DPS · Qatar Airways QR1185 / QR962' },
      { label: 'المغادرة', value: '٢ يونيو ٢٠٢٦ · ٠٢:١٠ص' },
      { label: 'الوصول', value: '٢ يونيو ٢٠٢٦ · ٠٩:٤٥م (توقيت بالي)' },
      { label: 'العودة', value: 'DPS → RUH · ١٢ يونيو ٢٠٢٦' },
      { label: 'رقم الحجز (PNR)', value: 'X7K2QF' },
      { label: 'الدرجة', value: 'الأعمال · مقعدان 3A · 3B' },
    ],
  },
  {
    id: 'hotel',
    icon: 'hotel',
    title: 'حجز الفندق',
    subtitle: 'فيلا خاصة · أوبود ثم سمينياك',
    fields: [
      { label: 'الإقامة الأولى', value: 'Viceroy Bali · أوبود · ٤ ليالٍ' },
      { label: 'الإقامة الثانية', value: 'The Legian · سمينياك · ٦ ليالٍ' },
      { label: 'تسجيل الدخول', value: '٢ يونيو · بعد ٢:٠٠م' },
      { label: 'تسجيل الخروج', value: '١٢ يونيو · قبل ١٢:٠٠م' },
      { label: 'رقم التأكيد', value: 'HBK-90455127' },
      { label: 'يشمل', value: 'إفطار · مسبح خاص · نقل المطار' },
    ],
  },
  {
    id: 'passport',
    icon: 'passport',
    title: 'بيانات الجواز',
    subtitle: 'صلاحية الجوازين سارية',
    fields: [
      { label: 'العريس', value: 'عبدالرحمن · جواز سعودي' },
      { label: 'رقم الجواز', value: 'A1•••••9 · تنتهي ٢٠٣١' },
      { label: 'العروس', value: 'رويدا · جواز سعودي' },
      { label: 'رقم الجواز', value: 'B2•••••4 · تنتهي ٢٠٣٠' },
      { label: 'ملاحظة', value: 'صلاحية ٦ أشهر على الأقل قبل السفر ✅' },
    ],
  },
  {
    id: 'visa',
    icon: 'visa',
    title: 'التأشيرة والوثائق',
    subtitle: 'تأشيرة عند الوصول (VoA)',
    fields: [
      { label: 'النوع', value: 'Visa on Arrival · إندونيسيا' },
      { label: 'الرسوم', value: '٥٠٠٬٠٠٠ روبية (~١٢٥ ريال) للفرد' },
      { label: 'المدة', value: '٣٠ يوماً · قابلة للتمديد مرة' },
      { label: 'مطلوب', value: 'جواز ساري · تذكرة عودة · إثبات إقامة' },
      { label: 'صحي', value: 'لا لقاحات إلزامية · تأمين سفر موصى به' },
    ],
  },
  {
    id: 'itinerary',
    icon: 'itinerary',
    title: 'برنامج الرحلة',
    subtitle: '١٠ أيام · أوبود ثم سمينياك',
    lines: [
      'اليوم ١ · الوصول إلى دنباسار والاستقرار في الفيلا',
      'اليوم ٢ · مدرجات أرز تيغالالانغ + أرجوحة الغابة',
      'اليوم ٣ · معبد تيرتا إمبول + شلال تيغينونغان',
      'اليوم ٤ · جلسة سبا + سوق أوبود الفني',
      'اليوم ٥ · الانتقال إلى سمينياك',
      'اليوم ٦ · يوم شاطئ + غروب في تانه لوت',
      'اليوم ٧ · رحلة بحرية إلى جزيرة نوسا بينيدا',
      'اليوم ٨ · تجربة طهي + تسوق',
      'اليوم ٩ · يوم حر واسترخاء',
      'اليوم ١٠ · المغادرة',
    ],
  },
  {
    id: 'emergency',
    icon: 'emergency',
    title: 'جهات الطوارئ',
    subtitle: 'أرقام مهمة في بالي',
    fields: [
      { label: 'الطوارئ (شرطة)', value: '١١٠' },
      { label: 'الإسعاف', value: '١١٨ / ١١٩' },
      { label: 'سفارة السعودية · جاكرتا', value: '+٦٢ ٢١ ٢٩٧٠ ٤٤٤٤' },
      { label: 'مستشفى BIMC · كوتا', value: '+٦٢ ٣٦١ ٧٦١٢٦٣' },
      { label: 'التأمين الطبي', value: 'بوبا · وثيقة ٤٤٢١٨٨ · ٢٤/٧' },
    ],
  },
  {
    id: 'packing',
    icon: 'packing',
    title: 'قائمة الأمتعة',
    subtitle: '٤ من ١٢ مكتمل',
    checklist: [
      'الجوازات وبطاقات الصعود',
      'محوّل كهرباء (نوع C/F)',
      'واقي شمس + طارد حشرات',
      'ملابس صيفية وسباحة',
      'كاميرا + شواحن',
      'أدوية شخصية',
      'نظارات شمسية',
      'حذاء مريح للمشي',
      'لباس محتشم لزيارة المعابد',
      'نقود نقدية (روبية)',
      'حقيبة ظهر صغيرة',
      'تطبيق خرائط بدون إنترنت',
    ],
  },
  {
    id: 'notes',
    icon: 'notes',
    title: 'ملاحظات مهمة',
    subtitle: 'نصائح سريعة',
    lines: [
      'العملة: الروبية الإندونيسية (IDR) — استبدل في المدينة لا المطار.',
      'وسيلة التنقل: استأجر سائقاً خاصاً باليوم (~٥٠٠ ريال).',
      'الماء: اشرب المعبّأ فقط.',
      'الإكرامية: غير إلزامية لكنها مقدَّرة.',
      'المعابد: احترم لباس الإيزار (Sarong) عند الدخول.',
      'SIM: اشترِ شريحة Telkomsel من المطار للإنترنت.',
    ],
  },
]
