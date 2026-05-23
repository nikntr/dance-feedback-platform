// ============================================================
// API Types — сгенерированы вручную из api.yaml (OpenAPI 3.0.3)
// Dance Feedback Platform v1.0.1
// ============================================================

// ── Shared ────────────────────────────────────────────────

export interface ApiError {
  error: string
  code: string
}

export interface ValidationError {
  error: string
  code: 'VALIDATION_ERROR'
  details: Array<{ field: string; message: string }>
}

export interface Pagination {
  page: number
  limit: number
  total: number
}

// ── Auth ──────────────────────────────────────────────────

export type UserRole = 'participant' | 'judge' | 'organizer'

export interface RegisterRequest {
  email: string
  phone: string
  password: string
  role: UserRole
  full_name: string
  bio?: string // только для судей
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UserShort {
  id: string
  email: string
  role: UserRole
  full_name: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: UserShort
}

// ── Competitions ──────────────────────────────────────────

export type CompetitionStatus = 'draft' | 'open' | 'closed' | 'finished'
export type PayoutStatus = 'pending' | 'completed' | 'failed'

export interface Competition {
  id: string
  organizer_id: string
  organizer_name?: string
  organizer_surname?: string
  title: string
  event_date: string          // date
  participant_limit?: number
  entry_fee: number
  status: CompetitionStatus
  payout_status: PayoutStatus
  created_at: string          // date-time
}

export interface CompetitionList {
  data: Competition[]
  pagination: Pagination
}

export interface CreateCompetitionRequest {
  title: string
  event_date: string          // date
  participant_limit?: number
  entry_fee: number
}

export interface UpdateCompetitionRequest {
  title?: string
  participant_limit?: number
  status?: CompetitionStatus
}

export interface CompetitionSummary {
  competition_id: string
  total_requests: number
  completed: number
  pending: number
  refunded: number
  total_captured_amount: number
  organizer_share: number
  payout_status: PayoutStatus
}

// ── Registrations ─────────────────────────────────────────

export type RegistrationPaymentStatus = 'pending' | 'paid'

export interface Registration {
  id: string
  participant_id: string
  full_name: string
  payment_status: RegistrationPaymentStatus
  registered_at: string       // date-time
}

export interface RegistrationList {
  data: Registration[]
  pagination: Pagination
}

export interface RegistrationCreated {
  registration_id: string
  payment_url: string
}

// ── Judges ────────────────────────────────────────────────

export interface JudgeProfile {
  id: string
  full_name: string
  bio?: string
  rating: number
}

export interface JudgeList {
  data: JudgeProfile[]
  pagination: Pagination
}

// ── Feedback Requests ─────────────────────────────────────

export type FeedbackRequestStatus =
  | 'awaiting_payment'
  | 'awaiting_video'
  | 'pending'
  | 'awaiting_confirmation'
  | 'completed'
  | 'refunded'

export interface CreateFeedbackRequest {
  judge_id: string
  competition_id: string
  comment: string
}

export interface FeedbackRequestCreated {
  request_id: string
  payment_url: string
  status: 'awaiting_payment'
}

export interface FeedbackRequest {
  id: string
  judge_id: string
  participant_id: string
  video_id: string | null
  comment: string | null
  price: number
  status: FeedbackRequestStatus
  created_at: string          // date-time
  deadline_at: string         // date-time
}

export interface FeedbackRequestAction {
  action: 'confirm'
}

// ── Videos ────────────────────────────────────────────────

export type VideoContentType = 'video/mp4' | 'video/quicktime'

export interface UploadUrlRequest {
  request_id: string
  filename: string
  content_type: VideoContentType
  file_size: number           // bytes
}

export interface UploadUrlResponse {
  video_id: string
  upload_url: string          // presigned PUT URL, TTL 1 hour
  expires_at: string          // date-time
}

export interface VideoConfirmRequest {
  request_id: string
  comment?: string            // max 1000 chars
}

export interface VideoConfirmResponse {
  video_id: string
  status: 'active'
  expires_at: string          // date-time — now + 1 month
  request_status: 'pending'
}

export interface VideoViewResponse {
  video_id: string
  view_url: string            // presigned GET URL, TTL 15 min
  url_expires_at: string      // date-time
  video_length?: string
}

// ── Feedback Responses ────────────────────────────────────

export interface CreateFeedbackResponse {
  request_id: string
  strengths: string           // minLength: 10
  errors: string              // minLength: 10
  recommendations: string     // minLength: 10
}

export interface FeedbackResponse {
  id: string
  request_id: string
  strengths: string
  errors: string
  recommendations: string
  submitted_at: string        // date-time
}

// ── Feedback Ratings ──────────────────────────────────────

export interface CreateFeedbackRating {
  response_id: string
  score: number               // 1–5
}

export interface FeedbackRating {
  id: string
  response_id: string
  score: number
  judge_new_rating: number
  rated_at: string            // date-time
}

// ── Payments ──────────────────────────────────────────────

export type PaymentWebhookStatus =
  | 'succeeded'
  | 'failed'
  | 'held'
  | 'captured'
  | 'released'
  | 'paid_out'
  | 'capture_failed'

export interface PaymentWebhook {
  status: PaymentWebhookStatus
  related_id: string
  hold_id?: string | null
  amount?: number
  gateway_ref?: string
}

// ── Query Params ──────────────────────────────────────────

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface CompetitionsParams extends PaginationParams {
  status?: CompetitionStatus
}
