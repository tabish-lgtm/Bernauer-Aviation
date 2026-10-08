import { useState } from 'react'
import { ChevronRight, Plus, Search } from 'lucide-react'

import { BrioniMark } from '@/components/icons'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getMaterial } from '@/lib/catalog'
import { formatDate } from '@/lib/format'
import type { Quote } from '@/lib/types'

interface QuoteTableProps {
  quotes: Quote[]
  onOpen: (id: string) => void
  onNew: () => void
}

export function QuoteTable({ quotes, onOpen, onNew }: QuoteTableProps) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const rows = quotes.filter((x) =>
    !q
      ? true
      : [x.number, x.customer, x.project, getMaterial(x.materialId).name].some((v) => v.toLowerCase().includes(q)),
  )

  return (
    <div className="min-h-dvh">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-8">
          <BrioniMark />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">Brioni Granite</span>
            <span className="text-muted-foreground text-xs">Shop drawings</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Quotes</h1>
            <p className="text-muted-foreground text-sm">Open a quote to see or make its drawing.</p>
          </div>
          <Button size="lg" className="h-11" onClick={onNew}>
            <Plus />
            New drawing
          </Button>
        </div>

        <Card className="gap-0 overflow-hidden py-0">
          <div className="border-b p-4">
            <div className="relative max-w-sm">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by customer, quote or material"
                className="h-10 pl-9"
                aria-label="Search quotes"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Quote</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Material</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Updated</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((quote) => {
                const m = getMaterial(quote.materialId)
                return (
                  <TableRow
                    key={quote.id}
                    tabIndex={0}
                    onClick={() => onOpen(quote.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onOpen(quote.id)
                      }
                    }}
                    className="focus-visible:bg-muted/60 group h-16 cursor-pointer outline-none"
                    aria-label={`Open ${quote.number}, ${quote.customer}`}
                  >
                    <TableCell className="pl-6 font-mono text-sm">{quote.number}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{quote.customer}</span>
                        <span className="text-muted-foreground text-xs">{quote.project}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="flex items-center gap-2">
                        <span className="size-4 rounded-full border border-black/10" style={{ background: m.swatch }} />
                        {m.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={quote.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell">
                      {formatDate(quote.updatedAt)}
                    </TableCell>
                    <TableCell className="pr-4">
                      <ChevronRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
                    </TableCell>
                  </TableRow>
                )
              })}
              {rows.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="text-muted-foreground py-12 text-center">
                    No quotes match "{query}".
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  )
}
