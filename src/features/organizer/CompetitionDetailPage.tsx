import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CompetitionStatusBadge } from '@/components/ui/badge'
import { formatDate, formatRub } from '@/lib/utils'
import { MOCK_COMPETITIONS, MOCK_COMPETITION_SUMMARY } from '@/mocks/data'
import toast from 'react-hot-toast'

export default function OrganizerCompetitionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const comp = MOCK_COMPETITIONS.find((c) => c.id === id)
  if (!comp) return <div className="page-container"><p className="text-text-muted">Соревнование не найдено</p></div>
  return (
    <div className="page-container max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6"><Link to="/organizer/dashboard"><ArrowLeft className="h-4 w-4" />Назад</Link></Button>
      <div className="mb-6 flex items-center gap-3"><h1 className="page-title">{comp.title}</h1><CompetitionStatusBadge status={comp.status} /></div>
      <div className="grid gap-4 mb-6 grid-cols-2">
        {[
          { label: 'Дата', value: formatDate(comp.event_date) },
          { label: 'Взнос', value: formatRub(comp.entry_fee) },
          { label: 'Лимит участников', value: comp.participant_limit ? `${comp.participant_limit}` : '—' },
          { label: 'Выплата', value: formatRub(MOCK_COMPETITION_SUMMARY.organizer_share) },
        ].map(s => (
          <Card key={s.label}><CardContent className="pt-4"><p className="text-xs text-text-muted">{s.label}</p><p className="font-display text-xl font-bold text-text-primary mt-1">{s.value}</p></CardContent></Card>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" asChild><Link to={`/organizer/competitions/${id}/participants`}><Users className="h-4 w-4" />Участники</Link></Button>
        {comp.status === 'draft' && <Button onClick={() => toast.success('Регистрация открыта!')}>Открыть регистрацию</Button>}
        {comp.status === 'open' && <Button variant="danger" onClick={() => toast.success('Регистрация закрыта')}>Закрыть регистрацию</Button>}
      </div>
    </div>
  )
}
