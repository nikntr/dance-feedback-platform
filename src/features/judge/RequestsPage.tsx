import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FeedbackStatusBadge } from '@/components/ui/badge'
import { EmptyState } from '@/shared/ErrorBoundary'
import { formatDate, daysUntil } from '@/lib/utils'
import { MOCK_FEEDBACK_REQUESTS } from '@/mocks/data'
import { ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function JudgeRequestsPage() {
  const user = useAuthStore((s) => s.user)
  const myRequests = MOCK_FEEDBACK_REQUESTS.filter((r) => r.judge_id === user?.id)
  return (
    <div className="page-container">
      <div className="mb-8"><h1 className="page-title">Все запросы</h1><p className="page-subtitle">Запросы обратной связи от участников</p></div>
      {myRequests.length === 0 ? (
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
