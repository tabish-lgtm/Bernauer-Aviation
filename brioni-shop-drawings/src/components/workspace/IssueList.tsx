import { CircleCheck, OctagonAlert, TriangleAlert } from 'lucide-react'

import type { Issue } from '@/lib/validation'
import { cn } from '@/lib/utils'

interface IssueListProps {
  issues: Issue[]
  onSelectCutout?: (id: string) => void
  /** Show a quiet "all good" line when there are no issues. */
  showAllClear?: boolean
  className?: string
}

/** Friendly, non-blocking inline alerts. */
export function IssueList({ issues, onSelectCutout, showAllClear = false, className }: IssueListProps) {
  if (issues.length === 0) {
    if (!showAllClear) return null
    return (
      <p className={cn('animate-rise flex items-center gap-2 text-[13px] text-emerald-700', className)}>
        <CircleCheck className="animate-pop size-4" />
        Everything checks out. No problems found.
      </p>
    )
  }
  return (
    <ul className={cn('flex flex-col gap-2', className)} aria-live="polite">
      {issues.map((issue) => {
        const problem = issue.level === 'problem'
        const Icon = problem ? OctagonAlert : TriangleAlert
        const clickable = !!onSelectCutout && issue.cutoutIds.length > 0
        const Wrapper = clickable ? 'button' : 'div'
        return (
          <li key={issue.id}>
            <Wrapper
              type={clickable ? 'button' : undefined}
              onClick={clickable ? () => onSelectCutout?.(issue.cutoutIds[0]) : undefined}
              className={cn(
                'animate-rise flex w-full items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[13px]',
                problem
                  ? 'border-red-200 bg-red-50 text-red-900'
                  : 'border-amber-200 bg-warning-soft text-amber-950',
                clickable && 'cursor-pointer transition-colors hover:brightness-[0.98]',
              )}
            >
              <Icon className={cn('mt-0.5 size-4 shrink-0', problem ? 'text-red-600' : 'text-amber-600')} />
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">{issue.title}</span>
                <span className="opacity-80">{issue.detail}</span>
              </span>
            </Wrapper>
          </li>
        )
      })}
    </ul>
  )
}
