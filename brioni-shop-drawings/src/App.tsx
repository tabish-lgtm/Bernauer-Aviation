import { useState } from 'react'

import { NewDrawingDialog } from '@/components/NewDrawingDialog'
import { QuoteTable } from '@/components/QuoteTable'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Workspace } from '@/components/workspace/Workspace'
import { MOCK_QUOTES } from '@/data/mock'
import { newDrawing } from '@/lib/drawing'
import type { Drawing, Quote } from '@/lib/types'

export default function App() {
  const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES)
  const [openId, setOpenId] = useState<string | null>(null)
  const [newOpen, setNewOpen] = useState(false)

  const open = quotes.find((q) => q.id === openId)

  function updateQuote(id: string, patch: Partial<Quote>) {
    setQuotes((qs) =>
      qs.map((q) => (q.id === id ? { ...q, ...patch, updatedAt: new Date().toISOString() } : q)),
    )
  }

  function saveDrawing(id: string, drawing: Drawing) {
    // Changing an approved drawing sends it back to "Drawing ready" for re-approval.
    updateQuote(id, { drawing, status: 'ready', materialId: drawing.materialId })
  }

  function createQuote(input: { customer: string; project: string; materialId: string }) {
    const next = Math.max(...quotes.map((q) => Number(q.number.replace(/\D/g, '')))) + 1
    const id = `q${Date.now()}`
    const quote: Quote = {
      id,
      number: `Q-${next}`,
      customer: input.customer,
      project: input.project || 'Countertop',
      materialId: input.materialId,
      status: 'draft',
      updatedAt: new Date().toISOString(),
      drawing: { ...newDrawing(input.materialId), pieceName: input.project || 'Kitchen countertop' },
    }
    setQuotes((qs) => [quote, ...qs])
    setNewOpen(false)
    setOpenId(id)
  }

  return (
    <TooltipProvider>
      {open ? (
        <Workspace
          key={open.id}
          quote={open}
          onBack={() => setOpenId(null)}
          onSave={(d) => saveDrawing(open.id, d)}
          onApprove={(d) => updateQuote(open.id, { drawing: d, status: 'approved', materialId: d.materialId })}
        />
      ) : (
        <QuoteTable quotes={quotes} onOpen={setOpenId} onNew={() => setNewOpen(true)} />
      )}
      <NewDrawingDialog key={String(newOpen)} open={newOpen} onOpenChange={setNewOpen} onCreate={createQuote} />
    </TooltipProvider>
  )
}
