import { useState, type KeyboardEvent } from 'react'

import { EdgeProfileIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { EDGE_PROFILES, edgeProfileName } from '@/lib/catalog'
import type { EdgeId, EdgeProfile, Shape } from '@/lib/types'
import { cn } from '@/lib/utils'

const EDGE_NAMES: Record<EdgeId, string> = {
  back: 'Back edge',
  right: 'Right end',
  front: 'Front edge',
  left: 'Left end',
  returnEnd: 'End of the return',
  returnInside: 'Inside of the return',
}

type Seg = { id: EdgeId; a: [number, number]; b: [number, number]; label: [number, number]; rotate?: boolean }

/* A stylised plan of the piece (not to scale): big, clear targets beat accuracy here. */
const RECT_SEGS: Seg[] = [
  { id: 'back', a: [36, 36], b: [204, 36], label: [120, 24] },
  { id: 'right', a: [204, 36], b: [204, 92], label: [220, 64], rotate: true },
  { id: 'front', a: [204, 92], b: [36, 92], label: [120, 108] },
  { id: 'left', a: [36, 92], b: [36, 36], label: [20, 64], rotate: true },
]

const L_SEGS: Seg[] = [
  { id: 'back', a: [36, 24], b: [204, 24], label: [120, 12] },
  { id: 'right', a: [204, 24], b: [204, 112], label: [220, 68], rotate: true },
  { id: 'returnEnd', a: [204, 112], b: [156, 112], label: [180, 126] },
  { id: 'returnInside', a: [156, 112], b: [156, 64], label: [142, 88], rotate: true },
  { id: 'front', a: [156, 64], b: [36, 64], label: [96, 78] },
  { id: 'left', a: [36, 64], b: [36, 24], label: [20, 44], rotate: true },
]

interface EdgeSelectorProps {
  shape: Shape
  edges: Record<EdgeId, EdgeProfile>
  onChange: (edges: Record<EdgeId, EdgeProfile>) => void
}

export function EdgeSelector({ shape, edges, onChange }: EdgeSelectorProps) {
  const segs = shape === 'rectangle' ? RECT_SEGS : L_SEGS
  const [selected, setSelected] = useState<EdgeId>('front')
  const active = segs.some((s) => s.id === selected) ? selected : 'front'
  const profile = edges[active]
  const outline = segs.map((s) => s.a.join(',')).join(' ')

  function onKey(e: KeyboardEvent, id: EdgeId) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSelected(id)
    }
  }

  function applyToAll() {
    const next = { ...edges }
    for (const s of segs) next[s.id] = profile
    onChange(next)
  }

  const allSame = segs.every((s) => edges[s.id] === profile)

  return (
    <div className="flex flex-col gap-3.5">
      <div className="rounded-2xl bg-neutral-50 p-3">
        <svg viewBox="0 0 240 136" className="mx-auto block h-auto w-full max-w-[280px]" aria-label="Choose an edge">
          <polygon points={outline} className="fill-primary/[0.06]" />
          {segs.map((s) => {
            const isSel = s.id === active
            const raw = edges[s.id] === 'raw'
            return (
              <g
                key={s.id}
                role="button"
                tabIndex={0}
                aria-label={`${EDGE_NAMES[s.id]}: ${edgeProfileName(edges[s.id])}`}
                aria-pressed={isSel}
                onClick={() => setSelected(s.id)}
                onKeyDown={(e) => onKey(e, s.id)}
                className="group cursor-pointer outline-none"
              >
                <line x1={s.a[0]} y1={s.a[1]} x2={s.b[0]} y2={s.b[1]} stroke="transparent" strokeWidth={22} />
                <line
                  x1={s.a[0]}
                  y1={s.a[1]}
                  x2={s.b[0]}
                  y2={s.b[1]}
                  strokeLinecap="round"
                  strokeDasharray={raw && !isSel ? '5 4' : undefined}
                  className={cn(
                    'transition-all',
                    isSel
                      ? 'stroke-primary [stroke-width:6]'
                      : raw
                        ? 'stroke-neutral-400 [stroke-width:2.5] group-hover:stroke-neutral-600'
                        : 'stroke-neutral-700 [stroke-width:3] group-hover:stroke-primary/70',
                    'group-focus-visible:stroke-primary',
                  )}
                />
                <text
                  x={s.label[0]}
                  y={s.label[1]}
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={s.rotate ? `rotate(-90 ${s.label[0]} ${s.label[1]})` : undefined}
                  className={cn(
                    'pointer-events-none text-[9px] font-semibold tracking-wide uppercase transition-colors duration-200',
                    isSel ? 'fill-primary' : 'fill-neutral-500',
                  )}
                >
                  {edgeProfileName(edges[s.id])}
                </text>
              </g>
            )
          })}
        </svg>
        <p className="text-muted-foreground pt-1 text-center text-xs">Tap an edge to change it</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[13px]">
          <span className="text-muted-foreground">Selected: </span>
          <span key={active} className="animate-rise inline-block font-medium">
            {EDGE_NAMES[active]}
          </span>
        </p>
        <ToggleGroup
          type="single"
          value={profile}
          onValueChange={(v) => v && onChange({ ...edges, [active]: v as EdgeProfile })}
          className="grid w-full grid-cols-1 gap-1.5"
          aria-label={`Edge profile for the ${EDGE_NAMES[active].toLowerCase()}`}
        >
          {EDGE_PROFILES.map((p) => (
            <ToggleGroupItem
              key={p.id}
              value={p.id}
              className="data-[state=on]:border-foreground text-foreground h-auto min-h-10 justify-start gap-3 rounded-xl border px-3 py-1.5 text-left transition-[border-color,background-color] duration-150 hover:border-neutral-300 hover:bg-neutral-50 data-[state=on]:bg-neutral-50 data-[state=on]:shadow-none"
            >
              <EdgeProfileIcon profile={p.id} />
              <span className="flex flex-col">
                <span className="text-[13px] font-medium">{p.name}</span>
                <span className="text-muted-foreground text-[11px] font-normal">{p.hint}</span>
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {!allSame && (
          <Button variant="link" size="sm" className="h-8 self-start px-0" onClick={applyToAll}>
            Use {edgeProfileName(profile)} on every edge
          </Button>
        )}
      </div>
    </div>
  )
}
