import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FeedbackStatusBadge } from '@/components/ui/badge'
import { InlineError } from '@/shared/ErrorBoundary'
import { LoadingSpinner } from '@/shared/LoadingSpinner'
import { formatDate, formatRub, daysUntil } from '@/lib/utils'
import { useFeedbackRequest, useCreateFeedbackResponse } from '@/api/endpoints/feedback'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function JudgeRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: req, isLoading, isError } = useFeedbackRequest(id ?? '')
  const { mutate: submitResponse, isPending: isSubmitting } = useCreateFeedbackResponse()
  const [strengths, setStrengths] = useState('')
  const [errors, setErrors] = useState('')
  const [recommendations, setRecommendations] = useState('')

  const back = (
    <Button variant="ghost" size="sm" asChild className="mb-6">
      <Link to="/judge/requests"><ArrowLeft className="h-4 w-4" />Назад</Link>
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
  const canSubmit =
    strengths.trim().length >= 10 && errors.trim().length >= 10 && recommendations.trim().length >= 10

  const handleSubmit = () => {
    if (!canSubmit) return
    submitResponse(
      {
        request_id: req.id,
        strengths: strengths.trim(),
        errors: errors.trim(),
        recommendations: recommendations.trim(),
      },
      {
        onSuccess: () => toast.success('Обратная связь отправлена!'),
        onError: () => toast.error('Не удалось отправить обратную связь'),
      },
    )
  }

  return (
    <div className="page-container max-w-2xl">
      {back}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="page-title">Запрос #{req.id.slice(-3)}</h1>
        <FeedbackStatusBadge status={req.status} />
      </div>
      <Card className="mb-4">
        <CardContent className="pt-5 flex flex-col gap-2">
          <div className="flex justify-between text-sm"><span className="text-text-muted">Дедлайн</span><span className={cn('font-medium', daysLeft <= 5 ? 'text-red-400' : 'text-text-primary')}>{formatDate(req.deadline_at)} ({daysLeft} дн.)</span></div>
          <div className="flex justify-between text-sm"><span className="text-text-muted">Оплата</span><span className="font-medium text-accent-500">{formatRub(req.price)}</span></div>
          {req.comment && <div className="mt-2 rounded-lg bg-bg-elevated p-3 text-sm text-text-secondary">{req.comment}</div>}
        </CardContent>
      </Card>
      {req.status === 'pending' && (
        <Card>
          <CardContent className="pt-5">
            <p className="font-display font-semibold text-text-primary mb-4">Заполните обратную связь</p>
            {[
              { label: 'Сильные стороны', value: strengths, onChange: setStrengths, placeholder: 'Опишите сильные стороны выступления...' },
              { label: 'Ошибки и замечания', value: errors, onChange: setErrors, placeholder: 'Укажите конкретные ошибки...' },
              { label: 'Рекомендации', value: recommendations, onChange: setRecommendations, placeholder: 'Дайте конкретные советы по улучшению...' },
            ].map((field) => (
              <div key={field.label} className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">{field.label}</label>
                <textarea rows={4} value={field.value} maxLength={1000} onChange={(e) => field.onChange(e.target.value)} placeholder={field.placeholder}
                  className="w-full rounded-md bg-bg-elevated text-sm text-text-primary border border-border placeholder:text-text-muted px-3 py-2.5 resize-none focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500" />
                <p className="mt-1 text-2xs text-text-muted">{field.value.trim().length}/1000 (мин. 10 символов)</p>
              </div>
            ))}
            <Button className="w-full" disabled={!canSubmit} loading={isSubmitting} onClick={handleSubmit}><Send className="h-4 w-4" />Отправить обратную связь</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
