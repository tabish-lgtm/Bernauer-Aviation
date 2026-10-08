export type Units = 'in' | 'mm'
export type Shape = 'rectangle' | 'l-shape'
export type Thickness = '2cm' | '3cm'
export type EdgeProfile = 'eased' | 'bevel' | 'bullnose' | 'ogee' | 'raw'
export type CutoutType = 'undermount-sink' | 'dropin-sink' | 'cooktop' | 'faucet'
export type QuoteStatus = 'draft' | 'ready' | 'approved'

/**
 * Edges are named as you look down at the counter standing at the front.
 * A rectangle uses back/right/front/left. An L-shape adds the return leg,
 * which turns toward you on the right-hand side.
 */
export type EdgeId =
  | 'back'
  | 'right'
  | 'front'
  | 'left'
  | 'returnEnd'
  | 'returnInside'

/** All lengths are stored in inches. */
export interface Cutout {
  id: string
  type: CutoutType
  width: number
  depth: number
  /** From the left end of the piece to the left side of the cut-out. */
  fromLeft: number
  /** From the front edge in front of the cut-out to its front side. */
  fromFront: number
  /** Faucet holes only. */
  holeCount?: number
}

export interface Drawing {
  pieceName: string
  shape: Shape
  length: number
  depth: number
  /** L-shape only: overall front-to-back size of the return leg. */
  returnLength: number
  /** L-shape only: side-to-side width of the return leg. */
  returnWidth: number
  thickness: Thickness
  materialId: string
  edges: Record<EdgeId, EdgeProfile>
  backsplash: { enabled: boolean; height: number }
  cutouts: Cutout[]
}

export interface Quote {
  id: string
  number: string
  customer: string
  project: string
  materialId: string
  status: QuoteStatus
  updatedAt: string
  drawing?: Drawing
}
