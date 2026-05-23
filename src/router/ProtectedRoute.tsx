import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { PageLoader } from '@/shared/LoadingSpinner'
import type { UserRole } from '@/api/types'

// ── ProtectedRoute — требует авторизации ──────────────────────────────────

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

// ── RoleGuard — проверяет роль пользователя ───────────────────────────────

interface RoleGuardProps {
  allowedRoles: UserRole[]
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user)

  if (!user) {
    return <PageLoader />
  }

  if (!allowedRoles.includes(user.role)) {
    // Редирект на дашборд своей роли
    const roleDashboard: Record<UserRole, string> = {
      participant: '/participant/dashboard',
      judge: '/judge/dashboard',
      organizer: '/organizer/dashboard',
    }
    return <Navigate to={roleDashboard[user.role]} replace />
  }

  return <Outlet />
}
