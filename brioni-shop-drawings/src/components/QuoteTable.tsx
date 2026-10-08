import { useState, type ReactNode } from 'react'
import { ArrowRight, ChevronRight, FileText, LayoutGrid, Search, Settings, Users } from 'lucide-react'

import { BrioniMark } from '@/components/icons'
import { StatusBadge } from '@/components/StatusBadge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getMaterial } from '@/lib/catalog'
import { formatDate } from '@/lib/format'
import type { Quote } from '@/lib/types'
import { cn } from '@/lib/utils'

interface QuoteTableProps {
  quotes: Quote[]
  onOpen: (id: string) => void
  onNew: () => void
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export function QuoteTable({ quotes, onOpen, onNew }: QuoteTableProps) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const rows = quotes.filter((x) =>
    !q ? true : [x.number, x.customer, x.project, getMaterial(x.materialId).name].some((v) => v.toLowerCase().includes(q)),
  )
  const waiting = quotes.filter((x) => x.status === 'draft').length

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar */}
      <aside className="bg-sidebar sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r px-2.5 py-3 md:flex">
        <div className="flex items-center gap-2 px-2 pt-1 pb-5">
          <BrioniMark className="size-6" />
          <span className="text-[13px] font-semibold">Brioni Granite</span>
        </div>
        <nav className="flex flex-col gap-px text-[13px]">
          <NavItem icon={<LayoutGrid />} label="Quotes" active />
          <NavItem icon={<Users />} label="Customers" />
          <NavItem icon={<FileText />} label="Materials" />
        </nav>
        <div className="mt-auto flex flex-col gap-px text-[13px]">
          <NavItem icon={<Settings />} label="Settings" />
          <div className="mt-2 flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-neutral-200/50">
            <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-rose-200 to-sky-200 text-xs font-semibold text-neutral-700">
              JM
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[13px] font-medium">Jamie Moreno</span>
              <span className="text-muted-foreground text-[11px]">Sales</span>
            </span>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:px-10 md:py-12">
          <header className="animate-rise flex flex-col gap-1">
            <p className="text-muted-foreground text-[13px]">{greeting()}, Jamie</p>
            <h1 className="text-2xl font-semibold">What are we cutting today?</h1>
          </header>

          {/* Quick start */}
          <div className="animate-rise grid gap-3 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
            <button
              type="button"
              onClick={onNew}
              className="group relative flex cursor-pointer items-center gap-3.5 overflow-hidden rounded-2xl border bg-white p-4 text-left transition-[border-color,box-shadow,transform] duration-200 outline-none hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-lg hover:shadow-black/[0.04] focus-visible:ring-4 focus-visible:ring-neutral-900/10 active:translate-y-0 active:scale-[0.99]"
            >
              <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-200 via-indigo-200 to-rose-200 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
                <svg viewBox="0 0 24 24" className="size-5 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <rect x="3" y="7" width="18" height="10" rx="1.5" />
                  <path d="M3 12h18M12 7v10" strokeOpacity=".35" />
                </svg>
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">New drawing</span>
                <span className="text-muted-foreground text-[13px]">Size, edges and cut-outs in under 2 minutes</span>
              </span>
              <ArrowRight className="text-muted-foreground ml-auto size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <div className="flex items-center gap-3.5 rounded-2xl border bg-white p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 text-base font-semibold tabular-nums text-neutral-800">
                {waiting}
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium">Waiting for a drawing</span>
                <span className="text-muted-foreground text-[13px]">Draft quotes that still need one</span>
              </span>
            </div>
          </div>

          {/* Quotes */}
          <section className="animate-rise flex flex-col gap-3" style={{ animationDelay: '120ms' }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Recent quotes</h2>
              <div className="relative w-full sm:w-64">
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search quotes"
                  className="rounded-full pl-9"
                  aria-label="Search quotes"
                />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5">Quote</TableHead>
                    <TableHead className="text-xs font-normal">Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Material</TableHead>
                    <TableHead className="text-xs font-normal">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Updated</TableHead>
                    <TableHead className="w-10" />
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
                        className="group h-14 cursor-pointer text-[13px] outline-none hover:bg-neutral-50 focus-visible:bg-neutral-50"
                        aria-label={`Open ${quote.number}, ${quote.customer}`}
                      >
                        <TableCell className="text-muted-foreground pl-5 font-mono text-xs">{quote.number}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{quote.customer}</span>
                            <span className="text-muted-foreground text-[11px]">{quote.project}</span>
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
                        <TableCell className="text-muted-foreground hidden lg:table-cell">{formatDate(quote.updatedAt)}</TableCell>
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
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, active = false }: { icon: ReactNode; label: string; active?: boolean }) {
  return (
    <span
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-8 cursor-default items-center gap-2.5 rounded-lg px-2 transition-colors [&_svg]:size-4',
        active ? 'text-foreground bg-neutral-200/60 font-medium' : 'text-muted-foreground hover:bg-neutral-200/40 hover:text-foreground',
      )}
    >
      {icon}
      {label}
    </span>
  )
}
