import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FeedbackStatusBadge } from '@/components/ui/badge'
import { InlineError } from '@/shared/ErrorBoundary'
import { LoadingSpinner } from '@/shared/LoadingSpinner'
import { formatDate, formatRub, daysUntil } from '@/lib/utils'
import { useFeedbackRequest, useFeedbackResponse, useConfirmFeedback } from '@/api/endpoints/feedback'
import { useJudge } from '@/api/endpoints/judges'
import toast from 'react-hot-toast'

export default function FeedbackRequestPage() {
  const { id } = useParams<{ id: string }>()
  const { data: req, isLoading, isError } = useFeedbackRequest(id ?? '')
  const { data: judge } = useJudge(req?.judge_id ?? '')
  const { data: response } = useFeedbackResponse(req?.response_id ?? '')
  const { mutate: confirm, isPending: isConfirming } = useConfirmFeedback(id ?? '')

  const back = (
    <Button variant="ghost" size="sm" asChild className="mb-6">
      <Link to="/participant/dashboard"><ArrowLeft className="h-4 w-4" />Назад</Link>
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

  if (isError || !req) {
    return (
      <div className="page-container max-w-2xl">
        {back}
        <InlineError message="Запрос не найден" />
      </div>
    )
  }

  const daysLeft = daysUntil(req.deadline_at)

  const handleConfirm = () =>
    confirm(undefined, {
      onSuccess: () => toast.success('ОС подтверждена! Средства переведены судье'),
      onError: () => toast.error('Не удалось подтвердить'),
    })

  return (
    <div className="page-container max-w-2xl">
      {back}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="page-title">Запрос обратной связи</h1>
        <FeedbackStatusBadge status={req.status} />
      </div>
      <Card className="mb-4">
        <CardContent className="pt-5 flex flex-col gap-3">
          <div className="flex justify-between text-sm"><span className="text-text-muted">Судья</span><span className="font-medium text-text-primary">{judge?.full_name ?? '—'}</span></div>
          <div className="flex justify-between text-sm"><span className="text-text-muted">Создан</span><span className="text-text-primary">{formatDate(req.created_at)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-text-muted">Дедлайн</span><span className={daysLeft <= 5 ? 'text-red-400 font-medium' : 'text-text-primary'}>{formatDate(req.deadline_at)} ({daysLeft} дн.)</span></div>
          <div className="flex justify-between text-sm"><span className="text-text-muted">Сумма</span><span className="font-medium text-accent-500">{formatRub(req.price)}</span></div>
        </CardContent>
      </Card>

      {req.status === 'awaiting_video' && (
        <Card className="mb-4 border-blue-500/30 bg-blue-500/5">
          <CardContent className="pt-5">
            <p className="font-semibold text-blue-400 mb-2">Загрузите видео выступления</p>
            <p className="text-sm text-text-secondary mb-4">После загрузки судья получит уведомление и начнёт работу над ОС</p>
            <Button onClick={() => toast.success('Откроется диалог загрузки файла')}><Play className="h-4 w-4" />Загрузить видео</Button>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card>
          <CardContent className="pt-5">
            <p className="font-display font-semibold text-text-primary mb-4">Обратная связь от судьи</p>
            <div className="flex flex-col gap-4">
              {[
                { label: '✅ Сильные стороны', content: response.strengths, color: 'border-emerald-500/30 bg-emerald-500/5' },
                { label: '⚠️ Ошибки', content: response.errors, color: 'border-amber-500/30 bg-amber-500/5' },
                { label: '💡 Рекомендации', content: response.recommendations, color: 'border-blue-500/30 bg-blue-500/5' },
              ].map((block) => (
                <div key={block.label} className={`rounded-lg border p-4 ${block.color}`}>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{block.label}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{block.content}</p>
                </div>
              ))}
            </div>
            {req.status === 'awaiting_confirmation' && (
              <Button className="mt-5 w-full" loading={isConfirming} onClick={handleConfirm}>
                <CheckCircle className="h-4 w-4" />Подтвердить получение ОС
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
