import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type {
  CreateFeedbackRating,
  CreateFeedbackRequest,
  CreateFeedbackResponse,
  FeedbackRating,
  FeedbackRequest,
  FeedbackRequestAction,
  FeedbackRequestCreated,
  FeedbackResponse,
} from '@/api/types'

// ── Query keys ────────────────────────────────────────────────────────────

export const feedbackKeys = {
  requests: ['feedback', 'requests'] as const,
  request: (id: string) => ['feedback', 'requests', id] as const,
  responses: ['feedback', 'responses'] as const,
  response: (id: string) => ['feedback', 'responses', id] as const,
}

// ── Raw API calls ─────────────────────────────────────────────────────────

export const feedbackApi = {
  // Requests
  createRequest: (data: CreateFeedbackRequest) =>
    apiClient.post<FeedbackRequestCreated>('/feedback/requests', data).then((r) => r.data),

  getRequest: (id: string) =>
    apiClient.get<FeedbackRequest>(`/feedback/requests/${id}`).then((r) => r.data),

  actionRequest: (id: string, action: FeedbackRequestAction) =>
    apiClient.patch<FeedbackRequest>(`/feedback/requests/${id}`, action).then((r) => r.data),

  // Responses
  createResponse: (data: CreateFeedbackResponse) =>
    apiClient.post<FeedbackResponse>('/feedback/responses', data).then((r) => r.data),

  getResponse: (id: string) =>
    apiClient.get<FeedbackResponse>(`/feedback/responses/${id}`).then((r) => r.data),

  // Ratings
  createRating: (data: CreateFeedbackRating) =>
    apiClient.post<FeedbackRating>('/feedback/ratings', data).then((r) => r.data),
}

// ── React Query hooks ─────────────────────────────────────────────────────

export function useFeedbackRequest(id: string) {
  return useQuery({
    queryKey: feedbackKeys.request(id),
    queryFn: () => feedbackApi.getRequest(id),
    enabled: !!id,
    // Poll every 15s when status is not terminal
    refetchInterval: (query) => {
      const status = query.state.data?.status
      const terminalStatuses = ['completed', 'refunded']
      return status && !terminalStatuses.includes(status) ? 15_000 : false
    },
  })
}

export function useCreateFeedbackRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: feedbackApi.createRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feedbackKeys.requests }),
  })
}

export function useConfirmFeedback(requestId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => feedbackApi.actionRequest(requestId, { action: 'confirm' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feedbackKeys.request(requestId) }),
  })
}

export function useFeedbackResponse(id: string) {
  return useQuery({
    queryKey: feedbackKeys.response(id),
    queryFn: () => feedbackApi.getResponse(id),
    enabled: !!id,
  })
}

export function useCreateFeedbackResponse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: feedbackApi.createResponse,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.request(variables.request_id) })
    },
  })
}

export function useCreateFeedbackRating() {
  return useMutation({
    mutationFn: feedbackApi.createRating,
  })
}
