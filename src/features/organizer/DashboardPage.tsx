import { Link } from 'react-router-dom'
import { Trophy, Users, Plus, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CompetitionStatusBadge } from '@/components/ui/badge'
import { formatDate, formatRub } from '@/lib/utils'
import { MOCK_COMPETITIONS, MOCK_COMPETITION_SUMMARY } from '@/mocks/data'

export default function OrganizerDashboard() {
  const user = useAuthStore((s) => s.user)
  const myComps = MOCK_COMPETITIONS.filter((c) => c.organizer_id === user?.id)

  return (
    <div className="page-container">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="page-title">Мои соревнования</h1>
          <p className="page-subtitle">{user?.full_name} — панель организатора</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/organizer/competitions/new">
            <Plus className="h-4 w-4" />
            Новое соревнование
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Всего турниров', value: myComps.length, icon: Trophy, color: 'text-accent-500' },
          { label: 'Активных', value: myComps.filter((c) => c.status === 'open').length, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Участников', value: 160, icon: Users, color: 'text-blue-400' },
          { label: 'Выплата', value: formatRub(MOCK_COMPETITION_SUMMARY.organizer_share), icon: TrendingUp, color: 'text-purple-400' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-display font-bold text-text-primary">{stat.value}</p>
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

      {/* Competitions list */}
      <div className="flex flex-col gap-3">
        {myComps.map((comp) => (
          <Card key={comp.id} className="hover:shadow-card-hover transition-shadow">
            <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-500/10">
                  <Trophy className="h-5 w-5 text-accent-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-text-primary">{comp.title}</p>
                    <CompetitionStatusBadge status={comp.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {formatDate(comp.event_date)} · взнос {formatRub(comp.entry_fee)}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="ghost" size="sm" asChild className="flex-1 sm:flex-none">
                  <Link to={`/organizer/competitions/${comp.id}/participants`}>
                    <Users className="h-4 w-4" />
                    Участники
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" asChild className="flex-1 sm:flex-none">
                  <Link to={`/organizer/competitions/${comp.id}`}>Управление</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
