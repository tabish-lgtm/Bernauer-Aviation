import { OctagonAlert, Pencil, Plus, Trash2, TriangleAlert } from 'lucide-react'

import { CutoutIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cutoutLabels } from '@/lib/geometry'
import type { Drawing, Units } from '@/lib/types'
import { formatLength } from '@/lib/units'
import { cn } from '@/lib/utils'
import type { Issue } from '@/lib/validation'

interface CutoutPanelProps {
  drawing: Drawing
  units: Units
  issues: Issue[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onAdd: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function CutoutPanel({
  drawing,
  units,
  issues,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}: CutoutPanelProps) {
  const fmt = (n: number) => formatLength(n, units)
  const labels = cutoutLabels(drawing.cutouts)

  return (
    <div className="flex flex-col gap-3">
      {drawing.cutouts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-neutral-50 px-6 py-8 text-center">
          <div className="text-muted-foreground flex gap-2">
            <CutoutIcon type="undermount-sink" />
            <CutoutIcon type="cooktop" />
            <CutoutIcon type="faucet" />
          </div>
          <p className="text-muted-foreground text-[13px]">
            No cut-outs yet. Add a sink, cooktop or faucet holes if this piece needs them.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {drawing.cutouts.map((c) => {
            const mine = issues.filter((i) => i.cutoutIds.includes(c.id))
            const problem = mine.some((i) => i.level === 'problem')
            const selected = c.id === selectedId
            const size =
              c.type === 'faucet'
                ? `${c.holeCount ?? 1} × ${fmt(c.width)} hole${(c.holeCount ?? 1) > 1 ? 's' : ''}`
                : `${fmt(c.width)} × ${fmt(c.depth)}`
            return (
              <li key={c.id}>
                <div
                  className={cn(
                    'group animate-rise flex items-center gap-3 rounded-xl border bg-white p-2.5 transition-[border-color,box-shadow] duration-200',
                    selected ? 'border-foreground ring-4 ring-neutral-900/[0.06]' : 'hover:border-neutral-300',
                  )}
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left outline-none"
                    onClick={() => onSelect(selected ? null : c.id)}
                    aria-pressed={selected}
                  >
                    <span
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
                        selected ? 'bg-foreground text-background' : 'bg-muted text-neutral-600',
                      )}
                    >
                      <CutoutIcon type={c.type} className="h-4 w-6" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-[13px] font-medium">
                        {labels[c.id]}
                        {mine.length > 0 &&
                          (problem ? (
                            <OctagonAlert className="size-3.5 text-red-600" aria-label="Has a problem" />
                          ) : (
                            <TriangleAlert className="size-3.5 text-amber-600" aria-label="Needs a check" />
                          ))}
                      </span>
                      <span className="font-mono text-[11px] tabular-nums">{size}</span>
                      <span className="text-muted-foreground text-[11px] leading-snug">
                        {fmt(c.fromLeft)} from left · {fmt(c.fromFront)} from front
                      </span>
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit(c.id)}>
                          <Pencil />
                          <span className="sr-only">Edit {labels[c.id]}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-destructive size-8 hover:bg-red-50"
                          onClick={() => onDelete(c.id)}
                        >
                          <Trash2 />
                          <span className="sr-only">Delete {labels[c.id]}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <Button variant="outline" className="group/add w-full" onClick={onAdd}>
        <Plus className="transition-transform duration-200 group-hover/add:rotate-90" />
        Add cut-out
      </Button>

      {drawing.cutouts.length > 0 && (
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          Drag a cut-out on the drawing to move it. It snaps to ⅛". Select one and use the arrow keys to
          nudge it (hold Shift for 1").
        </p>
      )}
    </div>
  )
}
