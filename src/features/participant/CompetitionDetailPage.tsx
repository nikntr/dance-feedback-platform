import { useParams, Link } from 'react-router-dom'
import { Trophy, Calendar, Users, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CompetitionStatusBadge } from '@/components/ui/badge'
import { InlineError } from '@/shared/ErrorBoundary'
import { LoadingSpinner } from '@/shared/LoadingSpinner'
import { formatDate, formatRub } from '@/lib/utils'
import { useCompetition, useRegisterForCompetition } from '@/api/endpoints/competitions'
import toast from 'react-hot-toast'

export default function CompetitionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: comp, isLoading, isError } = useCompetition(id ?? '')
  const { mutate: register, isPending: isRegistering } = useRegisterForCompetition(id ?? '')

  const back = (
    <Button variant="ghost" size="sm" asChild className="mb-6">
      <Link to="/competitions"><ArrowLeft className="h-4 w-4" />Назад</Link>
    </Button>
  )

  if (isLoading) {
    return (
      <div className="page-container max-w-2xl">
        {back}
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      </div>
    )
  }

  if (isError || !comp) {
    return (
      <div className="page-container max-w-2xl">
        {back}
        <InlineError message="Соревнование не найдено" />
      </div>
    )
  }

  const handleRegister = () =>
    register(undefined, {
      onSuccess: (res) => {
        toast.success('Регистрация создана! Перенаправление на оплату...')
        if (res.payment_url) setTimeout(() => { window.location.href = res.payment_url }, 800)
      },
      onError: () => toast.error('Не удалось зарегистрироваться'),
    })

  return (
    <div className="page-container max-w-2xl">
      {back}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-500/10">
              <Trophy className="h-7 w-7 text-accent-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2"><h1 className="font-display text-xl font-bold text-text-primary">{comp.title}</h1><CompetitionStatusBadge status={comp.status} /></div>
              <div className="mt-3 flex flex-col gap-2 text-sm text-text-secondary">
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(comp.event_date)}</span>
                {comp.participant_limit && <span className="flex items-center gap-2"><Users className="h-4 w-4" />Лимит: {comp.participant_limit} участников</span>}
                <span className="font-semibold text-accent-500 text-base">{formatRub(comp.entry_fee)} — вступительный взнос</span>
              </div>
              {comp.status === 'open' && (
                <Button className="mt-5" loading={isRegistering} onClick={handleRegister}>
                  Зарегистрироваться
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
