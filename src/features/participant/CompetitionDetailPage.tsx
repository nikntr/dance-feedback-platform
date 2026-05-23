import { useParams, Link } from 'react-router-dom'
import { Trophy, Calendar, Users, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CompetitionStatusBadge } from '@/components/ui/badge'
import { formatDate, formatRub } from '@/lib/utils'
import { MOCK_COMPETITIONS } from '@/mocks/data'
import toast from 'react-hot-toast'

export default function CompetitionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const comp = MOCK_COMPETITIONS.find((c) => c.id === id)

  if (!comp) return <div className="page-container"><p className="text-text-muted">Соревнование не найдено</p></div>

  return (
    <div className="page-container max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/competitions"><ArrowLeft className="h-4 w-4" />Назад</Link>
      </Button>
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
                <Button className="mt-5" onClick={() => toast.success('Перенаправление на оплату...')}>
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
