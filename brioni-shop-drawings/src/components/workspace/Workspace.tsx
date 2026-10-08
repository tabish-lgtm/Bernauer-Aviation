import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Save, Send } from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAnimatedNumber } from '@/hooks/use-animated-number'

import { StatusBadge } from '@/components/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useMediaQuery } from '@/hooks/use-media-query'
import { THICKNESS_LABEL, getMaterial } from '@/lib/catalog'
import { newDrawing } from '@/lib/drawing'
import { formatDate, formatTime } from '@/lib/format'
import { boundingSize } from '@/lib/geometry'
import { estimate, formatMoney } from '@/lib/pricing'
import { planSlabs, type SlabPlan } from '@/lib/slab'
import type { Cutout, Drawing, Quote, Units } from '@/lib/types'
import { formatLength } from '@/lib/units'
import { cn } from '@/lib/utils'
import { validateDrawing, type Issue } from '@/lib/validation'

import { ApprovalDialog } from './ApprovalDialog'
import { CutoutDialog } from './CutoutDialog'
import { CutoutPanel } from './CutoutPanel'
import { CutoutSchedule } from './CutoutSchedule'
import { DrawingCanvas } from './DrawingCanvas'
import { IssueList } from './IssueList'
import { PieceForm } from './PieceForm'
import { ReviewStep } from './ReviewStep'
import { SlabStep } from './SlabStep'

type Step = 'draw' | 'slab' | 'review'
const STEPS: { id: Step; label: string }[] = [
  { id: 'draw', label: 'Draw' },
  { id: 'slab', label: 'Slab' },
  { id: 'review', label: 'Review' },
]

interface WorkspaceProps {
  quote: Quote
  onBack: () => void
  onSave: (drawing: Drawing) => void
  onApprove: (drawing: Drawing) => void
}

export function Workspace({ quote, onBack, onSave, onApprove }: WorkspaceProps) {
  const [drawing, setDrawing] = useState<Drawing>(
    () => quote.drawing ?? { ...newDrawing(quote.materialId), pieceName: quote.project },
  )
  const [step, setStep] = useState<Step>('draw')
  const [units, setUnits] = useState<Units>('in')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dirty, setDirty] = useState(!quote.drawing)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [justSaved, setJustSaved] = useState(false)
  const [cutoutDialog, setCutoutDialog] = useState({ open: false, editingId: null as string | null, key: 0 })
  const [approvalOpen, setApprovalOpen] = useState(false)
  const [today] = useState(() => formatDate(new Date()))

  const wide = useMediaQuery('(min-width: 1280px)')
  const medium = useMediaQuery('(min-width: 1024px)')

  const issues = useMemo(() => validateDrawing(drawing, units), [drawing, units])
  const plan = useMemo(() => planSlabs(drawing), [drawing])
  const total = useMemo(() => estimate(drawing, plan).total, [drawing, plan])
  const shownTotal = useAnimatedNumber(total)

  // Brief check-mark after saving.
  useEffect(() => {
    if (!justSaved) return
    const t = setTimeout(() => setJustSaved(false), 1400)
    return () => clearTimeout(t)
  }, [justSaved])

  const change = useCallback((patch: Partial<Drawing>) => {
    setDrawing((d) => ({ ...d, ...patch }))
    setDirty(true)
  }, [])

  const setCutouts = (fn: (cs: Cutout[]) => Cutout[]) => {
    setDrawing((d) => ({ ...d, cutouts: fn(d.cutouts) }))
    setDirty(true)
  }

  const save = useCallback(() => {
    onSave(drawing)
    setDirty(false)
    setSavedAt(new Date())
    setJustSaved(true)
  }, [drawing, onSave])

  // Ctrl/⌘ + S saves, like every other tool people already know.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [save])

  function openAdd() {
    setCutoutDialog((s) => ({ open: true, editingId: null, key: s.key + 1 }))
  }

  function openEdit(id: string) {
    setSelectedId(id)
    setCutoutDialog((s) => ({ open: true, editingId: id, key: s.key + 1 }))
  }

  function submitCutout(c: Cutout) {
    setCutouts((cs) => (cs.some((x) => x.id === c.id) ? cs.map((x) => (x.id === c.id ? c : x)) : [...cs, c]))
    setSelectedId(c.id)
    setCutoutDialog((s) => ({ ...s, open: false }))
  }

  function deleteCutout(id: string) {
    setCutouts((cs) => cs.filter((c) => c.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const editing = drawing.cutouts.find((c) => c.id === cutoutDialog.editingId) ?? null
  const approved = quote.status === 'approved' && !dirty
  const stepIndex = STEPS.findIndex((s) => s.id === step)

  // One primary action at a time: it always moves the job forward.
  const primary =
    step === 'draw' ? (
      <Button onClick={() => setStep('slab')}>
        <span>
          Next<span className="hidden sm:inline">: slab</span>
        </span>
        <ArrowRight />
      </Button>
    ) : step === 'slab' ? (
      <Button onClick={() => setStep('review')}>
        <span>
          Next<span className="hidden sm:inline">: review</span>
        </span>
        <ArrowRight />
      </Button>
    ) : (
      <Button
        onClick={() => setApprovalOpen(true)}
        disabled={approved}
        className={cn(approved && 'bg-emerald-600 disabled:opacity-100')}
      >
        {approved ? <Check /> : <Send />}
        <span className="hidden sm:inline">{approved ? 'Approved' : 'Send for approval'}</span>
      </Button>
    )

  const pieceForm = <PieceForm drawing={drawing} units={units} onUnitsChange={setUnits} onChange={change} />
  const cutoutPanel = (
    <CutoutPanel
      drawing={drawing}
      units={units}
      issues={issues}
      selectedId={selectedId}
      onSelect={setSelectedId}
      onAdd={openAdd}
      onEdit={openEdit}
      onDelete={deleteCutout}
    />
  )
  const canvas = (
    <CanvasArea
      drawing={drawing}
      units={units}
      quote={quote}
      date={today}
      issues={issues}
      plan={plan}
      selectedId={selectedId}
      onSelect={setSelectedId}
      onMoveCutout={(id, offsets) => setCutouts((cs) => cs.map((c) => (c.id === id ? { ...c, ...offsets } : c)))}
      onEditCutout={openEdit}
    />
  )

  return (
    <>
      <div className="no-print flex h-dvh flex-col bg-neutral-50/60">
        {/* ── Top bar ── */}
        <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b bg-white px-3 md:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Back to quotes"
                  onClick={() => {
                    if (dirty) save()
                    onBack()
                  }}
                >
                  <ArrowLeft />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to quotes (saves your work)</TooltipContent>
            </Tooltip>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-[13px] font-semibold">{quote.customer}</span>
              <span className="text-muted-foreground truncate text-[11px]">
                <span className="font-mono">{quote.number}</span>
                <span className="hidden lg:inline">
                  {' · '}
                  {dirty ? 'Unsaved changes' : savedAt ? `Saved ${formatTime(savedAt)}` : 'Saved'}
                </span>
              </span>
            </div>
            <StatusBadge status={quote.status} className="ml-1 hidden xl:inline-flex" />
          </div>

          <StepNav step={step} onStep={setStep} />

          <div className="flex items-center justify-end gap-2">
            <div className="hidden flex-col items-end leading-tight md:flex">
              <span className="text-muted-foreground text-[11px]">Estimate</span>
              <span className="text-[13px] font-semibold tabular-nums">{formatMoney(shownTotal)}</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Save draft" onClick={save} className="relative">
                  {justSaved ? <Check key="saved" className="animate-pop text-emerald-600" /> : <Save key="save" />}
                  {dirty && <span className="animate-pop absolute top-2 right-2 size-1.5 rounded-full bg-amber-500" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{justSaved ? 'Saved' : 'Save draft (Ctrl+S)'}</TooltipContent>
            </Tooltip>
            {primary}
          </div>
        </header>

        {/* ── Steps ── */}
        {step === 'draw' &&
          (wide ? (
            <div className="animate-rise grid min-h-0 flex-1 grid-cols-[340px_minmax(0,1fr)_320px]">
              <aside className="min-h-0 overflow-y-auto border-r bg-white px-5 py-5">
                <PanelHeading title="Piece details" />
                {pieceForm}
              </aside>
              <main className="flex min-h-0 flex-col p-5">{canvas}</main>
              <aside className="min-h-0 overflow-y-auto border-l bg-white px-5 py-5">
                <PanelHeading title="Cut-outs" count={drawing.cutouts.length} />
                {cutoutPanel}
              </aside>
            </div>
          ) : (
            <div
              className={cn('animate-rise min-h-0 flex-1', medium ? 'grid grid-cols-[340px_minmax(0,1fr)]' : 'flex flex-col')}
            >
              <main
                className={cn('flex min-h-0 flex-col p-4 md:p-6', medium ? 'order-2' : 'h-[48dvh] shrink-0 border-b')}
              >
                {canvas}
              </main>
              <aside className={cn('min-h-0 flex-1 overflow-y-auto bg-white', medium && 'order-1 border-r')}>
                <Tabs defaultValue="piece" className="gap-0">
                  <div className="sticky top-0 z-10 border-b bg-white/95 px-4 py-3 backdrop-blur md:px-6">
                    <TabsList className="w-full">
                      <TabsTrigger value="piece">Piece details</TabsTrigger>
                      <TabsTrigger value="cutouts">
                        Cut-outs
                        {drawing.cutouts.length > 0 && (
                          <Badge variant="secondary" className="bg-neutral-900/[0.06] px-1.5 font-mono">
                            {drawing.cutouts.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="piece" className="px-4 py-6 md:px-6">
                    {pieceForm}
                  </TabsContent>
                  <TabsContent value="cutouts" className="px-4 py-6 md:px-6">
                    {cutoutPanel}
                  </TabsContent>
                </Tabs>
              </aside>
            </div>
          ))}

        {step === 'slab' && (
          <SlabStep
            key="slab" drawing={drawing} plan={plan} units={units} onSlabSizeChange={(slabSize) => change({ slabSize })} />
        )}

        {step === 'review' && (
          <ReviewStep
            key="review"
            quote={quote}
            drawing={drawing}
            plan={plan}
            units={units}
            issues={issues}
            date={today}
            onGoToDraw={() => setStep('draw')}
          />
        )}

        <span className="sr-only" aria-live="polite">
          Step {stepIndex + 1} of 3: {STEPS[stepIndex].label}
        </span>
      </div>

      <PrintSheet quote={quote} drawing={drawing} units={units} issues={issues} plan={plan} date={today} />

      <CutoutDialog
        key={cutoutDialog.key}
        open={cutoutDialog.open}
        onOpenChange={(open) => setCutoutDialog((s) => ({ ...s, open }))}
        drawing={drawing}
        units={units}
        editing={editing}
        onSubmit={submitCutout}
      />
      <ApprovalDialog
        open={approvalOpen}
        onOpenChange={setApprovalOpen}
        quote={quote}
        drawing={drawing}
        units={units}
        issues={issues}
        total={total}
        onConfirm={() => {
          onApprove(drawing)
          setDirty(false)
          setSavedAt(new Date())
        }}
      />
    </>
  )
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function StepNav({ step, onStep }: { step: Step; onStep: (s: Step) => void }) {
  const current = STEPS.findIndex((s) => s.id === step)
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={step}
      onValueChange={(v) => v && onStep(v as Step)}
      aria-label="Steps"
      className="h-9"
    >
      {STEPS.map((s, i) => {
        const active = s.id === step
        const done = i < current
        return (
          <ToggleGroupItem key={s.id} value={s.id} aria-label={`Step ${i + 1}: ${s.label}`} className="gap-2 px-2.5 sm:px-3.5">
            <span
              className={cn(
                'flex size-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors duration-300',
                active ? 'bg-foreground text-background' : done ? 'bg-neutral-400 text-white' : 'bg-neutral-200 text-neutral-500',
              )}
            >
              {done ? <Check className="animate-pop size-2.5" strokeWidth={3.5} /> : i + 1}
            </span>
            <span className={cn(!active && 'hidden sm:inline')}>{s.label}</span>
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
  )
}

function PanelHeading({ title, count }: { title: string; count?: number }) {
  return (
    <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold">
      {title}
      {!!count && (
        <Badge variant="secondary" className="font-mono">
          {count}
        </Badge>
      )}
    </h2>
  )
}

interface CanvasAreaProps {
  drawing: Drawing
  units: Units
  quote: Quote
  date: string
  issues: Issue[]
  plan: SlabPlan
  selectedId: string | null
  onSelect: (id: string | null) => void
  onMoveCutout: (id: string, offsets: { fromLeft: number; fromFront: number }) => void
  onEditCutout: (id: string) => void
}

function CanvasArea({
  drawing,
  units,
  quote,
  date,
  issues,
  plan,
  selectedId,
  onSelect,
  onMoveCutout,
  onEditCutout,
}: CanvasAreaProps) {
  const material = getMaterial(drawing.materialId)
  const { w, h } = boundingSize(drawing)
  const fmt = (n: number) => formatLength(n, units)

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="truncate text-base font-semibold">{drawing.pieceName || 'Untitled piece'}</h1>
        <p className="text-muted-foreground text-[13px]">
          <span className="text-foreground font-mono tabular-nums">
            {fmt(w)} × {fmt(h)}
          </span>
          {' · '}
          {THICKNESS_LABEL[drawing.thickness]}
          {' · '}
          {material.name}
        </p>
      </div>

      <div className="grid-paper relative min-h-0 flex-1 overflow-hidden rounded-2xl border">
        <div className="absolute inset-0 p-2 md:p-4">
          <DrawingCanvas
            drawing={drawing}
            units={units}
            quoteNumber={quote.number}
            date={date}
            issues={issues}
            seams={plan.seams}
            selectedId={selectedId}
            onSelect={onSelect}
            onMoveCutout={onMoveCutout}
            onEditCutout={onEditCutout}
          />
        </div>
      </div>

      <div className="max-h-40 shrink-0 overflow-y-auto">
        <IssueList issues={issues} onSelectCutout={onSelect} showAllClear />
      </div>
    </section>
  )
}

/** What "Download PDF" prints, whichever step you're on. */
function PrintSheet({
  quote,
  drawing,
  units,
  issues,
  plan,
  date,
}: {
  quote: Quote
  drawing: Drawing
  units: Units
  issues: Issue[]
  plan: SlabPlan
  date: string
}) {
  return (
    <div className="print-only">
      <div className="flex items-baseline justify-between pb-2">
        <span className="text-sm font-semibold">Brioni Granite · Shop drawing</span>
        <span className="text-xs">
          {quote.customer} · {quote.number}
        </span>
      </div>
      <DrawingCanvas
        drawing={drawing}
        units={units}
        quoteNumber={quote.number}
        date={date}
        issues={issues}
        seams={plan.seams}
      />
      <CutoutSchedule drawing={drawing} units={units} />
    </div>
  )
}
