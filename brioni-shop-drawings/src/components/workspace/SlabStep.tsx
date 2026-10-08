import { useId } from 'react'
import { Scissors, Sparkles } from 'lucide-react'

import { StoneFilter } from '@/components/StoneTexture'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SLAB_SIZES, getMaterial } from '@/lib/catalog'
import { cutoutRect } from '@/lib/geometry'
import type { Placement, SlabPlan } from '@/lib/slab'
import type { Drawing, SlabSize, Units } from '@/lib/types'
import { formatLength } from '@/lib/units'
import { cn } from '@/lib/utils'

interface SlabStepProps {
  drawing: Drawing
  plan: SlabPlan
  units: Units
  onSlabSizeChange: (size: SlabSize) => void
}

/**
 * Replaces "Slab layout" and "Vein match" with one automatic view: pieces are
 * seamed and nested for you, and the only choice is the slab size.
 */
export function SlabStep({ drawing, plan, units, onSlabSizeChange }: SlabStepProps) {
  const fmt = (n: number) => formatLength(n, units)
  const material = getMaterial(drawing.materialId)
  const slabs = Array.from({ length: plan.slabCount }, (_, i) => plan.placements.filter((p) => p.slab === i))
  const yieldPct = Math.round(plan.yield * 100)

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
      <main className="flex min-h-0 flex-col gap-6 overflow-y-auto p-4 md:p-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Slab layout</h1>
          <p className="text-muted-foreground text-sm">
            Laid out automatically. Seams are kept at least 3" away from sinks and cooktops.
          </p>
        </div>

        {slabs.map((placements, i) => (
          <section key={i} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-medium">
                Slab {i + 1}
                {plan.slabCount > 1 && <span className="text-muted-foreground"> of {plan.slabCount}</span>}
              </h2>
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {fmt(plan.slabSize.length)} × {fmt(plan.slabSize.depth)} · {material.name}
              </span>
            </div>
            <div className="rounded-2xl border bg-white p-3 md:p-5">
              <SlabSvg drawing={drawing} plan={plan} placements={placements} />
            </div>
          </section>
        ))}

        {plan.unplaced.length > 0 && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            {plan.unplaced.map((p) => p.name).join(', ')} is too deep for any slab. Check the depth on the Draw step.
          </p>
        )}
      </main>

      <aside className="flex min-h-0 flex-col gap-6 overflow-y-auto border-t bg-white p-6 lg:border-t-0 lg:border-l">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Slabs needed" value={String(plan.slabCount)} />
          <Stat label="Yield" value={`${yieldPct}%`} hint={yieldPct >= 60 ? 'Good use of stone' : 'Offcuts can be resold'} />
          <Stat label="Stone used" value={`${(plan.stoneArea / 144).toFixed(1)} ft²`} />
          <Stat label="Seams" value={String(plan.seams.length)} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium" id="slab-size-label">
            Slab size
          </span>
          <ToggleGroup
            type="single"
            variant="outline"
            value={drawing.slabSize}
            onValueChange={(v) => v && onSlabSizeChange(v as SlabSize)}
            className="w-full"
            aria-labelledby="slab-size-label"
          >
            {(Object.keys(SLAB_SIZES) as SlabSize[]).map((k) => (
              <ToggleGroupItem key={k} value={k} className="h-auto flex-col gap-0 py-2">
                <span>{SLAB_SIZES[k].name}</span>
                <span className="font-mono text-[11px] font-normal tabular-nums opacity-70">
                  {fmt(SLAB_SIZES[k].length)} × {fmt(SLAB_SIZES[k].depth)}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="text-muted-foreground text-xs">Jumbo slabs can avoid a seam on long runs.</p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">Pieces to cut</h3>
          <ul className="flex flex-col divide-y rounded-xl border">
            {plan.parts.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                <span className="bg-foreground text-background flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  {p.letter}
                </span>
                <span className="min-w-0 flex-1 truncate">{p.name}</span>
                <span className="text-muted-foreground font-mono text-xs tabular-nums">
                  {fmt(p.w)} × {fmt(p.h)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {plan.seams.length > 0 ? (
          <div className="flex gap-3 rounded-xl bg-neutral-50 p-4 text-sm">
            <Scissors className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div className="flex flex-col gap-1">
              {plan.seams.map((s, i) => (
                <span key={i}>
                  Seam {plan.seams.length > 1 ? i + 1 : ''} at <span className="font-mono tabular-nums">{fmt(s.fromLeft)}</span> from the left end
                </span>
              ))}
              <span className="text-muted-foreground text-xs">Also marked on the shop drawing.</span>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 rounded-xl bg-neutral-50 p-4 text-sm">
            <Sparkles className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <span>No seams needed. Every piece comes from a single slab.</span>
          </div>
        )}
      </aside>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border p-4">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
      {hint && <span className="text-muted-foreground text-[11px] leading-tight">{hint}</span>}
    </div>
  )
}

function SlabSvg({ drawing, plan, placements }: { drawing: Drawing; plan: SlabPlan; placements: Placement[] }) {
  const uid = useId().replace(/:/g, '')
  const material = getMaterial(drawing.materialId)
  const { length: L, depth: D } = plan.slabSize
  const dark = ['absolute-black', 'steel-grey'].includes(material.id)
  const ink = dark ? '#fafafa' : '#18181b'

  return (
    <svg viewBox={`-2 -2 ${L + 4} ${D + 4}`} className="block h-auto w-full" role="img" aria-label="Slab layout">
      <defs>
        <StoneFilter id={`slab-${uid}`} material={material} unitsPerInch={1} />
        <pattern id={`offcut-${uid}`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="3" stroke="#000" strokeOpacity="0.1" strokeWidth="0.3" />
        </pattern>
        <clipPath id={`clip-${uid}`}>
          <rect width={L} height={D} rx={1.5} />
        </clipPath>
      </defs>

      {/* The slab itself, washed out: anything not covered by a piece is offcut. */}
      <g clipPath={`url(#clip-${uid})`}>
        <rect width={L} height={D} fill={material.swatch} />
        <rect width={L} height={D} filter={`url(#slab-${uid})`} />
        <rect width={L} height={D} fill="#fafafa" opacity={0.82} />
        <rect width={L} height={D} fill={`url(#offcut-${uid})`} />
      </g>
      <rect width={L} height={D} rx={1.5} fill="none" stroke="#d4d4d8" strokeWidth={1} vectorEffect="non-scaling-stroke" />

      {placements.map(({ part, x, y, rotated }) => {
        const transform = `translate(${x} ${y})${rotated ? ` translate(${part.h} 0) rotate(90)` : ''} translate(${-part.x0} ${-part.y0})`
        const pw = rotated ? part.h : part.w
        const ph = rotated ? part.w : part.h
        const small = Math.min(part.w, part.h) < 10
        // Thin strips get the letter in the middle; bigger pieces in a corner
        // that is always stone (an L-shape's notch sits bottom-left, or
        // top-left once turned), clear of sinks and cooktops.
        const cx = small ? x + pw / 2 : rotated ? x + pw - 5 : x + 5
        const cy = small ? y + ph / 2 : y + 5
        const holes = part.isBacksplash
          ? []
          : drawing.cutouts
              .map((c) => ({ c, r: cutoutRect(drawing, c) }))
              .filter(({ r }) => r.x + r.w / 2 >= part.x0 && r.x + r.w / 2 <= part.x0 + part.w && r.y >= part.y0 - 0.01 && r.y + r.h <= part.y0 + part.h + 0.01)
        return (
          <g key={part.id}>
            <clipPath id={`part-${uid}-${part.id}`}>
              <polygon points={part.points.map((p) => p.join(',')).join(' ')} transform={transform} />
            </clipPath>
            <g clipPath={`url(#part-${uid}-${part.id})`}>
              <rect width={L} height={D} fill={material.swatch} />
              <rect width={L} height={D} filter={`url(#slab-${uid})`} />
            </g>
            <g transform={transform}>
              <polygon
                points={part.points.map((p) => p.join(',')).join(' ')}
                fill="none"
                stroke={ink}
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
              />
              {holes.map(({ c, r }) =>
                c.type === 'faucet' ? (
                  Array.from({ length: c.holeCount ?? 1 }, (_, k) => (
                    <circle
                      key={`${c.id}-${k}`}
                      cx={r.x + c.width / 2 + k * 4}
                      cy={r.y + r.h / 2}
                      r={c.width / 2}
                      fill="#fff"
                      stroke={ink}
                      strokeWidth={1}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))
                ) : (
                  <rect
                    key={c.id}
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    rx={1}
                    fill="#fff"
                    stroke={ink}
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                ),
              )}
            </g>
            <g className={cn('pointer-events-none')}>
              <circle cx={cx} cy={cy} r={small ? 2.4 : 3.4} fill={ink} />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={small ? 2.6 : 3.6}
                fontWeight={600}
                fill={dark ? '#18181b' : '#fff'}
                fontFamily="Inter Variable, sans-serif"
              >
                {part.letter}
              </text>
            </g>
          </g>
        )
      })}
    </svg>
  )
}
