import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateCompetition } from '@/api/endpoints/competitions'

const todayStr = new Date().toISOString().split('T')[0]

const schema = z.object({
  title: z.string().trim().min(3, 'Минимум 3 символа').max(120, 'Слишком длинное название'),
  event_date: z
    .string()
    .min(1, 'Укажите дату проведения')
    .refine((d) => {
      const date = new Date(d)
      return !Number.isNaN(date.getTime()) && d >= todayStr
    }, 'Дата не может быть в прошлом'),
  participant_limit: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z
      .number({ invalid_type_error: 'Введите число' })
      .int('Только целое число')
      .min(1, 'Минимум 1 участник')
      .max(100000, 'Слишком большое значение')
      .optional(),
  ),
  entry_fee: z.preprocess(
    (v) => (v === '' || v == null ? NaN : Number(v)),
    z
      .number({ invalid_type_error: 'Укажите взнос числом' })
      .min(0, 'Не может быть отрицательным')
      .max(1000000, 'Слишком большая сумма'),
  ),
})

type FormData = z.infer<typeof schema>

// Запрещаем ввод символов, превращающих число в некорректное/отрицательное
const blockInvalidNumberKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
}

export default function OrganizerCompetitionNewPage() {
  const navigate = useNavigate()
  const { mutate: createCompetition, isPending } = useCreateCompetition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    createCompetition(
      {
        title: data.title.trim(),
        event_date: data.event_date,
        entry_fee: data.entry_fee,
        ...(data.participant_limit ? { participant_limit: data.participant_limit } : {}),
      },
      {
        onSuccess: () => {
          toast.success('Соревнование создано!')
          navigate('/organizer/dashboard')
        },
        onError: () => toast.error('Не удалось создать соревнование'),
      },
    )
  }

  return (
    <div className="page-container max-w-lg">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/organizer/dashboard">
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Link>
      </Button>
      <h1 className="page-title mb-8">Новое соревнование</h1>
      <Card>
        <CardContent className="pt-5">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Название турнира"
              placeholder="Открытый кубок Москвы 2025"
              error={errors.title?.message}
              {...register('title')}
            />
            <Input
              label="Дата проведения"
              type="date"
              min={todayStr}
              error={errors.event_date?.message}
              {...register('event_date')}
            />
            <Input
              label="Лимит участников"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              placeholder="200"
              hint="Необязательно. Минимум 1 участник"
              onKeyDown={blockInvalidNumberKeys}
              error={errors.participant_limit?.message}
              {...register('participant_limit')}
            />
            <Input
              label="Вступительный взнос (₽)"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              placeholder="2500"
              hint="0 — бесплатное участие"
              onKeyDown={blockInvalidNumberKeys}
              error={errors.entry_fee?.message}
              {...register('entry_fee')}
            />
            <Button type="submit" loading={isPending} className="mt-2">
              Создать соревнование
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
