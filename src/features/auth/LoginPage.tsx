import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, FlaskConical, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'

import { useLogin } from '@/api/endpoints/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InlineError } from '@/shared/ErrorBoundary'
import { ThemeToggle } from '@/shared/ThemeToggle'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

type LoginFormData = z.infer<typeof loginSchema>

const ROLE_REDIRECTS = {
  participant: '/participant/dashboard',
  judge: '/judge/dashboard',
  organizer: '/organizer/dashboard',
}

const MOCK_ACCOUNTS = [
  { role: 'Участник', email: 'participant@test.ru', desc: 'Заказ обратной связи, просмотр турниров' },
  { role: 'Судья', email: 'judge@test.ru', desc: 'Просмотр запросов, отправка видеоотзывов' },
  { role: 'Организатор', email: 'organizer@test.ru', desc: 'Создание турниров, управление участниками' },
]

const hasMocks = import.meta.env.VITE_USE_MOCKS === 'true'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [tab, setTab] = useState<'login' | 'test'>('login')
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname

  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: (response) => {
        toast.success(`Добро пожаловать, ${response.user.full_name}!`)
        const redirect = from ?? ROLE_REDIRECTS[response.user.role]
        navigate(redirect, { replace: true })
      },
    })
  }

  // Quick fill for mock users
  const quickFill = (email: string) => {
    setValue('email', email)
    setValue('password', 'password123')
  }

  return (
    <div className="flex min-h-screen bg-bg-base">
      <ThemeToggle variant="icon" className="fixed right-4 top-4 z-50" />
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-bg-surface border-r border-border-subtle relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-accent-500/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent-500/3 blur-2xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 shadow-glow-sm">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2C10 2 15 5.5 15 10C15 12.8 13.2 15.2 10 16C6.8 15.2 5 12.8 5 10C5 5.5 10 2 10 2Z"
                  fill="currentColor" className="text-text-inverse"
                />
                <circle cx="10" cy="10" r="2.5" fill="currentColor" className="text-amber-800" />
              </svg>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-text-primary">DanceFeed</p>
              <p className="text-xs text-text-muted">Platform</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <h1 className="font-display text-4xl font-bold leading-tight text-text-primary">
            Платформа обратной
            <br />
            связи для{' '}
            <span className="text-accent-500">танцевальных</span>
            <br />
            соревнований
          </h1>
          <p className="mt-4 text-text-secondary leading-relaxed">
            Связывает участников, судей и организаторов в едином цифровом пространстве.
            Структурированная обратная связь по вашему выступлению.
          </p>
        </div>

        <div className="relative flex gap-8">
          {[
            { value: '200К+', label: 'Участников' },
            { value: '160', label: 'Турниров в год' },
            { value: '30 дн', label: 'Срок ОС' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-2xl font-bold text-accent-500">{stat.value}</p>
              <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form / test accounts */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 sm:py-12">
        <div className="w-full max-w-[400px]">
          {/* Tabs */}
          {hasMocks && (
            <div className="mb-6 flex rounded-lg bg-bg-elevated p-1 border border-border">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
                  tab === 'login'
                    ? 'bg-bg-surface text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-secondary',
                )}
              >
                <LogIn className="h-4 w-4" />
                Вход
              </button>
              <button
                type="button"
                onClick={() => setTab('test')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
                  tab === 'test'
                    ? 'bg-bg-surface text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-secondary',
                )}
              >
                <FlaskConical className="h-4 w-4" />
                Тестовые аккаунты
              </button>
            </div>
          )}

          {tab === 'login' ? (
            <>
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-text-primary">Вход в систему</h2>
                <p className="mt-1 text-sm text-text-secondary">
                  Нет аккаунта?{' '}
                  <Link to="/register" className="text-accent-500 hover:text-accent-400 font-medium">
                    Зарегистрироваться
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.ru"
                  error={errors.email?.message}
                  leftIcon={<Mail className="h-4 w-4" />}
                  {...register('email')}
                />

                <Input
                  label="Пароль"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-text-muted hover:text-text-secondary"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  {...register('password')}
                />

                {error && (
                  <InlineError
                    message={
                      (error as { response?: { data?: { error?: string } } })?.response?.data
                        ?.error ?? 'Ошибка при входе'
                    }
                  />
                )}

                <Button type="submit" loading={isPending} className="mt-2 w-full">
                  Войти
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  Тестовые аккаунты
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  Нажмите на карточку, чтобы войти под выбранной ролью
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {MOCK_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => {
                      quickFill(acc.email)
                      setTab('login')
                      toast('Данные подставлены — нажмите «Войти»', { icon: '✅' })
                    }}
                    className="group flex flex-col gap-1.5 rounded-lg border border-border bg-bg-surface p-4 text-left transition-all hover:border-accent-500/50 hover:bg-accent-500/5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-semibold text-text-primary">
                        {acc.role}
                      </span>
                      <span className="rounded-full bg-bg-elevated px-2.5 py-0.5 font-mono text-2xs text-text-muted group-hover:bg-accent-500/10 group-hover:text-accent-500 transition-colors">
                        {acc.email}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">{acc.desc}</p>
                    <p className="text-2xs text-text-muted">
                      Пароль: <span className="font-mono">password123</span>
                    </p>
                  </button>
                ))}
              </div>

              <p className="mt-4 text-center text-2xs text-text-muted">
                Тестовые аккаунты доступны только в режиме разработки
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
