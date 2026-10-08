import type { Material } from '@/lib/catalog'

/**
 * SVG filter that paints a believable stone surface: thin veins for marble and
 * quartzite, flecks for granite, faint clouding for quartz. `unitsPerInch`
 * keeps the grain the same real-world size whatever the drawing's units.
 */
export function StoneFilter({ id, material, unitsPerInch }: { id: string; material: Material; unitsPerInch: number }) {
  const f = (n: number) => n / unitsPerInch
  const dark = ['absolute-black', 'steel-grey'].includes(material.id)

  if (material.texture === 'speckled') {
    const fleck = dark ? '0.82 0.82 0.84' : '0.2 0.2 0.22'
    const [r, g, b] = fleck.split(' ')
    return (
      <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency={f(1.1)} numOctaves={2} seed={4} />
        <feColorMatrix type="matrix" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  1 0 0 0 0`} />
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues={dark ? '0 0 0 0 0.35 0.75' : '0 0 0 0 0.25 0.5'} />
        </feComponentTransfer>
      </filter>
    )
  }

  if (material.texture === 'veined') {
    const tone = material.id === 'calacatta-gold' ? '0.62 0.52 0.36' : material.id === 'taj-mahal' ? '0.55 0.46 0.36' : '0.42 0.44 0.48'
    const [r, g, b] = tone.split(' ')
    return (
      <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency={`${f(0.018)} ${f(0.055)}`} numOctaves={5} seed={11} result="noise" />
        <feColorMatrix in="noise" type="matrix" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  1 0 0 0 0`} result="tinted" />
        <feComponentTransfer in="tinted" result="veins">
          <feFuncA type="table" tableValues="0 0 0 0 0.05 0.75 0.05 0 0 0 0" />
        </feComponentTransfer>
        <feComponentTransfer in="tinted" result="clouds">
          <feFuncA type="table" tableValues="0 0 0.02 0.08 0.12 0.06 0" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="clouds" />
          <feMergeNode in="veins" />
        </feMerge>
      </filter>
    )
  }

  return (
    <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency={f(0.05)} numOctaves={3} seed={2} />
      <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.52  1 0 0 0 0" />
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0 0.05 0.1 0.04 0" />
      </feComponentTransfer>
    </filter>
  )
}
