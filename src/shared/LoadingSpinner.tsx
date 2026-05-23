import { cn } from '@/lib/utils'

// ── Spinner ───────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Загрузка..."
      className={cn(
        'rounded-full border-2 border-border border-t-accent-500 animate-spin',
        size === 'sm' && 'h-4 w-4',
        size === 'md' && 'h-6 w-6',
        size === 'lg' && 'h-10 w-10',
        className,
      )}
    />
  )
}

// ── Full-page loader ──────────────────────────────────────────────────────

export function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-bg-base">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-text-muted">Загрузка...</p>
      </div>
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded bg-bg-elevated',
        'animate-[shimmer_1.8s_linear_infinite]',
        'bg-gradient-to-r from-bg-elevated via-bg-overlay to-bg-elevated',
        'bg-[length:200%_100%]',
        className,
      )}
    />
  )
}

// ── Card Skeleton ─────────────────────────────────────────────────────────

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-surface p-5 shadow-card">
      <Skeleton className="mb-3 h-4 w-1/3" />
      <Skeleton className="mb-2 h-3 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}
