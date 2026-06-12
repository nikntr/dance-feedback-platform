import { useEffect, useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Trophy,
  Users,
  MessageSquare,
  User,
  LogOut,
  ClipboardList,
  Star,
  PlusSquare,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { cn, getInitials } from '@/lib/utils'
import { ThemeToggle } from '@/shared/ThemeToggle'
import type { UserRole } from '@/api/types'

// ── Navigation config ─────────────────────────────────────────────────────

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  participant: [
    { label: 'Главная',       path: '/participant/dashboard', icon: LayoutDashboard },
    { label: 'Соревнования',  path: '/competitions',          icon: Trophy },
    { label: 'Судьи',         path: '/judges',                icon: Star },
    { label: 'Мои запросы',   path: '/feedback/new',          icon: MessageSquare },
  ],
  judge: [
    { label: 'Главная',       path: '/judge/dashboard',  icon: LayoutDashboard },
    { label: 'Запросы',       path: '/judge/requests',   icon: ClipboardList },
    { label: 'Мой профиль',   path: '/judge/profile',    icon: User },
  ],
  organizer: [
    { label: 'Главная',       path: '/organizer/dashboard',        icon: LayoutDashboard },
    { label: 'Мои турниры',   path: '/organizer/dashboard',        icon: Trophy },
    { label: 'Новый турнир',  path: '/organizer/competitions/new', icon: PlusSquare },
    { label: 'Участники',     path: '/organizer/dashboard',        icon: Users },
  ],
}

const ROLE_LABEL: Record<UserRole, string> = {
  participant: 'Участник',
  judge: 'Судья',
  organizer: 'Организатор',
}

// ── Logo ──────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-500 shadow-glow-sm">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1C8 1 12 4 12 8C12 10.2 10.6 12.2 8 13C5.4 12.2 4 10.2 4 8C4 4 8 1 8 1Z"
            fill="currentColor"
            className="text-text-inverse"
          />
          <circle cx="8" cy="8" r="2" fill="currentColor" className="text-accent-800" />
        </svg>
      </div>
      <div>
        <p className="font-display text-sm font-bold tracking-tight text-text-primary">
          DanceFeed
        </p>
        <p className="text-2xs font-medium text-text-muted uppercase tracking-wider">
          Platform
        </p>
      </div>
    </div>
  )
}

// ── Sidebar content (shared by desktop sidebar & mobile drawer) ─────────────

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const location = useLocation()

  if (!user) return null

  const navItems = NAV_CONFIG[user.role]

  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center px-5 border-b border-border-subtle">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-2 px-2">
          <p className="text-2xs font-semibold uppercase tracking-wider text-text-muted">
            {ROLE_LABEL[user.role]}
          </p>
        </div>
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/participant/dashboard' &&
               item.path !== '/judge/dashboard' &&
               item.path !== '/organizer/dashboard' &&
               location.pathname.startsWith(item.path))

            return (
              <li key={item.path + item.label}>
                <NavLink
                  to={item.path}
                  onClick={onNavigate}
                  className={cn(
                    'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm',
                    'transition-all duration-150',
                    isActive
                      ? 'bg-accent-500/10 text-accent-400 font-medium border border-accent-500/20'
                      : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-accent-500' : 'text-text-muted group-hover:text-text-secondary',
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="h-3 w-3 text-accent-500/60" />}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Settings + User info + Logout */}
      <div className="border-t border-border-subtle p-3">
        <ThemeToggle className="mb-1" />
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-xs font-bold font-display text-accent-400">
            {getInitials(user.full_name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">{user.full_name}</p>
            <p className="truncate text-xs text-text-muted">{user.email}</p>
          </div>
          <button
            onClick={logout}
            title="Выйти"
            aria-label="Выйти"
            className="shrink-0 rounded p-1.5 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )
}

// ── AppShell ──────────────────────────────────────────────────────────────

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  // Close mobile drawer on route change
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  // Prevent body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-bg-surface border-r border-border-subtle lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border-subtle bg-bg-surface px-4 lg:hidden">
        <Logo />
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Открыть меню"
          className="rounded-md p-2 text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer + backdrop */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-bg-surface border-r border-border-subtle shadow-modal animate-slide-up">
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Закрыть меню"
              className="absolute right-3 top-4 z-10 rounded-md p-1.5 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="lg:ml-60">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
