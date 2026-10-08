import type { CutoutType, EdgeProfile, Thickness } from './types'

export interface Material {
  id: string
  name: string
  kind: 'Granite' | 'Marble' | 'Quartz' | 'Quartzite'
  /** Swatch color for the picker and a faint tint on the drawing. */
  swatch: string
}

export const MATERIALS: Material[] = [
  { id: 'absolute-black', name: 'Absolute Black', kind: 'Granite', swatch: '#26282b' },
  { id: 'carrara', name: 'Carrara Marble', kind: 'Marble', swatch: '#e9e7e2' },
  { id: 'quartz-white', name: 'Quartz White', kind: 'Quartz', swatch: '#f4f3ef' },
  { id: 'steel-grey', name: 'Steel Grey', kind: 'Granite', swatch: '#5d6166' },
  { id: 'taj-mahal', name: 'Taj Mahal', kind: 'Quartzite', swatch: '#e4d8c3' },
  { id: 'calacatta-gold', name: 'Calacatta Gold', kind: 'Quartz', swatch: '#efe9de' },
]

export function getMaterial(id: string) {
  return MATERIALS.find((m) => m.id === id) ?? MATERIALS[0]
}

export const THICKNESS_LABEL: Record<Thickness, string> = {
  '2cm': '2 cm (¾")',
  '3cm': '3 cm (1¼")',
}

export const EDGE_PROFILES: { id: EdgeProfile; name: string; hint: string }[] = [
  { id: 'eased', name: 'Eased', hint: 'Square with softened corners' },
  { id: 'bevel', name: 'Bevel', hint: 'Angled top corner' },
  { id: 'bullnose', name: 'Bullnose', hint: 'Fully rounded' },
  { id: 'ogee', name: 'Ogee', hint: 'Decorative S-curve' },
  { id: 'raw', name: 'Unfinished', hint: 'Against a wall or appliance' },
]

export function edgeProfileName(id: EdgeProfile) {
  return EDGE_PROFILES.find((p) => p.id === id)?.name ?? id
}

export interface CutoutSpec {
  type: CutoutType
  name: string
  shortName: string
  hint: string
  width: number
  depth: number
  /** Default distance from the front edge. */
  fromFront: number
}

export const CUTOUT_SPECS: Record<CutoutType, CutoutSpec> = {
  'undermount-sink': {
    type: 'undermount-sink',
    name: 'Undermount sink',
    shortName: 'Sink',
    hint: 'Mounted below the stone. Edges are polished.',
    width: 30,
    depth: 17,
    fromFront: 3,
  },
  'dropin-sink': {
    type: 'dropin-sink',
    name: 'Drop-in sink',
    shortName: 'Sink',
    hint: 'Rim sits on top of the stone.',
    width: 31.5,
    depth: 19.5,
    fromFront: 2.5,
  },
  cooktop: {
    type: 'cooktop',
    name: 'Cooktop',
    shortName: 'Cooktop',
    hint: 'Use the cut-out size from the cooktop spec sheet.',
    width: 29.25,
    depth: 19.75,
    fromFront: 2.75,
  },
  faucet: {
    type: 'faucet',
    name: 'Faucet hole(s)',
    shortName: 'Faucet',
    hint: 'Standard 1⅜" holes, 4" apart center to center.',
    width: 1.375,
    depth: 1.375,
    fromFront: 21,
  },
}

/** Center-to-center spacing between faucet holes. */
export const FAUCET_SPACING = 4

/** Mock limit for one slab. */
export const SLAB = { length: 126, depth: 63 }

/** Minimum stone to leave around any cut-out. */
export const MIN_STONE = 2
