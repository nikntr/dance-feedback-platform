import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserShort } from '@/api/types'
import { tokenStorage } from '@/api/client'

interface AuthState {
  user: UserShort | null
  isAuthenticated: boolean

  setUser: (user: UserShort) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      logout: () => {
        tokenStorage.clear()
        set({ user: null, isAuthenticated: false })
        window.location.href = '/login'
      },
    }),
    {
      name: 'dfp-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
