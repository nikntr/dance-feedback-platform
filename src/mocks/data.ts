import type {
  AuthResponse,
  Competition,
  CompetitionList,
  CompetitionSummary,
  FeedbackRequest,
  FeedbackResponse,
  JudgeList,
  JudgeProfile,
  Registration,
  RegistrationList,
} from '@/api/types'

// ── Seeded mock data ──────────────────────────────────────────────────────

export const MOCK_USERS = {
  participant: {
    id: 'usr-part-001',
    email: 'participant@test.ru',
    password: 'password123',
    role: 'participant' as const,
    full_name: 'Анна Морозова',
  },
  judge: {
    id: 'usr-judge-001',
    email: 'judge@test.ru',
    password: 'password123',
    role: 'judge' as const,
    full_name: 'Дмитрий Соколов',
  },
  organizer: {
    id: 'usr-org-001',
    email: 'organizer@test.ru',
    password: 'password123',
    role: 'organizer' as const,
    full_name: 'Елена Петрова',
  },
}

export const MOCK_AUTH_RESPONSES: Record<string, AuthResponse> = {
  'participant@test.ru': {
    access_token: 'mock-access-token-participant',
    refresh_token: 'mock-refresh-token-participant',
    user: {
      id: MOCK_USERS.participant.id,
      email: MOCK_USERS.participant.email,
      role: 'participant',
      full_name: MOCK_USERS.participant.full_name,
    },
  },
  'judge@test.ru': {
    access_token: 'mock-access-token-judge',
    refresh_token: 'mock-refresh-token-judge',
    user: {
      id: MOCK_USERS.judge.id,
      email: MOCK_USERS.judge.email,
      role: 'judge',
      full_name: MOCK_USERS.judge.full_name,
    },
  },
  'organizer@test.ru': {
    access_token: 'mock-access-token-organizer',
    refresh_token: 'mock-refresh-token-organizer',
    user: {
      id: MOCK_USERS.organizer.id,
      email: MOCK_USERS.organizer.email,
      role: 'organizer',
      full_name: MOCK_USERS.organizer.full_name,
    },
  },
}

export const MOCK_COMPETITIONS: Competition[] = [
  {
    id: 'comp-001',
    organizer_id: MOCK_USERS.organizer.id,
    organizer_name: 'Елена',
    organizer_surname: 'Петрова',
    title: 'Открытый кубок Москвы 2025',
    event_date: '2025-03-15',
    participant_limit: 200,
    entry_fee: 2500,
    status: 'open',
    payout_status: 'pending',
    created_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'comp-002',
    organizer_id: MOCK_USERS.organizer.id,
    organizer_name: 'Елена',
    organizer_surname: 'Петрова',
    title: 'Чемпионат СПб — Латина',
    event_date: '2025-04-20',
    participant_limit: 150,
    entry_fee: 3000,
    status: 'draft',
    payout_status: 'pending',
    created_at: '2025-01-20T09:00:00Z',
  },
  {
    id: 'comp-003',
    organizer_id: MOCK_USERS.organizer.id,
    organizer_name: 'Елена',
    organizer_surname: 'Петрова',
    title: 'Весенний турнир 2025',
    event_date: '2025-02-01',
    participant_limit: 300,
    entry_fee: 2000,
    status: 'finished',
    payout_status: 'completed',
    created_at: '2024-12-01T12:00:00Z',
  },
]

export const MOCK_COMPETITION_LIST: CompetitionList = {
  data: MOCK_COMPETITIONS,
  pagination: { page: 1, limit: 20, total: 3 },
}

export const MOCK_JUDGES: JudgeProfile[] = [
  {
    id: MOCK_USERS.judge.id,
    full_name: 'Дмитрий Соколов',
    bio: 'Мастер спорта по латиноамериканским танцам. Судья международной категории WDSF. Опыт судейства более 15 лет.',
    rating: 4.8,
  },
  {
    id: 'judge-002',
    full_name: 'Ирина Волкова',
    bio: 'КМС по стандартным программам. Тренер высшей категории. Судья всероссийских соревнований.',
    rating: 4.6,
  },
  {
    id: 'judge-003',
    full_name: 'Александр Новиков',
    bio: 'Заслуженный тренер России. Специализация — европейские программы. Судья федерального уровня.',
    rating: 4.9,
  },
]

export const MOCK_JUDGE_LIST: JudgeList = {
  data: MOCK_JUDGES,
  pagination: { page: 1, limit: 20, total: 3 },
}

export const MOCK_FEEDBACK_REQUESTS: FeedbackRequest[] = [
  {
    id: 'req-001',
    judge_id: MOCK_USERS.judge.id,
    participant_id: MOCK_USERS.participant.id,
    video_id: 'vid-001',
    response_id: 'resp-001',
    comment: 'Хотел бы получить разбор по технике ног в самбе',
    price: 1500,
    status: 'pending',
    created_at: '2025-03-16T14:00:00Z',
    deadline_at: '2025-04-15T14:00:00Z',
  },
  {
    id: 'req-002',
    judge_id: 'judge-002',
    participant_id: MOCK_USERS.participant.id,
    video_id: null,
    response_id: null,
    comment: null,
    price: 1200,
    status: 'awaiting_video',
    created_at: '2025-03-17T10:00:00Z',
    deadline_at: '2025-04-16T10:00:00Z',
  },
  {
    id: 'req-003',
    judge_id: MOCK_USERS.judge.id,
    participant_id: 'usr-part-002',
    video_id: 'vid-002',
    response_id: null,
    comment: 'Интересует общая оценка выступления',
    price: 1500,
    status: 'pending',
    created_at: '2025-03-14T09:30:00Z',
    deadline_at: '2025-04-13T09:30:00Z',
  },
]

export const MOCK_FEEDBACK_RESPONSE: FeedbackResponse = {
  id: 'resp-001',
  request_id: 'req-001',
  strengths:
    'Отличное чувство ритма, хорошая синхронизация с партнёром. Выразительные руки и красивые линии корпуса. Уверенная подача и контакт со зрителями.',
  errors:
    'В самбе наблюдается недостаточное «боунс» — корпус движется вверх-вниз, но техника работы колен требует доработки. В пасодобле завышены плечи при кейпе.',
  recommendations:
    'Рекомендую уделить внимание изолированной работе коленного сустава в самбе — упражнение «bounce в полуприседе» 15 минут ежедневно. Для пасодобля — работа у станка с фиксацией плеч.',
  submitted_at: '2025-03-18T16:00:00Z',
}

export const MOCK_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-001',
    participant_id: MOCK_USERS.participant.id,
    full_name: 'Анна Морозова',
    payment_status: 'paid',
    registered_at: '2025-02-01T10:00:00Z',
  },
  {
    id: 'reg-002',
    participant_id: 'usr-part-002',
    full_name: 'Кирилл Белов',
    payment_status: 'paid',
    registered_at: '2025-02-03T14:00:00Z',
  },
  {
    id: 'reg-003',
    participant_id: 'usr-part-003',
    full_name: 'Мария Степанова',
    payment_status: 'pending',
    registered_at: '2025-02-10T11:30:00Z',
  },
]

export const MOCK_REGISTRATION_LIST: RegistrationList = {
  data: MOCK_REGISTRATIONS,
  pagination: { page: 1, limit: 20, total: 3 },
}

export const MOCK_COMPETITION_SUMMARY: CompetitionSummary = {
  competition_id: 'comp-001',
  total_requests: 12,
  completed: 8,
  pending: 3,
  refunded: 1,
  total_captured_amount: 12000,
  organizer_share: 1800,
  payout_status: 'pending',
}
