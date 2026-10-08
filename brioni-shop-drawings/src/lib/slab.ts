import { SLAB_SIZES } from './catalog'
import { cutoutRect, lShapeSizes, outlinePoints, type Point } from './geometry'
import type { Drawing } from './types'

/**
 * Turns a drawing into the pieces the shop actually cuts, adds seams where a
 * piece is bigger than a slab, and nests everything onto as few slabs as
 * possible. Deliberately simple: no manual nesting, no vein matching.
 */

export interface Part {
  id: string
  /** A, B, C… as written on the stone. */
  letter: string
  name: string
  /** Outline in drawing coordinates (inches). */
  points: Point[]
  /** Bounding box in drawing coordinates. */
  x0: number
  y0: number
  w: number
  h: number
  isBacksplash?: boolean
}

export interface Seam {
  a: Point
  b: Point
  /** Where the seam is, measured from the left end of the piece. */
  fromLeft: number
}

export interface Placement {
  part: Part
  slab: number
  /** Top-left corner on the slab. */
  x: number
  y: number
  /** Turned 90° to fit. */
  rotated: boolean
}

export interface SlabPlan {
  slabSize: { length: number; depth: number; name: string }
  parts: Part[]
  seams: Seam[]
  placements: Placement[]
  slabCount: number
  /** Square inches of stone that ends up installed. */
  stoneArea: number
  /** 0–1 share of the bought slabs that is used. */
  yield: number
  /** A part is too big even for a seamed layout (very rare). */
  unplaced: Part[]
}

const MARGIN = 1 // clean-up cut around the slab edge
const GAP = 1 // saw kerf and handling space between parts
const AVOID = 3 // keep seams this far from any cut-out

export function polygonArea(points: Point[]) {
  let a = 0
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i]
    const [x2, y2] = points[(i + 1) % points.length]
    a += x1 * y2 - x2 * y1
  }
  return Math.abs(a) / 2
}

function rectPoints(x: number, y: number, w: number, h: number): Point[] {
  return [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ]
}

export function planSlabs(d: Drawing): SlabPlan {
  const slab = SLAB_SIZES[d.slabSize]
  const usableL = slab.length - 2 * MARGIN
  const usableD = slab.depth - 2 * MARGIN
  const fits = (w: number, h: number) => (w <= usableL && h <= usableD) || (w <= usableD && h <= usableL)
  const cutoutSpans = d.cutouts.map((c) => cutoutRect(d, c))

  const seams: Seam[] = []
  const pieces: { name: string; points: Point[]; x0: number; y0: number; w: number; h: number }[] = []

  // Split a rectangle along its length into slab-sized runs, steering seams clear of cut-outs.
  function splitRun(x: number, y: number, w: number, h: number, name: string) {
    if (fits(w, h)) {
      pieces.push({ name, points: rectPoints(x, y, w, h), x0: x, y0: y, w, h })
      return
    }
    const maxRun = h <= usableD ? usableL : usableD
    const n = Math.ceil(w / maxRun)
    const cuts: number[] = []
    let start = x
    for (let i = 1; i < n; i++) {
      let cut = x + (w * i) / n
      const hit = cutoutSpans.find((r) => r.y < y + h && r.y + r.h > y && cut > r.x - AVOID && cut < r.x + r.w + AVOID)
      if (hit) {
        const before = hit.x - AVOID
        const after = hit.x + hit.w + AVOID
        cut = cut - before < after - cut && before - start > 12 ? before : after
      }
      if (cut - start > maxRun) cut = start + maxRun
      cuts.push(cut)
      start = cut
    }
    const edges = [x, ...cuts, x + w]
    for (let i = 0; i < edges.length - 1; i++) {
      const a = edges[i]
      const b = edges[i + 1]
      pieces.push({
        name: `${name} ${i + 1}`,
        points: rectPoints(a, y, b - a, h),
        x0: a,
        y0: y,
        w: b - a,
        h,
      })
      if (i > 0) seams.push({ a: [a, y], b: [a, y + h], fromLeft: a })
    }
  }

  const name = d.pieceName || 'Piece'
  if (d.shape === 'rectangle') {
    splitRun(0, 0, d.length, d.depth, name)
  } else {
    const { returnLength: R, returnWidth: W } = lShapeSizes(d)
    if (fits(d.length, R)) {
      pieces.push({ name, points: outlinePoints(d), x0: 0, y0: 0, w: d.length, h: R })
    } else {
      // Standard practice: seam an L at the inside corner, then treat each leg as a run.
      const mainLen = d.length - W
      seams.push({ a: [mainLen, 0], b: [mainLen, d.depth], fromLeft: mainLen })
      splitRun(0, 0, mainLen, d.depth, `${name} · run`)
      splitRun(mainLen, 0, W, R, `${name} · return`)
    }
  }

  let parts: Part[] = pieces.map((p, i) => ({ ...p, id: `p${i}`, letter: String.fromCharCode(65 + i) }))
  if (pieces.length === 1) parts = [{ ...parts[0], name }]

  const counterParts = parts
  const counterSeams = seams.map((sm) => sm.fromLeft).filter((x) => x > 0 && x < d.length)

  // Backsplash strips: break where the counter breaks, then try smaller strips
  // only if that saves a whole slab.
  function splashParts(pieces: number): Part[] {
    if (!d.backsplash.enabled) return []
    const h = d.backsplash.height
    let cuts = [...counterSeams]
    if (pieces > 1) cuts = Array.from({ length: pieces - 1 }, (_, i) => (d.length * (i + 1)) / pieces)
    const edges = [0, ...cuts.sort((x, y) => x - y), d.length]
    const out: Part[] = []
    for (let i = 0; i < edges.length - 1; i++) {
      const x = edges[i]
      const w = edges[i + 1] - x
      // Still too long for the slab: halve it.
      const n = Math.ceil(w / usableL)
      for (let k = 0; k < n; k++) {
        const sx = x + (w * k) / n
        out.push({
          id: `s${out.length}`,
          letter: '',
          name: 'Backsplash',
          points: rectPoints(sx, -h, w / n, h),
          x0: sx,
          y0: -h,
          w: w / n,
          h,
          isBacksplash: true,
        })
      }
    }
    return out.map((p, i) => ({
      ...p,
      letter: String.fromCharCode(65 + counterParts.length + i),
      name: out.length > 1 ? `Backsplash ${i + 1}` : 'Backsplash',
    }))
  }

  let best = nest([...counterParts, ...splashParts(1)], usableL, usableD)
  for (let pieces = 2; pieces <= 4 && d.backsplash.enabled; pieces++) {
    const trial = nest([...counterParts, ...splashParts(pieces)], usableL, usableD)
    if (trial.slabCount < best.slabCount) best = trial
  }
  parts = best.parts
  const { placements, slabCount, unplaced } = best

  const stoneArea = parts.reduce((acc, p) => acc + polygonArea(p.points), 0)
  return {
    slabSize: slab,
    parts,
    seams,
    placements,
    slabCount,
    stoneArea,
    yield: slabCount ? stoneArea / (slabCount * slab.length * slab.depth) : 0,
    unplaced,
  }
}

/**
 * Guillotine packing: each slab keeps a list of free rectangles. Parts go
 * largest first into the tightest free spot, turned if that fits better. The
 * empty corner of an L-shape becomes a free spot for smaller parts.
 */
function nest(parts: Part[], usableL: number, usableD: number) {
  type Free = { x: number; y: number; w: number; h: number }
  const slabs: Free[][] = []
  const placements: Placement[] = []
  const unplaced: Part[] = []
  const order = [...parts].sort((a, b) => b.w * b.h - a.w * a.h)

  for (const part of order) {
    const options = [
      { w: part.w, h: part.h, rotated: false },
      { w: part.h, h: part.w, rotated: true },
    ].filter((o) => o.w <= usableL && o.h <= usableD)
    if (options.length === 0) {
      unplaced.push(part)
      continue
    }

    let pick: { slab: number; free: number; o: (typeof options)[number]; score: number } | null = null
    slabs.forEach((frees, si) =>
      frees.forEach((f, fi) =>
        options.forEach((o) => {
          if (o.w <= f.w && o.h <= f.h) {
            const score = Math.min(f.w - o.w, f.h - o.h)
            if (!pick || si < pick.slab || (si === pick.slab && score < pick.score)) pick = { slab: si, free: fi, o, score }
          }
        }),
      ),
    )
    if (!pick) {
      slabs.push([{ x: MARGIN, y: MARGIN, w: usableL, h: usableD }])
      const o = [...options].sort((a, b) => a.h - b.h)[0]
      pick = { slab: slabs.length - 1, free: 0, o, score: 0 }
    }

    const { slab, free, o } = pick as { slab: number; free: number; o: (typeof options)[number] }
    const f = slabs[slab][free]
    placements.push({ part, slab, x: f.x, y: f.y, rotated: o.rotated })
    const next: Free[] = [
      { x: f.x + o.w + GAP, y: f.y, w: f.w - o.w - GAP, h: o.h },
      { x: f.x, y: f.y + o.h + GAP, w: f.w, h: f.h - o.h - GAP },
    ]
    // Reuse the inside corner of an L-shaped part.
    if (part.points.length === 6) {
      const xs = part.points.map((p) => p[0] - part.x0)
      const ys = part.points.map((p) => p[1] - part.y0)
      const notchW = Math.min(...xs.filter((x) => x > 0.01)) // inside corner x
      const notchY = Math.min(...ys.filter((y) => y > 0.01)) // run depth
      const n = { x: 0, y: notchY, w: notchW, h: part.h - notchY }
      const r = o.rotated ? { x: part.h - n.y - n.h, y: n.x, w: n.h, h: n.w } : n
      next.push({ x: f.x + r.x, y: f.y + r.y + GAP, w: r.w - GAP, h: r.h - GAP })
    }
    slabs[slab].splice(free, 1, ...next.filter((n) => n.w > 2 && n.h > 2))
  }

  return { parts, placements, slabCount: slabs.length, unplaced }
}
