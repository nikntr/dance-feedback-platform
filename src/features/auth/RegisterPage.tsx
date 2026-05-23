import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

import { useRegister } from '@/api/endpoints/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { InlineError } from '@/shared/ErrorBoundary'
import { LegalDialog, PRIVACY_POLICY, TERMS_OF_USE } from '@/shared/LegalDialog'
import type { RegisterRequest, UserRole } from '@/api/types'

const registerSchema = z.object({
  full_name: z.string().trim().min(2, 'Введите имя').max(100, 'Слишком длинное имя'),
  email: z.string().trim().email('Некорректный email'),
  phone: z
    .string()
    .trim()
    .refine((v) => {
      const digits = v.replace(/\D/g, '')
      return digits.length === 11 && /^[78]/.test(digits)
    }, 'Введите корректный номер: +7 XXX XXX-XX-XX'),
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Za-zА-Яа-яЁё]/, 'Добавьте хотя бы одну букву')
    .regex(/\d/, 'Добавьте хотя бы одну цифру'),
  role: z.enum(['participant', 'judge', 'organizer']),
  bio: z.string().max(1000, 'Максимум 1000 символов').optional(),
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({ message: 'Необходимо согласие на обработку персональных данных' }),
  }),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Необходимо принять пользовательское соглашение' }),
  }),
})

type RegisterFormData = z.infer<typeof registerSchema>

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'participant', label: 'Участник', description: 'Получаю обратную связь' },
  { value: 'judge', label: 'Судья', description: 'Даю экспертную оценку' },
  { value: 'organizer', label: 'Организатор', description: 'Провожу соревнования' },
]

const ROLE_REDIRECTS: Record<UserRole, string> = {
  participant: '/participant/dashboard',
  judge: '/judge/dashboard',
  organizer: '/organizer/dashboard',
}

/** Нормализует телефон к виду +7XXXXXXXXXX перед отправкой на бэк */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  return `+7${digits.slice(-10)}`
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { mutate: register, isPending, error } = useRegister()

  const {
    register: formRegister,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'participant' },
  })

  const selectedRole = watch('role')

  const onSubmit = (data: RegisterFormData) => {
    const payload: RegisterRequest = {
      full_name: data.full_name.trim(),
      email: data.email.trim(),
      phone: normalizePhone(data.phone),
      password: data.password,
      role: data.role,
      ...(data.role === 'judge' && data.bio ? { bio: data.bio } : {}),
    }
    register(payload, {
      onSuccess: (response) => {
        toast.success('Аккаунт успешно создан!')
        navigate(ROLE_REDIRECTS[response.user.role], { replace: true })
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4 py-10 sm:px-8 sm:py-12">
      <div className="w-full max-w-[440px]">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500 shadow-glow-accent">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2C10 2 15 5.5 15 10C15 12.8 13.2 15.2 10 16C6.8 15.2 5 12.8 5 10C5 5.5 10 2 10 2Z"
                fill="currentColor" className="text-text-inverse"
              />
              <circle cx="10" cy="10" r="2.5" fill="currentColor" className="text-amber-800" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary">Регистрация</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-accent-500 hover:text-accent-400 font-medium">
              Войти
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Role selector */}
          <div>
            <p className="mb-2 text-sm font-medium text-text-secondary">Роль в системе</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setValue('role', role.value)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-all duration-150',
                    selectedRole === role.value
                      ? 'border-accent-500/50 bg-accent-500/10 text-accent-400'
                      : 'border-border bg-bg-elevated text-text-secondary hover:border-border-strong hover:text-text-primary',
                  )}
                >
                  <span className="text-sm font-semibold font-display">{role.label}</span>
                  <span className="text-2xs leading-tight opacity-75 sm:text-xs">{role.description}</span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Полное имя"
            placeholder="Иван Иванов"
            autoComplete="name"
            error={errors.full_name?.message}
            leftIcon={<User className="h-4 w-4" />}
            {...formRegister('full_name')}
          />

          <Input
            label="Email"
            type="email"
            inputMode="email"
            placeholder="your@email.ru"
            autoComplete="email"
            error={errors.email?.message}
            leftIcon={<Mail className="h-4 w-4" />}
            {...formRegister('email')}
          />

          <Input
            label="Телефон"
            type="tel"
            inputMode="tel"
            placeholder="+7 900 000-00-00"
            autoComplete="tel"
            error={errors.phone?.message}
            leftIcon={<Phone className="h-4 w-4" />}
            {...formRegister('phone')}
          />

          <Input
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            placeholder="Минимум 8 символов"
            autoComplete="new-password"
            hint="Минимум 8 символов, минимум одна буква и одна цифра"
            error={errors.password?.message}
            leftIcon={<Lock className="h-4 w-4" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                className="text-text-muted hover:text-text-secondary"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...formRegister('password')}
          />

          {/* Bio field — only for judges */}
          {selectedRole === 'judge' && (
            <div className="flex flex-col gap-1.5 animate-fade-in">
              <label className="text-sm font-medium text-text-secondary">
                О себе (для судей)
              </label>
              <textarea
                placeholder="Расскажите о вашем опыте и специализации..."
                rows={3}
                maxLength={1000}
                className={cn(
                  'w-full rounded-md bg-bg-elevated font-body text-sm text-text-primary',
                  'border border-border placeholder:text-text-muted',
                  'px-3 py-2.5 resize-none',
                  'transition-colors duration-150',
                  'focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500',
                )}
                {...formRegister('bio')}
              />
              {errors.bio && <p className="text-xs text-red-400">{errors.bio.message}</p>}
            </div>
          )}

          {/* Consent — personal data + terms of use */}
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-bg-elevated/50 p-4">
            <label className="flex items-start gap-3 text-sm text-text-secondary">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-accent-500"
                {...formRegister('acceptPrivacy')}
              />
              <span>
                Я даю{' '}
                <LegalDialog
                  trigger={
                    <button type="button" className="text-accent-500 underline-offset-2 hover:underline">
                      согласие на обработку персональных данных
                    </button>
                  }
                  title={PRIVACY_POLICY.title}
                  content={PRIVACY_POLICY.content}
                />
              </span>
            </label>
            {errors.acceptPrivacy && (
              <p className="text-xs text-red-400">{errors.acceptPrivacy.message}</p>
            )}

            <label className="flex items-start gap-3 text-sm text-text-secondary">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-accent-500"
                {...formRegister('acceptTerms')}
              />
              <span>
                Я принимаю{' '}
                <LegalDialog
                  trigger={
                    <button type="button" className="text-accent-500 underline-offset-2 hover:underline">
                      пользовательское соглашение
                    </button>
                  }
                  title={TERMS_OF_USE.title}
                  content={TERMS_OF_USE.content}
                />
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-xs text-red-400">{errors.acceptTerms.message}</p>
            )}
          </div>

          {error && (
            <InlineError
              message={
                (error as { response?: { data?: { error?: string } } })?.response?.data?.error ??
                'Ошибка при регистрации'
              }
            />
          )}

          <Button type="submit" loading={isPending} className="w-full">
            Создать аккаунт
          </Button>
        </form>
      </div>
    </div>
  )
}
