import type { ReactNode } from 'react'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FieldProps {
  id: string
  label: string
  helper?: ReactNode
  error?: string | null
  className?: string
  children: ReactNode
}

/** Label on top, control, then helper text underneath (never tooltip-only). */
export function Field({ id, label, helper, error, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-help`} className="text-destructive text-xs leading-snug">
          {error}
        </p>
      ) : helper ? (
        <p id={`${id}-help`} className="text-muted-foreground text-xs leading-snug">
          {helper}
        </p>
      ) : null}
    </div>
  )
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex min-h-8 items-center justify-between gap-4">
      <h3 className="text-foreground text-sm font-semibold">{children}</h3>
      {aside}
    </div>
  )
}
