import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FeedbackStatusBadge } from '@/components/ui/badge'
import { EmptyState, InlineError } from '@/shared/ErrorBoundary'
import { CardSkeleton } from '@/shared/LoadingSpinner'
import { formatDate, daysUntil } from '@/lib/utils'
import { useFeedbackRequests } from '@/api/endpoints/feedback'
import { ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function JudgeRequestsPage() {
  const user = useAuthStore((s) => s.user)
  const { data, isLoading, isError } = useFeedbackRequests({ judge_id: user?.id })
  const myRequests = data?.data ?? []
  return (
    <div className="page-container">
      <div className="mb-8"><h1 className="page-title">Все запросы</h1><p className="page-subtitle">Запросы обратной связи от участников</p></div>
      {isLoading ? (
        <div className="flex flex-col gap-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
      ) : isError ? (
        <InlineError message="Не удалось загрузить запросы" />
      ) : myRequests.length === 0 ? (
        <EmptyState icon={<ClipboardList className="h-5 w-5" />} title="Нет запросов" description="Участники ещё не отправили запросы" />
      ) : (
        <div className="flex flex-col gap-3">
          {myRequests.map((req) => {
            const daysLeft = daysUntil(req.deadline_at)
            return (
              <Card key={req.id} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="flex items-center gap-4 pt-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><p className="text-sm font-medium text-text-primary">Запрос #{req.id.slice(-3)}</p><FeedbackStatusBadge status={req.status} /></div>
                    <p className="mt-0.5 text-xs text-text-muted">{req.comment ?? 'Без комментария'} · {formatDate(req.created_at)}</p>
                  </div>
                  {req.status === 'pending' && <span className={cn('text-xs font-medium shrink-0', daysLeft <= 5 ? 'text-red-400' : 'text-text-secondary')}>{daysLeft} дн.</span>}
                  <Button variant="secondary" size="sm" asChild><Link to={`/judge/requests/${req.id}`}>Открыть</Link></Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
