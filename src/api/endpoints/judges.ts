import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { JudgeList, JudgeProfile, PaginationParams } from '@/api/types'

export const judgeKeys = {
  all: ['judges'] as const,
  list: (params?: PaginationParams) => [...judgeKeys.all, 'list', params] as const,
  detail: (id: string) => [...judgeKeys.all, 'detail', id] as const,
}

export const judgesApi = {
  list: (params?: PaginationParams) =>
    apiClient.get<JudgeList>('/judges', { params }).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<JudgeProfile>(`/judges/${id}`).then((r) => r.data),
}

export function useJudges(params?: PaginationParams) {
  return useQuery({
    queryKey: judgeKeys.list(params),
    queryFn: () => judgesApi.list(params),
  })
}

export function useJudge(id: string) {
  return useQuery({
    queryKey: judgeKeys.detail(id),
    queryFn: () => judgesApi.get(id),
    enabled: !!id,
  })
}
