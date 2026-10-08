import { CUTOUT_SPECS, FAUCET_SPACING } from './catalog'
import type { Cutout, Drawing, EdgeId } from './types'

/** A rectangle in inches. x runs left→right, y runs back→front. */
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export type Point = [number, number]

export interface EdgeSegment {
  id: EdgeId
  a: Point
  b: Point
  /** Unit vector pointing away from the stone. */
  normal: Point
}

/** Effective L-shape sizes, kept valid even while someone is mid-typing. */
export function lShapeSizes(d: Drawing) {
  const returnLength = Math.max(d.returnLength, d.depth + 1)
  const returnWidth = Math.min(Math.max(d.returnWidth, 1), d.length - 1)
  return { returnLength, returnWidth }
}

/** Overall width (left↔right) and height (back↔front) of the piece. */
export function boundingSize(d: Drawing) {
  if (d.shape === 'rectangle') return { w: d.length, h: d.depth }
  return { w: d.length, h: lShapeSizes(d).returnLength }
}

/** The empty corner of an L-shape (bounding box minus the stone). */
export function notchRect(d: Drawing): Rect | null {
  if (d.shape === 'rectangle') return null
  const { returnLength, returnWidth } = lShapeSizes(d)
  return { x: 0, y: d.depth, w: d.length - returnWidth, h: returnLength - d.depth }
}

export function edgeSegments(d: Drawing): EdgeSegment[] {
  const L = d.length
  const D = d.depth
  if (d.shape === 'rectangle') {
    return [
      { id: 'back', a: [0, 0], b: [L, 0], normal: [0, -1] },
      { id: 'right', a: [L, 0], b: [L, D], normal: [1, 0] },
      { id: 'front', a: [L, D], b: [0, D], normal: [0, 1] },
      { id: 'left', a: [0, D], b: [0, 0], normal: [-1, 0] },
    ]
  }
  const { returnLength: R, returnWidth: W } = lShapeSizes(d)
  return [
    { id: 'back', a: [0, 0], b: [L, 0], normal: [0, -1] },
    { id: 'right', a: [L, 0], b: [L, R], normal: [1, 0] },
    { id: 'returnEnd', a: [L, R], b: [L - W, R], normal: [0, 1] },
    { id: 'returnInside', a: [L - W, R], b: [L - W, D], normal: [-1, 0] },
    { id: 'front', a: [L - W, D], b: [0, D], normal: [0, 1] },
    { id: 'left', a: [0, D], b: [0, 0], normal: [-1, 0] },
  ]
}

export function outlinePoints(d: Drawing): Point[] {
  return edgeSegments(d).map((s) => s.a)
}

/** Where the front edge is, directly in front of position x. */
export function frontYAt(d: Drawing, x: number) {
  const notch = notchRect(d)
  if (notch && x < notch.x + notch.w) return d.depth
  return boundingSize(d).h
}

/** Faucet holes sit side by side, so the footprint grows with the hole count. */
export function footprintWidth(c: Cutout) {
  if (c.type !== 'faucet') return c.width
  return c.width + (Math.max(c.holeCount ?? 1, 1) - 1) * FAUCET_SPACING
}

export function cutoutRect(d: Drawing, c: Cutout): Rect {
  const w = footprintWidth(c)
  const frontY = frontYAt(d, c.fromLeft + w / 2)
  return { x: c.fromLeft, y: frontY - c.fromFront - c.depth, w, h: c.depth }
}

/** Inverse of cutoutRect: turn a dragged position back into offsets. */
export function offsetsFromPosition(d: Drawing, c: Cutout, x: number, y: number) {
  const w = footprintWidth(c)
  const frontY = frontYAt(d, x + w / 2)
  return { fromLeft: x, fromFront: frontY - y - c.depth }
}

export interface Clearances {
  left: number
  right: number
  back: number
  front: number
  /** Edge positions each clearance is measured to. */
  leftEdge: number
  rightEdge: number
  backEdge: number
  frontEdge: number
}

/** Distance from each side of a rectangle to the stone edge on that side. */
export function clearances(d: Drawing, r: Rect): Clearances {
  const { w: bw, h: bh } = boundingSize(d)
  const notch = notchRect(d)
  const inNotchRows = !!notch && r.y + r.h > notch.y && r.y < notch.y + notch.h
  const inNotchCols = !!notch && r.x < notch.x + notch.w
  const leftEdge = inNotchRows && notch ? notch.x + notch.w : 0
  const frontEdge = inNotchCols ? d.depth : bh
  return {
    left: r.x - leftEdge,
    right: bw - (r.x + r.w),
    back: r.y,
    front: frontEdge - (r.y + r.h),
    leftEdge,
    rightEdge: bw,
    backEdge: 0,
    frontEdge,
  }
}

export function rectsOverlap(a: Rect, b: Rect) {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
}

/** Shortest straight-line gap between two rectangles (0 when touching or overlapping). */
export function rectGap(a: Rect, b: Rect) {
  const dx = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w))
  const dy = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h))
  return Math.hypot(dx, dy)
}

/** "Sink", "Cooktop", or "Sink 2" when there is more than one of a kind. */
export function cutoutLabels(cutouts: Cutout[]) {
  const totals: Record<string, number> = {}
  for (const c of cutouts) {
    const base = baseLabel(c)
    totals[base] = (totals[base] ?? 0) + 1
  }
  const seen: Record<string, number> = {}
  const labels: Record<string, string> = {}
  for (const c of cutouts) {
    const base = baseLabel(c)
    seen[base] = (seen[base] ?? 0) + 1
    labels[c.id] = totals[base] > 1 ? `${base} ${seen[base]}` : base
  }
  return labels
}

function baseLabel(c: Cutout) {
  if (c.type === 'faucet') return (c.holeCount ?? 1) > 1 ? 'Faucet holes' : 'Faucet hole'
  return CUTOUT_SPECS[c.type].shortName
}
