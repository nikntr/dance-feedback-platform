import type { AxiosInstance } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {
  MOCK_AUTH_RESPONSES,
  MOCK_COMPETITION_LIST,
  MOCK_COMPETITION_SUMMARY,
  MOCK_COMPETITIONS,
  MOCK_FEEDBACK_REQUESTS,
  MOCK_FEEDBACK_RESPONSE,
  MOCK_JUDGE_LIST,
  MOCK_JUDGES,
  MOCK_REGISTRATION_LIST,
} from './data'

const DELAY = 400 // ms — simulate network latency

export function setupMocks(instance: AxiosInstance) {
  const mock = new MockAdapter(instance, { delayResponse: DELAY, onNoMatch: 'passthrough' })

  // ── AUTH ──────────────────────────────────────────────────────────────

  mock.onPost('/auth/login').reply((config) => {
    const { email } = JSON.parse(config.data)
    const response = MOCK_AUTH_RESPONSES[email]
    if (response) {
      return [200, response]
    }
    return [401, { error: 'Неверный email или пароль', code: 'INVALID_CREDENTIALS' }]
  })

  mock.onPost('/auth/register').reply((config) => {
    const body = JSON.parse(config.data)
    if (MOCK_AUTH_RESPONSES[body.email]) {
      return [409, { error: 'Пользователь уже существует', code: 'EMAIL_TAKEN' }]
    }
    const newUser = {
      access_token: `mock-token-${Date.now()}`,
      refresh_token: `mock-refresh-${Date.now()}`,
      user: {
        id: `usr-${Date.now()}`,
        email: body.email,
        role: body.role,
        full_name: body.full_name,
      },
    }
    return [201, newUser]
  })

  mock.onPost('/auth/refresh').reply((config) => {
    const { refresh_token } = JSON.parse(config.data)
    if (refresh_token?.startsWith('mock-refresh-')) {
      return [200, {
        access_token: `mock-access-${Date.now()}`,
        refresh_token: `mock-refresh-${Date.now()}`,
      }]
    }
    return [401, { error: 'Refresh token недействителен', code: 'INVALID_TOKEN' }]
  })

  // ── COMPETITIONS ──────────────────────────────────────────────────────

  mock.onGet('/competitions').reply((config) => {
    const { status } = config.params ?? {}
    const filtered = status
      ? { ...MOCK_COMPETITION_LIST, data: MOCK_COMPETITION_LIST.data.filter((c) => c.status === status) }
      : MOCK_COMPETITION_LIST
    return [200, filtered]
  })

  mock.onPost('/competitions').reply((config) => {
    const body = JSON.parse(config.data)
    const newComp = {
      id: `comp-${Date.now()}`,
      organizer_id: 'usr-org-001',
      status: 'draft',
      payout_status: 'pending',
      created_at: new Date().toISOString(),
      ...body,
    }
    return [201, newComp]
  })

  mock.onGet(/\/competitions\/([^/]+)$/).reply((config) => {
    const id = config.url?.split('/').pop()
    const comp = MOCK_COMPETITIONS.find((c) => c.id === id)
    return comp ? [200, comp] : [404, { error: 'Не найдено', code: 'NOT_FOUND' }]
  })

  mock.onPatch(/\/competitions\/([^/]+)$/).reply((config) => {
    const id = config.url?.split('/').pop()
    const comp = MOCK_COMPETITIONS.find((c) => c.id === id)
    if (!comp) return [404, { error: 'Не найдено', code: 'NOT_FOUND' }]
    const body = JSON.parse(config.data)
    return [200, { ...comp, ...body }]
  })

  mock.onGet(/\/competitions\/([^/]+)\/summary/).reply(() => {
    return [200, MOCK_COMPETITION_SUMMARY]
  })

  // ── REGISTRATIONS ─────────────────────────────────────────────────────

  mock.onGet(/\/competitions\/([^/]+)\/registrations/).reply(() => {
    return [200, MOCK_REGISTRATION_LIST]
  })

  mock.onPost(/\/competitions\/([^/]+)\/registrations/).reply(() => {
    return [201, {
      registration_id: `reg-${Date.now()}`,
      payment_url: 'https://payment.mock/pay/mock-session',
    }]
  })

  // ── JUDGES ────────────────────────────────────────────────────────────

  mock.onGet('/judges').reply(() => [200, MOCK_JUDGE_LIST])

  mock.onGet(/\/judges\/([^/]+)$/).reply((config) => {
    const id = config.url?.split('/').pop()
    const judge = MOCK_JUDGES.find((j) => j.id === id)
    return judge ? [200, judge] : [404, { error: 'Не найдено', code: 'NOT_FOUND' }]
  })

  // ── FEEDBACK REQUESTS ─────────────────────────────────────────────────

  mock.onPost('/feedback/requests').reply((config) => {
    const body = JSON.parse(config.data)
    const newRequest = {
      request_id: `req-${Date.now()}`,
      payment_url: 'https://payment.mock/pay/feedback-session',
      status: 'awaiting_payment',
      ...body,
    }
    return [201, newRequest]
  })

  mock.onGet(/\/feedback\/requests\/([^/]+)$/).reply((config) => {
    const id = config.url?.split('/').pop()
    const req = MOCK_FEEDBACK_REQUESTS.find((r) => r.id === id)
    return req ? [200, req] : [404, { error: 'Не найдено', code: 'NOT_FOUND' }]
  })

  mock.onPatch(/\/feedback\/requests\/([^/]+)$/).reply((config) => {
    const id = config.url?.split('/').pop()
    const req = MOCK_FEEDBACK_REQUESTS.find((r) => r.id === id)
    if (!req) return [404, { error: 'Не найдено', code: 'NOT_FOUND' }]
    return [200, { ...req, status: 'completed' }]
  })

  // ── VIDEOS ────────────────────────────────────────────────────────────

  mock.onPost('/videos/upload-url').reply(() => {
    const videoId = `vid-${Date.now()}`
    return [200, {
      video_id: videoId,
      upload_url: `https://storage.mock/upload/${videoId}`,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    }]
  })

  mock.onPost(/\/videos\/([^/]+)\/confirm/).reply((config) => {
    const videoId = config.url?.split('/')[2]
    return [200, {
      video_id: videoId,
      status: 'active',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      request_status: 'pending',
    }]
  })

  mock.onGet(/\/videos\/([^/]+)$/).reply((config) => {
    const videoId = config.url?.split('/').pop()
    return [200, {
      video_id: videoId,
      view_url: 'https://www.w3schools.com/html/mov_bbb.mp4', // publicly available test video
      url_expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      video_length: '00:01:30',
    }]
  })

  // ── FEEDBACK RESPONSES ────────────────────────────────────────────────

  mock.onPost('/feedback/responses').reply((config) => {
    const body = JSON.parse(config.data)
    return [201, {
      id: `resp-${Date.now()}`,
      submitted_at: new Date().toISOString(),
      ...body,
    }]
  })

  mock.onGet(/\/feedback\/responses\/([^/]+)$/).reply(() => {
    return [200, MOCK_FEEDBACK_RESPONSE]
  })

  // ── FEEDBACK RATINGS ──────────────────────────────────────────────────

  mock.onPost('/feedback/ratings').reply((config) => {
    const body = JSON.parse(config.data)
    return [201, {
      id: `rating-${Date.now()}`,
      judge_new_rating: 4.8,
      rated_at: new Date().toISOString(),
      ...body,
    }]
  })
}
