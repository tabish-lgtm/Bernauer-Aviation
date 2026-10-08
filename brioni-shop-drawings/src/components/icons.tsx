import type { CutoutType, EdgeProfile, Shape } from '@/lib/types'
import { cn } from '@/lib/utils'

const base = 'shrink-0'

export function ShapeIcon({ shape, className }: { shape: Shape; className?: string }) {
  return (
    <svg viewBox="0 0 40 28" className={cn(base, className)} style={{ width: 40, height: 28 }} fill="none" aria-hidden>
      {shape === 'rectangle' ? (
        <rect x="2" y="7" width="36" height="14" rx="1.5" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.5" />
      ) : (
        <path d="M2 3h36v22h-11v-11H2z" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      )}
    </svg>
  )
}

/** Small cross-section of each edge profile, as a fabricator would sketch it. */
export function EdgeProfileIcon({ profile, className }: { profile: EdgeProfile; className?: string }) {
  const paths: Record<EdgeProfile, string> = {
    eased: 'M4 4h15a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 16H4',
    bevel: 'M4 4h12l4.5 4.5V16H4',
    bullnose: 'M4 4h10.5a6 6 0 0 1 0 12H4',
    ogee: 'M4 4h11c3 0 2 4 4 5s1.5 2 1.5 3V16H4',
    raw: 'M4 4h16.5V16H4',
  }
  return (
    <svg viewBox="0 0 24 20" className={cn(base, className)} style={{ width: 28, height: 23 }} fill="none" aria-hidden>
      <path
        d={paths[profile]}
        fill="currentColor"
        fillOpacity=".14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeDasharray={profile === 'raw' ? '2.5 2' : undefined}
      />
    </svg>
  )
}

export function CutoutIcon({ type, className }: { type: CutoutType; className?: string }) {
  return (
    <svg viewBox="0 0 32 24" className={cn(base, 'h-6 w-8', className)} fill="none" aria-hidden>
      {type === 'undermount-sink' && (
        <>
          <rect x="3" y="3" width="26" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16" cy="15" r="2" stroke="currentColor" strokeWidth="1.25" />
        </>
      )}
      {type === 'dropin-sink' && (
        <>
          <rect x="2" y="2" width="28" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="6" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.5" />
          <circle cx="16" cy="14" r="1.6" stroke="currentColor" strokeWidth="1.1" />
        </>
      )}
      {type === 'cooktop' && (
        <>
          <rect x="2" y="2" width="28" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="22" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="10" cy="16" r="2.4" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="22" cy="16" r="3.2" stroke="currentColor" strokeWidth="1.1" />
        </>
      )}
      {type === 'faucet' && (
        <>
          <circle cx="7" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="25" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        </>
      )}
    </svg>
  )
}

export function BrioniMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn(base, 'size-8', className)} aria-hidden>
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path d="M8 10h16v5H14v7H8z" fill="#fff" />
    </svg>
  )
}
