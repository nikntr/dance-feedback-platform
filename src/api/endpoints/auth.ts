import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, tokenStorage } from '@/api/client'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/api/types'
import { useAuthStore } from '@/store/auth.store'

// ── Raw API calls ─────────────────────────────────────────────────────────

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  refresh: (refresh_token: string) =>
    apiClient.post<AuthResponse>('/auth/refresh', { refresh_token }).then((r) => r.data),
}

// ── React Query hooks ─────────────────────────────────────────────────────

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      tokenStorage.set(data.access_token, data.refresh_token)
      setUser(data.user)
      queryClient.clear()
    },
  })
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      tokenStorage.set(data.access_token, data.refresh_token)
      setUser(data.user)
    },
  })
}
