import { Badge } from '@/components/ui/badge'
import type { QuoteStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS: Record<QuoteStatus, { label: string; className: string; dot: string }> = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground', dot: 'bg-neutral-400' },
  ready: { label: 'Drawing ready', className: 'bg-accent text-accent-foreground', dot: 'bg-primary' },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-50 text-emerald-800',
    dot: 'bg-emerald-500',
  },
}

export function StatusBadge({ status, className }: { status: QuoteStatus; className?: string }) {
  const s = STATUS[status]
  return (
    <Badge variant="outline" className={cn('gap-1.5 border-transparent px-2.5 py-1', s.className, className)}>
      <span className={cn('size-1.5 rounded-full', s.dot)} />
      {s.label}
    </Badge>
  )
}
