import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Upload } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PaymentStatusBadge } from '@/components/ui/badge'
import { formatDate, getInitials } from '@/lib/utils'
import { MOCK_REGISTRATIONS, MOCK_COMPETITIONS } from '@/mocks/data'
import toast from 'react-hot-toast'

export default function OrganizerParticipantsPage() {
  const { id } = useParams<{ id: string }>()
  const comp = MOCK_COMPETITIONS.find((c) => c.id === id)
  return (
    <div className="page-container">
      <Button variant="ghost" size="sm" asChild className="mb-6"><Link to={`/organizer/competitions/${id}`}><ArrowLeft className="h-4 w-4" />Назад</Link></Button>
      <div className="mb-8"><h1 className="page-title">Участники</h1>{comp && <p className="page-subtitle">{comp.title}</p>}</div>
      <div className="flex flex-col gap-3">
        {MOCK_REGISTRATIONS.map((reg) => (
          <Card key={reg.id}><CardContent className="flex items-center gap-4 pt-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-elevated font-display text-sm font-bold text-text-secondary">{getInitials(reg.full_name)}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-text-primary">{reg.full_name}</p><p className="text-xs text-text-muted">{formatDate(reg.registered_at)}</p></div>
            <PaymentStatusBadge status={reg.payment_status} />
            <Button variant="ghost" size="sm" onClick={() => toast.success('Откроется диалог загрузки видео')}><Upload className="h-4 w-4" />Видео</Button>
          </CardContent></Card>
        ))}
      </div>
    </div>
  )
}
