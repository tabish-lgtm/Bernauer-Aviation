import { useState } from 'react'

import { DimensionInput } from '@/components/DimensionInput'
import { CutoutIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { CUTOUT_SPECS } from '@/lib/catalog'
import { placeNewCutout } from '@/lib/drawing'
import type { Cutout, CutoutType, Drawing, Units } from '@/lib/types'
import { cn } from '@/lib/utils'
import { validateDrawing } from '@/lib/validation'

import { IssueList } from './IssueList'

const TYPES: CutoutType[] = ['undermount-sink', 'dropin-sink', 'cooktop', 'faucet']

interface CutoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  drawing: Drawing
  units: Units
  /** The cut-out being edited, or null to add a new one. */
  editing: Cutout | null
  onSubmit: (cutout: Cutout) => void
}

export function CutoutDialog({ open, onOpenChange, drawing, units, editing, onSubmit }: CutoutDialogProps) {
  const [draft, setDraft] = useState<Cutout | null>(editing)
  const isEdit = !!editing

  function pickType(type: CutoutType) {
    if (draft?.type === type) return
    if (!draft || !isEdit) {
      setDraft(placeNewCutout(drawing, type))
      return
    }
    // Editing: keep where it is, but reset to the new type's standard size.
    const spec = CUTOUT_SPECS[type]
    setDraft({
      ...draft,
      type,
      width: spec.width,
      depth: spec.depth,
      holeCount: type === 'faucet' ? 1 : undefined,
    })
  }

  const update = (patch: Partial<Cutout>) => setDraft((c) => (c ? { ...c, ...patch } : c))

  const previewIssues = draft
    ? validateDrawing(
        {
          ...drawing,
          cutouts: isEdit
            ? drawing.cutouts.map((c) => (c.id === draft.id ? draft : c))
            : [...drawing.cutouts, draft],
        },
        units,
      ).filter((i) => i.cutoutIds.includes(draft.id))
    : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit cut-out' : 'Add a cut-out'}</DialogTitle>
          <DialogDescription>
            {draft
              ? 'Standard sizes are filled in. Change anything that differs on the spec sheet.'
              : 'What needs to be cut out of the stone?'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Cut-out type">
          {TYPES.map((type) => {
            const spec = CUTOUT_SPECS[type]
            const active = draft?.type === type
            return (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => pickType(type)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-colors outline-none focus-visible:ring-4 focus-visible:ring-neutral-900/10',
                  active ? 'border-foreground bg-neutral-50' : 'hover:bg-neutral-50',
                  draft && !active && 'py-2.5',
                )}
              >
                <CutoutIcon type={type} className={active ? 'text-foreground' : 'text-neutral-400'} />
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-medium">{spec.name}</span>
                  {!draft && <span className="text-muted-foreground text-xs leading-snug">{spec.hint}</span>}
                </span>
              </button>
            )
          })}
        </div>

        {draft && (
          <div className="flex flex-col gap-6">
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-sm font-semibold">Size</legend>
              {draft.type === 'faucet' ? (
                <div className="grid grid-cols-2 gap-3">
                  <DimensionInput
                    id="hole-size"
                    label="Hole size"
                    value={draft.width}
                    units={units}
                    min={0.5}
                    max={4}
                    onChange={(v) => update({ width: v, depth: v })}
                    helper='Most faucets need 1⅜".'
                  />
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium" id="hole-count-label">
                      Number of holes
                    </span>
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      value={String(draft.holeCount ?? 1)}
                      onValueChange={(v) => v && update({ holeCount: Number(v) })}
                      className="w-full"
                      aria-labelledby="hole-count-label"
                    >
                      {['1', '2', '3'].map((n) => (
                        <ToggleGroupItem key={n} value={n} className="h-11 font-mono">
                          {n}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                    <p className="text-muted-foreground text-xs">Spaced 4" apart, center to center.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <DimensionInput
                    id="cutout-width"
                    label="Width"
                    value={draft.width}
                    units={units}
                    min={2}
                    max={60}
                    onChange={(width) => update({ width })}
                    helper="Side to side."
                  />
                  <DimensionInput
                    id="cutout-depth"
                    label="Depth"
                    value={draft.depth}
                    units={units}
                    min={2}
                    max={40}
                    onChange={(depth) => update({ depth })}
                    helper="Front to back."
                  />
                </div>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3 text-sm font-semibold">Position</legend>
              <div className="grid grid-cols-2 gap-3">
                <DimensionInput
                  id="from-left"
                  label="From left end"
                  value={draft.fromLeft}
                  units={units}
                  min={0}
                  max={240}
                  onChange={(fromLeft) => update({ fromLeft })}
                  helper={`To the left side of the ${draft.type === 'faucet' ? 'first hole' : 'cut-out'}.`}
                />
                <DimensionInput
                  id="from-front"
                  label="From front edge"
                  value={draft.fromFront}
                  units={units}
                  min={0}
                  max={240}
                  onChange={(fromFront) => update({ fromFront })}
                  helper={`To the front side of the ${draft.type === 'faucet' ? 'holes' : 'cut-out'}.`}
                />
              </div>
            </fieldset>

            <IssueList issues={previewIssues} />
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="lg" disabled={!draft} onClick={() => draft && onSubmit(draft)}>
            {isEdit ? 'Save changes' : 'Add to drawing'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
