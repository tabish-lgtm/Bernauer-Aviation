import { useState } from 'react'
import { Download, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { THICKNESS_LABEL, edgeProfileName, getMaterial } from '@/lib/catalog'
import { boundingSize, cutoutLabels, edgeSegments } from '@/lib/geometry'
import { estimate, formatMoney } from '@/lib/pricing'
import type { SlabPlan } from '@/lib/slab'
import type { Drawing, Quote, Units } from '@/lib/types'
import { formatLength } from '@/lib/units'
import type { Issue } from '@/lib/validation'

import { DrawingCanvas } from './DrawingCanvas'
import { IsoPreview } from './IsoPreview'
import { IssueList } from './IssueList'

interface ReviewStepProps {
  quote: Quote
  drawing: Drawing
  plan: SlabPlan
  units: Units
  issues: Issue[]
  date: string
  onGoToDraw: () => void
}

/** Replaces "3D view" and "Review": one page to check, price and send. */
export function ReviewStep({ quote, drawing, plan, units, issues, date, onGoToDraw }: ReviewStepProps) {
  const [view, setView] = useState<'drawing' | 'preview'>('drawing')
  const fmt = (n: number) => formatLength(n, units)
  const material = getMaterial(drawing.materialId)
  const { w, h } = boundingSize(drawing)
  const est = estimate(drawing, plan)
  const labels = cutoutLabels(drawing.cutouts)
  const profiles = [...new Set(edgeSegments(drawing).map((s) => drawing.edges[s.id]))].filter((p) => p !== 'raw')

  const facts: [string, string][] = [
    ['Size', `${fmt(w)} × ${fmt(h)}${drawing.shape === 'l-shape' ? ', L-shape' : ''}`],
    ['Material', `${material.name}, ${THICKNESS_LABEL[drawing.thickness]}`],
    ['Edges', profiles.length ? profiles.map(edgeProfileName).join(', ') : 'Unfinished'],
    ['Cut-outs', drawing.cutouts.length ? drawing.cutouts.map((c) => labels[c.id]).join(', ') : 'None'],
    ['Backsplash', drawing.backsplash.enabled ? `${fmt(drawing.backsplash.height)} high` : 'None'],
    ['Slabs', `${plan.slabCount} ${plan.slabSize.name.toLowerCase()}${plan.seams.length ? `, ${plan.seams.length} seam${plan.seams.length > 1 ? 's' : ''}` : ''}`],
  ]

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px]">
      <main className="flex min-h-[420px] flex-col gap-4 p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">{drawing.pieceName || 'Untitled piece'}</h1>
            <p className="text-muted-foreground text-sm">
              {quote.customer} · {quote.number}
            </p>
          </div>
          <ToggleGroup
            type="single"
            variant="outline"
            value={view}
            onValueChange={(v) => v && setView(v as 'drawing' | 'preview')}
            aria-label="View"
          >
            <ToggleGroupItem value="drawing" className="px-4">
              Shop drawing
            </ToggleGroupItem>
            <ToggleGroupItem value="preview" className="px-4">
              3D preview
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="relative min-h-0 flex-1">
          {view === 'drawing' ? (
            <div className="grid-paper absolute inset-0 rounded-2xl border p-3 md:p-5">
              <DrawingCanvas
                drawing={drawing}
                units={units}
                quoteNumber={quote.number}
                date={date}
                issues={issues}
                seams={plan.seams}
              />
            </div>
          ) : (
            <div className="absolute inset-0 rounded-2xl border">
              <IsoPreview drawing={drawing} />
            </div>
          )}
        </div>
      </main>

      <aside className="flex min-h-0 flex-col gap-6 overflow-y-auto border-t bg-white p-6 lg:border-t-0 lg:border-l">
        <section className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">Estimate</span>
          <span className="text-4xl font-semibold tracking-tight tabular-nums">{formatMoney(est.total)}</span>
          <span className="text-muted-foreground text-xs">
            {est.sqft.toFixed(1)} ft² installed · before tax
          </span>
        </section>

        <ul className="flex flex-col gap-2.5 text-sm">
          {est.lines.map((l, i) => (
            <li key={i} className="flex items-baseline justify-between gap-4">
              <span className="flex min-w-0 flex-col">
                <span>{l.label}</span>
                <span className="text-muted-foreground font-mono text-[11px] tabular-nums">{l.detail}</span>
              </span>
              <span className="font-medium tabular-nums">{formatMoney(l.amount)}</span>
            </li>
          ))}
        </ul>

        <Separator />

        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
          {facts.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right font-medium">{v}</dd>
            </div>
          ))}
        </dl>

        {issues.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-3">
              <IssueList issues={issues} />
              <Button variant="link" size="sm" className="h-auto self-start px-0" onClick={onGoToDraw}>
                Fix on the Draw step
              </Button>
            </div>
          </>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <Button variant="outline" size="lg" onClick={() => window.print()}>
            <Download />
            Download PDF
          </Button>
          <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
            <FileText className="size-3.5" />
            Drawing, cut-out schedule and edges on one page
          </p>
        </div>
      </aside>
    </div>
  )
}
