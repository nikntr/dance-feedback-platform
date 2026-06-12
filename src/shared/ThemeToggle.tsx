import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/store/theme.store'
import { cn } from '@/lib/utils'

/**
 * Theme switcher. Two presentations:
 *  - "segmented" (default): a labelled Light/Dark control for settings/sidebar.
 *  - "icon": a single round button that toggles, for auth/standalone pages.
 */
export function ThemeToggle({
  variant = 'segmented',
  className,
}: {
  variant?: 'segmented' | 'icon'
  className?: string
}) {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-full',
          'border border-border bg-bg-surface text-text-secondary',
          'transition-colors hover:bg-bg-elevated hover:text-text-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
          className,
        )}
      >
        {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>
    )
  }

  return (
    <div className={cn('flex items-center justify-between gap-3 px-2 py-1.5', className)}>
      <span className="text-xs font-medium text-text-secondary">Тема</span>
      <div
        role="radiogroup"
        aria-label="Выбор темы оформления"
        className="flex rounded-md border border-border bg-bg-elevated p-0.5"
      >
        <button
          type="button"
          role="radio"
          aria-checked={theme === 'light'}
          aria-label="Светлая тема"
          onClick={() => setTheme('light')}
          className={cn(
            'flex h-7 w-9 items-center justify-center rounded transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
            theme === 'light'
              ? 'bg-bg-surface text-accent-500 shadow-sm'
              : 'text-text-muted hover:text-text-secondary',
          )}
        >
          <Sun className="h-4 w-4" />
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={theme === 'dark'}
          aria-label="Тёмная тема"
          onClick={() => setTheme('dark')}
          className={cn(
            'flex h-7 w-9 items-center justify-center rounded transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
            theme === 'dark'
              ? 'bg-bg-surface text-accent-400 shadow-sm'
              : 'text-text-muted hover:text-text-secondary',
          )}
        >
          <Moon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
