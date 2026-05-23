import { Link } from 'react-router-dom'
import { Trophy, Calendar, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CompetitionStatusBadge } from '@/components/ui/badge'
import { formatDate, formatRub } from '@/lib/utils'
import { MOCK_COMPETITIONS } from '@/mocks/data'

export default function CompetitionsListPage() {
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title">Соревнования</h1>
        <p className="page-subtitle">Зарегистрируйтесь на ближайшие турниры</p>
      </div>
      <div className="flex flex-col gap-4">
        {MOCK_COMPETITIONS.map((comp) => (
          <Card key={comp.id} className="hover:shadow-card-hover transition-shadow">
            <CardContent className="flex items-center gap-4 pt-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-500/10">
                <Trophy className="h-6 w-6 text-accent-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold font-display text-text-primary">{comp.title}</p>
                  <CompetitionStatusBadge status={comp.status} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(comp.event_date)}</span>
                  {comp.participant_limit && <span className="flex items-center gap-1"><Users className="h-3 w-3" />до {comp.participant_limit} участников</span>}
                  <span className="font-medium text-accent-500">{formatRub(comp.entry_fee)}</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" asChild>
                <Link to={`/competitions/${comp.id}`}>Подробнее</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
