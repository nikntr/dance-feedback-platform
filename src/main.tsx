import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'

import { router } from './router'
import './index.css'

// ── QueryClient config ────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // 30 секунд до устаревания
      gcTime: 5 * 60 * 1000,   // 5 минут в кэше
      retry: (failureCount, error: unknown) => {
        // Не retry на 401, 403, 404
        const status = (error as { response?: { status?: number } })?.response?.status
        if (status && [401, 403, 404].includes(status)) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

// ── Render ────────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        gutter={8}
        containerStyle={{ bottom: 24, right: 24 }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#161D2E',
            color: '#EEF2F9',
            border: '1px solid #243044',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'Onest, sans-serif',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#161D2E' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#161D2E' },
          },
        }}
      />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>,
)
