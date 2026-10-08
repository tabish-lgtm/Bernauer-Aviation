import { CUTOUT_SPECS } from './catalog'
import { cutoutRect, footprintWidth, notchRect, rectGap, rectsOverlap } from './geometry'
import type { Cutout, CutoutType, Drawing, EdgeId, EdgeProfile } from './types'
import { snapEighth } from './units'

export const ALL_EDGES: EdgeId[] = ['back', 'right', 'returnEnd', 'returnInside', 'front', 'left']

export function allEdges(profile: EdgeProfile): Record<EdgeId, EdgeProfile> {
  return Object.fromEntries(ALL_EDGES.map((e) => [e, profile])) as Record<EdgeId, EdgeProfile>
}

export function newDrawing(materialId: string): Drawing {
  return {
    pieceName: 'Kitchen countertop',
    shape: 'rectangle',
    length: 96,
    depth: 25.5,
    returnLength: 60,
    returnWidth: 25.5,
    thickness: '3cm',
    materialId,
    edges: allEdges('eased'),
    backsplash: { enabled: false, height: 4 },
    cutouts: [],
    slabSize: 'standard',
  }
}

export function newId() {
  return Math.random().toString(36).slice(2, 9)
}

/**
 * Sensible starting position for a new cut-out: faucet holes go behind the
 * first sink; everything else goes on the main run where it doesn't collide.
 */
export function placeNewCutout(d: Drawing, type: CutoutType): Cutout {
  const spec = CUTOUT_SPECS[type]
  const base: Cutout = {
    id: newId(),
    type,
    width: spec.width,
    depth: spec.depth,
    fromLeft: 0,
    fromFront: spec.fromFront,
    holeCount: type === 'faucet' ? 1 : undefined,
  }
  const w = footprintWidth(base)

  if (type === 'faucet') {
    const sink = d.cutouts.find((c) => c.type !== 'faucet' && c.type !== 'cooktop')
    if (sink) {
      return {
        ...base,
        fromLeft: snapEighth(sink.fromLeft + sink.width / 2 - w / 2),
        fromFront: snapEighth(sink.fromFront + sink.depth + 2),
      }
    }
    return {
      ...base,
      fromLeft: snapEighth(mainRunLength(d) / 2 - w / 2),
      fromFront: snapEighth(Math.max(d.depth - 2 - base.depth - 2, 2)),
    }
  }

  const run = mainRunLength(d)
  const candidates = [0.5, 0.25, 0.75, 0.15, 0.85].map((f) => snapEighth(run * f - w / 2))
  const existing = d.cutouts.map((c) => cutoutRect(d, c))
  for (const fromLeft of candidates) {
    const trial = cutoutRect(d, { ...base, fromLeft })
    const clear = existing.every((r) => !rectsOverlap(r, trial) && rectGap(r, trial) >= 2)
    if (clear && trial.x >= 2 && trial.x + trial.w <= run - 2) return { ...base, fromLeft }
  }
  return { ...base, fromLeft: candidates[0] }
}

/** Length of the straight run along the back wall, excluding the L return. */
function mainRunLength(d: Drawing) {
  const notch = notchRect(d)
  return notch ? notch.w : d.length
}
