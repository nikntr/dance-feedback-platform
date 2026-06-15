import { Link } from 'react-router-dom'
import { Trophy, MessageSquare, Clock, CheckCircle, Plus, Star } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FeedbackStatusBadge } from '@/components/ui/badge'
import { EmptyState, InlineError } from '@/shared/ErrorBoundary'
import { CardSkeleton } from '@/shared/LoadingSpinner'
import { formatDate, formatRub, daysUntil, getInitials } from '@/lib/utils'
import { useFeedbackRequests } from '@/api/endpoints/feedback'
import { useJudges } from '@/api/endpoints/judges'
import { useCompetitions } from '@/api/endpoints/competitions'

export default function ParticipantDashboard() {
  const user = useAuthStore((s) => s.user)

  const requestsQuery = useFeedbackRequests({ participant_id: user?.id })
  const judgesQuery = useJudges()
  const openCompetitionsQuery = useCompetitions({ status: 'open' })

  const myRequests = requestsQuery.data?.data ?? []
  const activeRequests = myRequests.filter((r) =>
    ['awaiting_payment', 'awaiting_video', 'pending', 'awaiting_confirmation'].includes(r.status),
  )
  const completedRequests = myRequests.filter((r) => r.status === 'completed')

  const judgeName = (judgeId: string) =>
    judgesQuery.data?.data.find((j) => j.id === judgeId)?.full_name

  const openCompetitions = openCompetitionsQuery.data?.data ?? []

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="page-title">Добро пожаловать, {user?.full_name?.split(' ')[0]}!</h1>
          <p className="page-subtitle">Управляйте запросами обратной связи</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/feedback/new">
            <Plus className="h-4 w-4" />
            Заказать ОС
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Активных запросов', value: activeRequests.length, icon: Clock, color: 'text-blue-400' },
          { label: 'Завершено', value: completedRequests.length, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Всего запросов', value: myRequests.length, icon: Star, color: 'text-accent-500' },
          { label: 'Открытых турниров', value: openCompetitions.length, icon: Trophy, color: 'text-purple-400' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-display font-bold text-text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs text-text-muted">{stat.label}</p>
                </div>
                <div className="rounded-lg bg-bg-elevated p-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* My requests */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-text-primary">
              Мои запросы ОС
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/feedback/new">Заказать</Link>
            </Button>
          </div>

          {requestsQuery.isLoading ? (
            <div className="flex flex-col gap-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : requestsQuery.isError ? (
            <InlineError message="Не удалось загрузить запросы" />
          ) : myRequests.length === 0 ? (
            <EmptyState
              icon={<MessageSquare className="h-5 w-5" />}
              title="Нет запросов"
              description="Закажите обратную связь у судьи после соревнования"
              action={
                <Button asChild size="sm">
                  <Link to="/feedback/new">
                    <Plus className="h-4 w-4" />
                    Первый запрос
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="flex flex-col gap-3">
              {myRequests.map((req) => {
                const daysLeft = daysUntil(req.deadline_at)
                const name = judgeName(req.judge_id)

                return (
                  <Link key={req.id} to={`/feedback/requests/${req.id}`}>
                    <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
                      <CardContent className="flex items-center gap-4 pt-4">
                        {/* Judge avatar */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-sm font-bold font-display text-accent-400">
                          {name ? getInitials(name) : 'СД'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-text-primary">
                              {name ?? 'Судья'}
                            </p>
                            <FeedbackStatusBadge status={req.status} />
                          </div>
                          <p className="mt-0.5 text-xs text-text-muted">
                            {formatDate(req.created_at)} · {formatRub(req.price)}
                          </p>
                        </div>
                        {daysLeft > 0 && req.status === 'pending' && (
                          <div className="shrink-0 text-right">
                            <p className="text-xs font-medium text-amber-400">{daysLeft} дн.</p>
                            <p className="text-2xs text-text-muted">до дедлайна</p>
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

        {/* Open competitions */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-text-primary">
              Открытые турниры
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/competitions">Все</Link>
            </Button>
          </div>

          {openCompetitionsQuery.isLoading ? (
            <div className="flex flex-col gap-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : openCompetitions.length === 0 ? (
            <EmptyState icon={<Trophy className="h-5 w-5" />} title="Нет открытых турниров" />
          ) : (
            <div className="flex flex-col gap-3">
              {openCompetitions.map((comp) => (
                <Link key={comp.id} to={`/competitions/${comp.id}`}>
                  <Card className="hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium text-text-primary line-clamp-2">{comp.title}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-text-muted">{formatDate(comp.event_date)}</p>
                        <span className="text-xs font-medium text-accent-500">
                          {formatRub(comp.entry_fee)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
