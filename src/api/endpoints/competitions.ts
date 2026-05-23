import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type {
  Competition,
  CompetitionList,
  CompetitionSummary,
  CompetitionsParams,
  CreateCompetitionRequest,
  RegistrationCreated,
  RegistrationList,
  UpdateCompetitionRequest,
} from '@/api/types'

// ── Query keys ────────────────────────────────────────────────────────────

export const competitionKeys = {
  all: ['competitions'] as const,
  list: (params?: CompetitionsParams) => [...competitionKeys.all, 'list', params] as const,
  detail: (id: string) => [...competitionKeys.all, 'detail', id] as const,
  summary: (id: string) => [...competitionKeys.all, 'summary', id] as const,
  registrations: (id: string) => [...competitionKeys.all, 'registrations', id] as const,
}

// ── Raw API calls ─────────────────────────────────────────────────────────

export const competitionsApi = {
  list: (params?: CompetitionsParams) =>
    apiClient.get<CompetitionList>('/competitions', { params }).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Competition>(`/competitions/${id}`).then((r) => r.data),

  create: (data: CreateCompetitionRequest) =>
    apiClient.post<Competition>('/competitions', data).then((r) => r.data),

  update: (id: string, data: UpdateCompetitionRequest) =>
    apiClient.patch<Competition>(`/competitions/${id}`, data).then((r) => r.data),

  summary: (id: string) =>
    apiClient.get<CompetitionSummary>(`/competitions/${id}/summary`).then((r) => r.data),

  getRegistrations: (id: string) =>
    apiClient.get<RegistrationList>(`/competitions/${id}/registrations`).then((r) => r.data),

  register: (id: string) =>
    apiClient.post<RegistrationCreated>(`/competitions/${id}/registrations`).then((r) => r.data),
}

// ── React Query hooks ─────────────────────────────────────────────────────

export function useCompetitions(params?: CompetitionsParams) {
  return useQuery({
    queryKey: competitionKeys.list(params),
    queryFn: () => competitionsApi.list(params),
  })
}

export function useCompetition(id: string) {
  return useQuery({
    queryKey: competitionKeys.detail(id),
    queryFn: () => competitionsApi.get(id),
    enabled: !!id,
  })
}

export function useCompetitionSummary(id: string) {
  return useQuery({
    queryKey: competitionKeys.summary(id),
    queryFn: () => competitionsApi.summary(id),
    enabled: !!id,
  })
}

export function useCompetitionRegistrations(id: string) {
  return useQuery({
    queryKey: competitionKeys.registrations(id),
    queryFn: () => competitionsApi.getRegistrations(id),
    enabled: !!id,
  })
}

export function useCreateCompetition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: competitionsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: competitionKeys.all }),
  })
}

export function useUpdateCompetition(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateCompetitionRequest) => competitionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: competitionKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: competitionKeys.all })
    },
  })
}

export function useRegisterForCompetition(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => competitionsApi.register(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: competitionKeys.registrations(id) }),
  })
}
