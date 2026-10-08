import { useState } from 'react'
import { CircleCheck, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { THICKNESS_LABEL, getMaterial } from '@/lib/catalog'
import { boundingSize } from '@/lib/geometry'
import type { Drawing, Quote, Units } from '@/lib/types'
import { formatLength } from '@/lib/units'
import type { Issue } from '@/lib/validation'

interface ApprovalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quote: Quote
  drawing: Drawing
  units: Units
  issues: Issue[]
  onConfirm: () => void
}

export function ApprovalDialog({ open, onOpenChange, quote, drawing, units, issues, onConfirm }: ApprovalDialogProps) {
  const [sent, setSent] = useState(false)
  const fmt = (n: number) => formatLength(n, units)
  const { w, h } = boundingSize(drawing)
  const material = getMaterial(drawing.materialId)
  const problems = issues.filter((i) => i.level === 'problem').length
  const cautions = issues.length - problems

  const rows: [string, string][] = [
    ['Customer', quote.customer],
    ['Piece', drawing.pieceName || 'Untitled piece'],
    ['Size', `${fmt(w)} × ${fmt(h)}${drawing.shape === 'l-shape' ? ' (L-shape)' : ''}`],
    ['Material', `${material.name}, ${THICKNESS_LABEL[drawing.thickness]}`],
    ['Cut-outs', drawing.cutouts.length ? String(drawing.cutouts.length) : 'None'],
  ]

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) setSent(false)
      }}
    >
      <DialogContent className="sm:max-w-md">
        {sent ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-emerald-50">
              <CircleCheck className="size-7 text-emerald-600" />
            </span>
            <DialogHeader className="items-center text-center sm:text-center">
              <DialogTitle>Drawing approved</DialogTitle>
              <DialogDescription>
                {quote.number} is marked approved and ready for the shop floor.
              </DialogDescription>
            </DialogHeader>
            <Button size="lg" className="mt-2 w-full" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Send for approval?</DialogTitle>
              <DialogDescription>
                {quote.customer} will get this drawing to sign off. Check the details below.
              </DialogDescription>
            </DialogHeader>

            <dl className="bg-muted/40 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 rounded-lg border p-4 text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            {issues.length > 0 && (
              <>
                <Separator />
                <p className="text-sm text-amber-800">
                  {problems > 0
                    ? `There ${problems === 1 ? 'is 1 problem' : `are ${problems} problems`} on this drawing. You can still send it, but fixing ${problems === 1 ? 'it' : 'them'} first is safer.`
                    : `There ${cautions === 1 ? 'is 1 thing' : `are ${cautions} things`} worth double-checking before you send.`}
                </p>
              </>
            )}

            <DialogFooter>
              <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
                Keep editing
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  onConfirm()
                  setSent(true)
                }}
              >
                <Send />
                Send for approval
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
