import { create } from 'zustand'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'dfp-theme'

/** Read the persisted theme, falling back to the OS preference, then dark. */
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Apply the theme class to <html> and keep the native color-scheme in sync. */
function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  root.style.colorScheme = theme
  // Update the browser UI color (mobile address bar)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#080C14' : '#F5F7FA')
}

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),

  setTheme: (theme) => {
    window.localStorage.setItem(STORAGE_KEY, theme)
    applyTheme(theme)
    set({ theme })
  },

  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
    get().setTheme(next)
  },
}))

/** Call once on app start to sync the DOM with the resolved initial theme. */
export function initTheme() {
  applyTheme(useThemeStore.getState().theme)
}
