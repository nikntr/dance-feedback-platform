import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Star, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'
import { useCreateFeedbackRequest } from '@/api/endpoints/feedback'
import { useJudges } from '@/api/endpoints/judges'
import { useCompetitions } from '@/api/endpoints/competitions'
import { LoadingSpinner } from '@/shared/LoadingSpinner'
import { EmptyState } from '@/shared/ErrorBoundary'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const COMMENT_MIN = 10
const COMMENT_MAX = 1000

export default function FeedbackNewPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const presetJudge = searchParams.get('judge')

  const [selectedJudge, setSelectedJudge] = useState<string | null>(presetJudge)
  const [selectedComp, setSelectedComp] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [step, setStep] = useState<1 | 2>(1)

  const { mutate: createRequest, isPending } = useCreateFeedbackRequest()
  const judgesQuery = useJudges()
  const competitionsQuery = useCompetitions()
  const judges = judgesQuery.data?.data ?? []
  const competitions = (competitionsQuery.data?.data ?? []).filter((c) => c.status !== 'draft')

  const commentValid = comment.trim().length >= COMMENT_MIN
  const canOrder = !!selectedJudge && !!selectedComp && commentValid

  const handleOrder = () => {
    if (!canOrder) return
    createRequest(
      { judge_id: selectedJudge!, competition_id: selectedComp!, comment: comment.trim() },
      {
        onSuccess: () => {
          toast.success('Запрос создан! Перенаправление на оплату...')
          setTimeout(() => navigate('/participant/dashboard'), 1200)
        },
        onError: () => toast.error('Не удалось создать запрос'),
      },
    )
  }

  return (
    <div className="page-container max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/participant/dashboard">
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Link>
      </Button>
      <div className="mb-8">
        <h1 className="page-title">Заказ обратной связи</h1>
        <p className="page-subtitle">Выберите судью и соревнование</p>
      </div>

      {step === 1 ? (
        <>
          <h2 className="font-display text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Шаг 1 — Выберите судью
          </h2>
          {judgesQuery.isLoading && (
            <div className="flex justify-center py-10"><LoadingSpinner /></div>
          )}
          {!judgesQuery.isLoading && judges.length === 0 && (
            <EmptyState icon={<Star className="h-5 w-5" />} title="Судьи недоступны" className="mb-6" />
          )}
          <div className="grid gap-3 sm:grid-cols-2 mb-6">
            {judges.map((judge) => (
              <button
                key={judge.id}
                onClick={() => setSelectedJudge(judge.id)}
                className={cn(
                  'text-left rounded-lg border p-4 transition-all',
                  selectedJudge === judge.id
                    ? 'border-accent-500/50 bg-accent-500/5'
                    : 'border-border bg-bg-surface hover:border-border-strong',
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-500/20 font-display text-sm font-bold text-accent-400">
                    {getInitials(judge.full_name)}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{judge.full_name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-accent-500 text-accent-500" />
                      <span className="text-xs text-text-secondary">{judge.rating}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <Button disabled={!selectedJudge} onClick={() => setStep(2)}>
            Далее
          </Button>
        </>
      ) : (
        <>
          <h2 className="font-display text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Шаг 2 — Соревнование и комментарий
          </h2>
          <div className="flex flex-col gap-3 mb-6">
            {competitions.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setSelectedComp(comp.id)}
                className={cn(
                  'text-left rounded-lg border p-4 transition-all',
                  selectedComp === comp.id
                    ? 'border-accent-500/50 bg-accent-500/5'
                    : 'border-border bg-bg-surface hover:border-border-strong',
                )}
              >
                <p className="font-medium text-text-primary">{comp.title}</p>
                <p className="text-xs text-text-muted mt-1">
                  {comp.event_date} · стоимость ОС ~1 500 ₽
                </p>
              </button>
            ))}
          </div>

          {/* Comment — обязателен по API */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Комментарий судье
            </label>
            <textarea
              rows={4}
              value={comment}
              maxLength={COMMENT_MAX}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Опишите, на что обратить внимание: танец, программа, конкретные элементы..."
              className="w-full rounded-md bg-bg-elevated text-sm text-text-primary border border-border placeholder:text-text-muted px-3 py-2.5 resize-none focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            />
            <p
              className={cn(
                'mt-1 text-2xs',
                comment.length > 0 && !commentValid ? 'text-red-400' : 'text-text-muted',
              )}
            >
              {comment.trim().length}/{COMMENT_MAX} (мин. {COMMENT_MIN} символов)
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Назад
            </Button>
            <Button disabled={!canOrder} loading={isPending} onClick={handleOrder}>
              <MessageSquare className="h-4 w-4" />
              Заказать и оплатить
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
