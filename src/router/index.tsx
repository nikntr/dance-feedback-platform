import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute, RoleGuard } from './ProtectedRoute'
import { AppShell } from '@/shared/AppShell'
import { PageLoader } from '@/shared/LoadingSpinner'
import { useAuthStore } from '@/store/auth.store'

// ── Lazy-loaded pages ─────────────────────────────────────────────────────

// Auth
const LoginPage = lazy(() => import('@/features/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/RegisterPage'))

// Participant
const ParticipantDashboard = lazy(() => import('@/features/participant/DashboardPage'))
const CompetitionsListPage = lazy(() => import('@/features/participant/CompetitionsListPage'))
const CompetitionDetailPage = lazy(() => import('@/features/participant/CompetitionDetailPage'))
const JudgesListPage = lazy(() => import('@/features/participant/JudgesListPage'))
const JudgeDetailPage = lazy(() => import('@/features/participant/JudgeDetailPage'))
const FeedbackNewPage = lazy(() => import('@/features/participant/FeedbackNewPage'))
const FeedbackRequestPage = lazy(() => import('@/features/participant/FeedbackRequestPage'))

// Judge
const JudgeDashboard = lazy(() => import('@/features/judge/DashboardPage'))
const JudgeRequestsPage = lazy(() => import('@/features/judge/RequestsPage'))
const JudgeRequestDetailPage = lazy(() => import('@/features/judge/RequestDetailPage'))
const JudgeProfilePage = lazy(() => import('@/features/judge/ProfilePage'))

// Organizer
const OrganizerDashboard = lazy(() => import('@/features/organizer/DashboardPage'))
const OrganizerCompetitionNewPage = lazy(() => import('@/features/organizer/CompetitionNewPage'))
const OrganizerCompetitionDetailPage = lazy(() => import('@/features/organizer/CompetitionDetailPage'))
const OrganizerParticipantsPage = lazy(() => import('@/features/organizer/ParticipantsPage'))

// ── Root redirect based on role ───────────────────────────────────────────

function RootRedirect() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const roleMap = {
    participant: '/participant/dashboard',
    judge: '/judge/dashboard',
    organizer: '/organizer/dashboard',
  }

  return <Navigate to={roleMap[user!.role]} replace />
}

// ── Router ────────────────────────────────────────────────────────────────

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
)

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: withSuspense(<LoginPage />),
  },
  {
    path: '/register',
    element: withSuspense(<RegisterPage />),
  },

  // Root redirect
  {
    path: '/',
    element: <RootRedirect />,
  },

  // Protected routes (wrapped in AppShell)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          // ── Participant routes ──────────────────────────────────────
          {
            element: <RoleGuard allowedRoles={['participant']} />,
            children: [
              {
                path: '/participant/dashboard',
                element: withSuspense(<ParticipantDashboard />),
              },
              {
                path: '/competitions',
                element: withSuspense(<CompetitionsListPage />),
              },
              {
                path: '/competitions/:id',
                element: withSuspense(<CompetitionDetailPage />),
              },
              {
                path: '/judges',
                element: withSuspense(<JudgesListPage />),
              },
              {
                path: '/judges/:id',
                element: withSuspense(<JudgeDetailPage />),
              },
              {
                path: '/feedback/new',
                element: withSuspense(<FeedbackNewPage />),
              },
              {
                path: '/feedback/requests/:id',
                element: withSuspense(<FeedbackRequestPage />),
              },
            ],
          },

          // ── Judge routes ──────────────────────────────────────────
          {
            element: <RoleGuard allowedRoles={['judge']} />,
            children: [
              {
                path: '/judge/dashboard',
                element: withSuspense(<JudgeDashboard />),
              },
              {
                path: '/judge/requests',
                element: withSuspense(<JudgeRequestsPage />),
              },
              {
                path: '/judge/requests/:id',
                element: withSuspense(<JudgeRequestDetailPage />),
              },
              {
                path: '/judge/profile',
                element: withSuspense(<JudgeProfilePage />),
              },
            ],
          },

          // ── Organizer routes ──────────────────────────────────────
          {
            element: <RoleGuard allowedRoles={['organizer']} />,
            children: [
              {
                path: '/organizer/dashboard',
                element: withSuspense(<OrganizerDashboard />),
              },
              {
                path: '/organizer/competitions/new',
                element: withSuspense(<OrganizerCompetitionNewPage />),
              },
              {
                path: '/organizer/competitions/:id',
                element: withSuspense(<OrganizerCompetitionDetailPage />),
              },
              {
                path: '/organizer/competitions/:id/participants',
                element: withSuspense(<OrganizerParticipantsPage />),
              },
            ],
          },
        ],
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
