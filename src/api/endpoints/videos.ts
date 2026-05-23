import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type {
  UploadUrlRequest,
  UploadUrlResponse,
  VideoConfirmRequest,
  VideoConfirmResponse,
  VideoViewResponse,
} from '@/api/types'

export const videoKeys = {
  view: (id: string) => ['videos', 'view', id] as const,
}

export const videosApi = {
  getUploadUrl: (data: UploadUrlRequest) =>
    apiClient.post<UploadUrlResponse>('/videos/upload-url', data).then((r) => r.data),

  confirm: (videoId: string, data: VideoConfirmRequest) =>
    apiClient.post<VideoConfirmResponse>(`/videos/${videoId}/confirm`, data).then((r) => r.data),

  getViewUrl: (videoId: string) =>
    apiClient.get<VideoViewResponse>(`/videos/${videoId}`).then((r) => r.data),

  /**
   * Upload file directly to Yandex Cloud via presigned PUT URL.
   * This call goes to Yandex, NOT through the backend.
   */
  uploadToStorage: (
    presignedUrl: string,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<void> =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', presignedUrl)
      xhr.setRequestHeader('Content-Type', file.type)

      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            onProgress(Math.round((e.loaded / e.total) * 100))
          }
        })
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`))
        }
      }
      xhr.onerror = () => reject(new Error('Network error during upload'))
      xhr.send(file)
    }),
}

// ── React Query hooks ─────────────────────────────────────────────────────

export function useVideoViewUrl(videoId: string | null) {
  return useQuery({
    queryKey: videoKeys.view(videoId ?? ''),
    queryFn: () => videosApi.getViewUrl(videoId!),
    enabled: !!videoId,
    // Presigned URL TTL = 15 min → refetch after 14 min
    staleTime: 14 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })
}

export function useGetUploadUrl() {
  return useMutation({ mutationFn: videosApi.getUploadUrl })
}

export function useConfirmVideo() {
  return useMutation({
    mutationFn: ({ videoId, data }: { videoId: string; data: VideoConfirmRequest }) =>
      videosApi.confirm(videoId, data),
  })
}
