import type { Units } from './types'

export const MM_PER_INCH = 25.4

const FRACTIONS: Record<number, string> = {
  1: '⅛',
  2: '¼',
  3: '⅜',
  4: '½',
  5: '⅝',
  6: '¾',
  7: '⅞',
}

/** Round to the nearest 1/8 inch. */
export function snapEighth(inches: number) {
  return Math.round(inches * 8) / 8
}

/** 25.5 -> 25½"  ·  0.375 -> ⅜"  ·  in mm: 648 mm */
export function formatLength(inches: number, units: Units, withUnit = true) {
  if (units === 'mm') {
    const mm = Math.round(inches * MM_PER_INCH)
    return withUnit ? `${mm} mm` : `${mm}`
  }
  const eighths = Math.round(Math.abs(inches) * 8)
  const whole = Math.floor(eighths / 8)
  const rest = eighths % 8
  const sign = inches < 0 && eighths > 0 ? '−' : ''
  const body = rest === 0 ? `${whole}` : whole === 0 ? FRACTIONS[rest] : `${whole}${FRACTIONS[rest]}`
  return `${sign}${body}${withUnit ? '"' : ''}`
}

/** Plain-text value for an editable input: 25.5 -> "25 1/2" (in) or "648" (mm). */
export function toInputValue(inches: number, units: Units) {
  if (units === 'mm') return `${Math.round(inches * MM_PER_INCH)}`
  const eighths = Math.round(inches * 8)
  const whole = Math.floor(eighths / 8)
  let rest = eighths % 8
  if (rest === 0) return `${whole}`
  let den = 8
  while (rest % 2 === 0) {
    rest /= 2
    den /= 2
  }
  return whole === 0 ? `${rest}/${den}` : `${whole} ${rest}/${den}`
}

const UNICODE_FRACTIONS: Record<string, string> = {
  '⅛': ' 1/8',
  '¼': ' 1/4',
  '⅜': ' 3/8',
  '½': ' 1/2',
  '⅝': ' 5/8',
  '¾': ' 3/4',
  '⅞': ' 7/8',
}

/**
 * Parse what a person types into inches. Accepts 25.5, 25 1/2, 25-1/2, 25½, 3/4.
 * Returns null when the text is not a usable number.
 */
export function parseLength(text: string, units: Units): number | null {
  let s = text.trim().replace(/["”]|in(ches)?|mm/gi, '').trim()
  for (const [glyph, ascii] of Object.entries(UNICODE_FRACTIONS)) s = s.replace(glyph, ascii)
  s = s.trim()
  if (!s) return null

  let value: number | null = null
  const mixed = s.match(/^(\d+(?:\.\d+)?)[\s-]+(\d+)\/(\d+)$/)
  const frac = s.match(/^(\d+)\/(\d+)$/)
  if (mixed) {
    const den = Number(mixed[3])
    if (den === 0) return null
    value = Number(mixed[1]) + Number(mixed[2]) / den
  } else if (frac) {
    const den = Number(frac[2])
    if (den === 0) return null
    value = Number(frac[1]) / den
  } else if (/^\d*\.?\d+$/.test(s)) {
    value = Number(s)
  }
  if (value === null || !Number.isFinite(value)) return null
  return units === 'mm' ? value / MM_PER_INCH : value
}
