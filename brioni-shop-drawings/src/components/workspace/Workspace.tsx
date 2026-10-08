import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, Check, Download, Save, Send } from 'lucide-react'

import { StatusBadge } from '@/components/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useMediaQuery } from '@/hooks/use-media-query'
import { THICKNESS_LABEL, getMaterial } from '@/lib/catalog'
import { newDrawing } from '@/lib/drawing'
import { formatDate, formatTime } from '@/lib/format'
import { boundingSize } from '@/lib/geometry'
import type { Cutout, Drawing, Quote, Units } from '@/lib/types'
import { formatLength } from '@/lib/units'
import { cn } from '@/lib/utils'
import { validateDrawing } from '@/lib/validation'

import { ApprovalDialog } from './ApprovalDialog'
import { CutoutDialog } from './CutoutDialog'
import { CutoutPanel } from './CutoutPanel'
import { CutoutSchedule } from './CutoutSchedule'
import { DrawingCanvas } from './DrawingCanvas'
import { IssueList } from './IssueList'
import { PieceForm } from './PieceForm'

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
  const [units, setUnits] = useState<Units>('in')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dirty, setDirty] = useState(!quote.drawing)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [cutoutDialog, setCutoutDialog] = useState({ open: false, editingId: null as string | null, key: 0 })
  const [approvalOpen, setApprovalOpen] = useState(false)

  const wide = useMediaQuery('(min-width: 1280px)')
  const medium = useMediaQuery('(min-width: 1024px)')

  const issues = useMemo(() => validateDrawing(drawing, units), [drawing, units])
  const [today] = useState(() => formatDate(new Date()))

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

  const pieceForm = (
    <PieceForm drawing={drawing} units={units} onUnitsChange={setUnits} onChange={change} />
  )
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
      selectedId={selectedId}
      onSelect={setSelectedId}
      onMoveCutout={(id, offsets) =>
        setCutouts((cs) => cs.map((c) => (c.id === id ? { ...c, ...offsets } : c)))
      }
      onEditCutout={openEdit}
    />
  )

  return (
    <div className="flex h-dvh flex-col print:block print:h-auto">
      {/* ── Top bar ── */}
      <header className="no-print flex h-16 shrink-0 items-center gap-3 border-b bg-white px-4 md:px-6">
        <Button variant="ghost" size="lg" className="-ml-2 px-3" onClick={() => { if (dirty) save(); onBack() }}>
          <ArrowLeft />
          <span className="hidden sm:inline">Quotes</span>
        </Button>
        <Separator orientation="vertical" className="!h-6" />
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">{quote.customer}</span>
            <span className="text-muted-foreground font-mono text-xs">{quote.number}</span>
          </div>
          <StatusBadge status={quote.status} className="hidden md:inline-flex" />
          <span className="text-muted-foreground hidden text-xs lg:inline" aria-live="polite">
            {dirty ? 'Unsaved changes' : savedAt ? `Saved at ${formatTime(savedAt)}` : 'All changes saved'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ResponsiveButton icon={<Save />} label="Save draft" onClick={save} />
          <ResponsiveButton icon={<Download />} label="Download PDF" onClick={() => window.print()} />
          <Button
            size="lg"
            onClick={() => setApprovalOpen(true)}
            disabled={approved}
            className={cn(approved && 'bg-emerald-600 opacity-100 disabled:opacity-100')}
          >
            {approved ? <Check /> : <Send />}
            <span className="hidden sm:inline">{approved ? 'Approved' : 'Send for approval'}</span>
          </Button>
        </div>
      </header>

      {/* ── Body: 3 zones on desktop, 2 on small laptops/iPad landscape, stacked on iPad portrait ── */}
      {wide ? (
        <div className="grid min-h-0 flex-1 grid-cols-[360px_minmax(0,1fr)_340px] print:block">
          <aside className="no-print min-h-0 overflow-y-auto border-r bg-white px-6 py-6">
            <PanelHeading title="Piece details" />
            {pieceForm}
          </aside>
          <main className="flex min-h-0 flex-col p-6 print:p-0">{canvas}</main>
          <aside className="no-print min-h-0 overflow-y-auto border-l bg-white px-6 py-6">
            <PanelHeading title="Cut-outs" count={drawing.cutouts.length} />
            {cutoutPanel}
          </aside>
        </div>
      ) : (
        <div
          className={cn(
            'min-h-0 flex-1 print:block',
            medium ? 'grid grid-cols-[360px_minmax(0,1fr)]' : 'flex flex-col',
          )}
        >
          <main
            className={cn(
              'flex min-h-0 flex-col p-4 md:p-6 print:p-0',
              medium ? 'order-2' : 'h-[48dvh] shrink-0 border-b',
            )}
          >
            {canvas}
          </main>
          <aside className={cn('no-print min-h-0 flex-1 overflow-y-auto bg-white', medium && 'order-1 border-r')}>
            <Tabs defaultValue="piece" className="gap-0">
              <div className="sticky top-0 z-10 border-b bg-white/95 px-4 py-3 backdrop-blur md:px-6">
                <TabsList className="h-11 w-full">
                  <TabsTrigger value="piece">Piece details</TabsTrigger>
                  <TabsTrigger value="cutouts">
                    Cut-outs
                    {drawing.cutouts.length > 0 && (
                      <Badge variant="secondary" className="bg-muted-foreground/10 px-1.5 font-mono">
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
      )}

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
        onConfirm={() => {
          onApprove(drawing)
          setDirty(false)
          setSavedAt(new Date())
        }}
      />
    </div>
  )
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function PanelHeading({ title, count }: { title: string; count?: number }) {
  return (
    <h2 className="mb-6 flex items-center gap-2 text-base font-semibold">
      {title}
      {!!count && (
        <Badge variant="secondary" className="font-mono">
          {count}
        </Badge>
      )}
    </h2>
  )
}

function ResponsiveButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="lg" onClick={onClick} className="px-3 xl:px-4" aria-label={label}>
          {icon}
          <span className="hidden xl:inline">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="xl:hidden">{label}</TooltipContent>
    </Tooltip>
  )
}

interface CanvasAreaProps {
  drawing: Drawing
  units: Units
  quote: Quote
  date: string
  issues: ReturnType<typeof validateDrawing>
  selectedId: string | null
  onSelect: (id: string | null) => void
  onMoveCutout: (id: string, offsets: { fromLeft: number; fromFront: number }) => void
  onEditCutout: (id: string) => void
}

function CanvasArea({ drawing, units, quote, date, issues, selectedId, onSelect, onMoveCutout, onEditCutout }: CanvasAreaProps) {
  const material = getMaterial(drawing.materialId)
  const { w, h } = boundingSize(drawing)
  const fmt = (n: number) => formatLength(n, units)

  return (
    <section className="print-sheet flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="truncate text-lg font-semibold tracking-tight">{drawing.pieceName || 'Untitled piece'}</h1>
        <p className="text-muted-foreground text-sm">
          <span className="text-foreground font-mono tabular-nums">
            {fmt(w)} × {fmt(h)}
          </span>
          {' · '}
          {THICKNESS_LABEL[drawing.thickness]}
          {' · '}
          {material.name}
        </p>
      </div>

      <div className="grid-paper relative min-h-0 flex-1 overflow-hidden rounded-lg border print:flex-none print:overflow-visible print:border-0">
        <div className="absolute inset-0 p-2 md:p-4 print:static print:p-0">
          <DrawingCanvas
            drawing={drawing}
            units={units}
            quoteNumber={quote.number}
            date={date}
            issues={issues}
            selectedId={selectedId}
            onSelect={onSelect}
            onMoveCutout={onMoveCutout}
            onEditCutout={onEditCutout}
          />
        </div>
      </div>

      <div className="no-print max-h-40 shrink-0 overflow-y-auto">
        <IssueList issues={issues} onSelectCutout={onSelect} showAllClear />
      </div>

      <div className="print-only">
        <CutoutSchedule drawing={drawing} units={units} />
      </div>
    </section>
  )
}
