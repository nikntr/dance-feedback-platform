import React from 'react'
import { AlertTriangle, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ── Error Boundary ────────────────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ReactNode }>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ fallback?: React.ReactNode }>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-red-400" />
          <div>
            <p className="font-display font-semibold text-text-primary">Что-то пошло не так</p>
            <p className="mt-1 text-sm text-text-muted">{this.state.error?.message}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => this.setState({ hasError: false })}>
            Попробовать снова
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Empty State ───────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg',
        'border border-dashed border-border py-16 text-center',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-elevated text-text-muted">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-text-primary">{title}</p>
        {description && (
          <p className="mt-1 text-xs text-text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

// ── Inline Error ──────────────────────────────────────────────────────────

export function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2">
      <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
      <p className="text-sm text-red-400">{message}</p>
    </div>
  )
}
