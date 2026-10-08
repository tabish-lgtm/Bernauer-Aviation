import { CUTOUT_SPECS, getMaterial } from './catalog'
import { edgeSegments } from './geometry'
import type { SlabPlan } from './slab'
import type { CutoutType, Drawing, EdgeProfile } from './types'

/** Mock shop rates. */
const FABRICATION_PER_SQFT = 28
const EDGE_PER_FOOT: Record<EdgeProfile, number> = { eased: 0, raw: 0, bevel: 9, bullnose: 16, ogee: 24 }
const CUTOUT_FEE: Record<CutoutType, number> = {
  'undermount-sink': 275,
  'dropin-sink': 150,
  cooktop: 175,
  faucet: 35,
}
const SEAM_FEE = 85

export interface EstimateLine {
  label: string
  detail: string
  amount: number
}

export function estimate(d: Drawing, plan: SlabPlan) {
  const m = getMaterial(d.materialId)
  const sqft = plan.stoneArea / 144
  const lines: EstimateLine[] = [
    { label: m.name, detail: `${sqft.toFixed(1)} ft² × $${m.pricePerSqft}`, amount: sqft * m.pricePerSqft },
    { label: 'Fabrication & install', detail: `${sqft.toFixed(1)} ft² × $${FABRICATION_PER_SQFT}`, amount: sqft * FABRICATION_PER_SQFT },
  ]

  const edgeFeet: Partial<Record<EdgeProfile, number>> = {}
  for (const s of edgeSegments(d)) {
    const p = d.edges[s.id]
    edgeFeet[p] = (edgeFeet[p] ?? 0) + Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]) / 12
  }
  for (const [p, ft] of Object.entries(edgeFeet) as [EdgeProfile, number][]) {
    if (EDGE_PER_FOOT[p] > 0) {
      const name = p[0].toUpperCase() + p.slice(1)
      lines.push({ label: `${name} edge`, detail: `${ft.toFixed(1)} ft × $${EDGE_PER_FOOT[p]}`, amount: ft * EDGE_PER_FOOT[p] })
    }
  }

  for (const c of d.cutouts) {
    const holes = c.type === 'faucet' ? (c.holeCount ?? 1) : 1
    lines.push({
      label: CUTOUT_SPECS[c.type].name,
      detail: holes > 1 ? `${holes} × $${CUTOUT_FEE[c.type]}` : 'Cut and polish',
      amount: holes * CUTOUT_FEE[c.type],
    })
  }

  if (plan.seams.length) {
    lines.push({ label: 'Seams', detail: `${plan.seams.length} × $${SEAM_FEE}`, amount: plan.seams.length * SEAM_FEE })
  }

  const total = lines.reduce((acc, l) => acc + l.amount, 0)
  return { lines, total, sqft }
}

export function formatMoney(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}
