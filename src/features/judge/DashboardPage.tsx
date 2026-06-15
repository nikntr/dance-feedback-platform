import { Link } from 'react-router-dom'
import { ClipboardList, Clock, CheckCircle, Star, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FeedbackStatusBadge } from '@/components/ui/badge'
import { EmptyState, InlineError } from '@/shared/ErrorBoundary'
import { CardSkeleton } from '@/shared/LoadingSpinner'
import { formatDate, daysUntil } from '@/lib/utils'
import { useFeedbackRequests } from '@/api/endpoints/feedback'
import { cn } from '@/lib/utils'

export default function JudgeDashboard() {
  const user = useAuthStore((s) => s.user)
  const { data, isLoading, isError } = useFeedbackRequests({ judge_id: user?.id })
  const myRequests = data?.data ?? []
  const pendingRequests = myRequests.filter((r) => r.status === 'pending')
  const completedRequests = myRequests.filter((r) => r.status === 'completed')

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title">{user?.full_name}</h1>
        <p className="page-subtitle">Панель судьи — управление запросами обратной связи</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Ожидают ответа', value: pendingRequests.length, icon: Clock, color: 'text-amber-400', urgent: pendingRequests.length > 0 },
          { label: 'Завершено', value: completedRequests.length, icon: CheckCircle, color: 'text-emerald-400', urgent: false },
          { label: 'Рейтинг', value: '4.8', icon: Star, color: 'text-accent-500', urgent: false },
          { label: 'Просрочено', value: 0, icon: AlertCircle, color: 'text-red-400', urgent: false },
        ].map((stat) => (
          <Card key={stat.label} className={cn(stat.urgent && 'border-amber-500/30')}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-display font-bold text-text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs text-text-muted">{stat.label}</p>
                </div>
                <div className={cn('rounded-lg bg-bg-elevated p-2', stat.urgent && 'bg-amber-500/10')}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending requests */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-text-primary">
          Запросы к рассмотрению
          {pendingRequests.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400">
              {pendingRequests.length}
            </span>
          )}
        </h2>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/judge/requests">Все запросы</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3"><CardSkeleton /><CardSkeleton /></div>
      ) : isError ? (
        <InlineError message="Не удалось загрузить запросы" />
      ) : myRequests.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-5 w-5" />}
          title="Нет запросов"
          description="Участники пока не отправили запросы на обратную связь"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {myRequests.map((req) => {
            const daysLeft = daysUntil(req.deadline_at)
            const isUrgent = daysLeft <= 5 && req.status === 'pending'

            return (
              <Link key={req.id} to={`/judge/requests/${req.id}`}>
                <Card className={cn(
                  'hover:shadow-card-hover transition-shadow cursor-pointer',
                  isUrgent && 'border-red-500/30',
                )}>
                  <CardContent className="flex items-center gap-4 pt-4">
                    <div className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold font-display',
                      isUrgent ? 'bg-red-500/15 text-red-400' : 'bg-blue-500/15 text-blue-400',
                    )}>
                      #{req.id.slice(-3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-text-primary">
                          Запрос {req.id}
                        </p>
                        <FeedbackStatusBadge status={req.status} />
                      </div>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {req.comment ?? 'Без комментария'} · {formatDate(req.created_at)}
                      </p>
                    </div>
                    {req.status === 'pending' && (
                      <div className="shrink-0 text-right">
                        <p className={cn('text-xs font-medium', isUrgent ? 'text-red-400' : 'text-text-secondary')}>
                          {daysLeft} дн.
                        </p>
                        <p className="text-2xs text-text-muted">осталось</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
