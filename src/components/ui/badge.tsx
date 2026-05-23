import * as React from 'react'
import { cn } from '@/lib/utils'
import type { CompetitionStatus, FeedbackRequestStatus, RegistrationPaymentStatus } from '@/api/types'

// ── Base Badge ────────────────────────────────────────────────────────────

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'muted'
  dot?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', dot = false, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium font-body',
        variant === 'default' && 'bg-bg-elevated text-text-secondary border border-border',
        variant === 'success' && 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
        variant === 'warning' && 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
        variant === 'error' && 'bg-red-500/15 text-red-400 border border-red-500/20',
        variant === 'info' && 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
        variant === 'muted' && 'bg-bg-overlay text-text-muted border border-border-subtle',
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-emerald-400',
            variant === 'warning' && 'bg-amber-400',
            variant === 'error' && 'bg-red-400',
            variant === 'info' && 'bg-blue-400',
            variant === 'muted' && 'bg-text-muted',
            variant === 'default' && 'bg-text-secondary',
          )}
        />
      )}
      {children}
    </span>
  ),
)
Badge.displayName = 'Badge'

// ── Status Badge — Feedback Request ──────────────────────────────────────

const FEEDBACK_STATUS_CONFIG: Record<
  FeedbackRequestStatus,
  { label: string; variant: BadgeProps['variant'] }
> = {
  awaiting_payment:      { label: 'Ожидает оплаты',        variant: 'warning' },
  awaiting_video:        { label: 'Ожидает видео',          variant: 'info' },
  pending:               { label: 'На рассмотрении',        variant: 'info' },
  awaiting_confirmation: { label: 'Ожидает подтверждения',  variant: 'warning' },
  completed:             { label: 'Завершён',               variant: 'success' },
  refunded:              { label: 'Возврат средств',        variant: 'error' },
}

export function FeedbackStatusBadge({
  status,
  dot = true,
}: {
  status: FeedbackRequestStatus
  dot?: boolean
}) {
  const config = FEEDBACK_STATUS_CONFIG[status]
  return (
    <Badge variant={config.variant} dot={dot}>
      {config.label}
    </Badge>
  )
}

// ── Status Badge — Competition ────────────────────────────────────────────

const COMPETITION_STATUS_CONFIG: Record<
  CompetitionStatus,
  { label: string; variant: BadgeProps['variant'] }
> = {
  draft:    { label: 'Черновик',    variant: 'muted' },
  open:     { label: 'Открыта',     variant: 'success' },
  closed:   { label: 'Закрыта',     variant: 'warning' },
  finished: { label: 'Завершена',   variant: 'muted' },
}

export function CompetitionStatusBadge({
  status,
  dot = true,
}: {
  status: CompetitionStatus
  dot?: boolean
}) {
  const config = COMPETITION_STATUS_CONFIG[status]
  return (
    <Badge variant={config.variant} dot={dot}>
      {config.label}
    </Badge>
  )
}

// ── Status Badge — Payment ────────────────────────────────────────────────

const PAYMENT_STATUS_CONFIG: Record<
  RegistrationPaymentStatus,
  { label: string; variant: BadgeProps['variant'] }
> = {
  pending: { label: 'Ожидает',  variant: 'warning' },
  paid:    { label: 'Оплачено', variant: 'success' },
}

export function PaymentStatusBadge({ status }: { status: RegistrationPaymentStatus }) {
  const config = PAYMENT_STATUS_CONFIG[status]
  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  )
}

export { Badge }
