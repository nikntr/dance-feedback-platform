import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Upload, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PaymentStatusBadge } from '@/components/ui/badge'
import { EmptyState, InlineError } from '@/shared/ErrorBoundary'
import { CardSkeleton } from '@/shared/LoadingSpinner'
import { formatDate, getInitials } from '@/lib/utils'
import { useCompetition, useCompetitionRegistrations } from '@/api/endpoints/competitions'
import toast from 'react-hot-toast'

export default function OrganizerParticipantsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: comp } = useCompetition(id ?? '')
  const { data, isLoading, isError } = useCompetitionRegistrations(id ?? '')
  const registrations = data?.data ?? []

  return (
    <div className="page-container">
      <Button variant="ghost" size="sm" asChild className="mb-6"><Link to={`/organizer/competitions/${id}`}><ArrowLeft className="h-4 w-4" />Назад</Link></Button>
      <div className="mb-8"><h1 className="page-title">Участники</h1>{comp && <p className="page-subtitle">{comp.title}</p>}</div>

      {isLoading ? (
        <div className="flex flex-col gap-3"><CardSkeleton /><CardSkeleton /></div>
      ) : isError ? (
        <InlineError message="Не удалось загрузить участников" />
      ) : registrations.length === 0 ? (
        <EmptyState icon={<Users className="h-5 w-5" />} title="Нет зарегистрированных участников" />
      ) : (
        <div className="flex flex-col gap-3">
          {registrations.map((reg) => (
            <Card key={reg.id}><CardContent className="flex items-center gap-4 pt-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-elevated font-display text-sm font-bold text-text-secondary">{getInitials(reg.full_name)}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-text-primary">{reg.full_name}</p><p className="text-xs text-text-muted">{formatDate(reg.registered_at)}</p></div>
              <PaymentStatusBadge status={reg.payment_status} />
              <Button variant="ghost" size="sm" onClick={() => toast.success('Откроется диалог загрузки видео')}><Upload className="h-4 w-4" />Видео</Button>
            </CardContent></Card>
          ))}
        </div>
      )}
    </div>
  )
}
