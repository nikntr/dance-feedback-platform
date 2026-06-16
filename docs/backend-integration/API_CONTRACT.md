# Контракт API (что вызывает фронтенд)

Всё под префиксом **`/api/v1`**. Источник истины по схемам — `api.yaml` v1.0.1;
ниже — практический срез того, что реально дёргает фронт, плюс **расхождения**,
которые нужно реализовать на бэке.

## Аутентификация

| Метод | Путь | Тело запроса | Ответ |
| --- | --- | --- | --- |
| POST | `/auth/register` | `{ email, phone, password, role, full_name, bio? }` | `201` `AuthResponse` |
| POST | `/auth/login` | `{ email, password }` | `200` `AuthResponse` |
| POST | `/auth/refresh` | `{ refresh_token }` | `200` `{ access_token, refresh_token }` |

```jsonc
// AuthResponse
{
  "access_token": "jwt...",
  "refresh_token": "jwt...",
  "user": { "id": "usr-1", "email": "a@b.ru", "role": "participant", "full_name": "Анна Морозова" }
}
```

- `role`: `participant` | `judge` | `organizer`.
- Все защищённые эндпоинты требуют `Authorization: Bearer <access_token>`.
- При `401` (кроме `/auth/*`) фронт автоматически зовёт `/auth/refresh` и повторяет запрос.

## Соревнования

| Метод | Путь | Примечание |
| --- | --- | --- |
| GET | `/competitions?status=&page=&limit=` | список `{ data: Competition[], pagination }` |
| POST | `/competitions` | `CreateCompetitionRequest` → `Competition` |
| GET | `/competitions/{id}` | `Competition` |
| PATCH | `/competitions/{id}` | `{ title?, participant_limit?, status? }` → `Competition` |
| GET | `/competitions/{id}/summary` | `CompetitionSummary` |
| GET | `/competitions/{id}/registrations` | `{ data: Registration[], pagination }` |
| POST | `/competitions/{id}/registrations` | → `{ registration_id, payment_url }` |

## Судьи

| Метод | Путь | Ответ |
| --- | --- | --- |
| GET | `/judges?page=&limit=` | `{ data: JudgeProfile[], pagination }` |
| GET | `/judges/{id}` | `JudgeProfile` |

## Видео (presigned upload в объектное хранилище)

| Метод | Путь | Ответ |
| --- | --- | --- |
| POST | `/videos/upload-url` | `{ video_id, upload_url, expires_at }` |
| POST | `/videos/{id}/confirm` | `{ video_id, status, expires_at, request_status }` |
| GET | `/videos/{id}` | `{ video_id, view_url, url_expires_at, video_length? }` |

## Запросы / отзывы / оценки ОС

| Метод | Путь | Примечание |
| --- | --- | --- |
| POST | `/feedback/requests` | `{ judge_id, competition_id, comment }` → `{ request_id, payment_url, status }` |
| **GET** | **`/feedback/requests`** | **➕ НЕТ в api.yaml — нужно добавить (см. ниже)** |
| GET | `/feedback/requests/{id}` | `FeedbackRequest` |
| PATCH | `/feedback/requests/{id}` | `{ action: "confirm" }` → `FeedbackRequest` |
| POST | `/feedback/responses` | `{ request_id, strengths, errors, recommendations }` → `FeedbackResponse` |
| GET | `/feedback/responses/{id}` | `FeedbackResponse` |
| POST | `/feedback/ratings` | `{ response_id, score }` → `FeedbackRating` |

---

# ➕ Расхождения с `api.yaml` v1.0.1 (реализовать на бэке)

## 1. `GET /feedback/requests` — список запросов ОС

Нужен для дашбордов: «Мои запросы» участника и входящие запросы судьи.
В контракте сейчас только `POST` и операции по `{id}`.

**Запрос:**
```
GET /api/v1/feedback/requests?participant_id=&judge_id=&status=&page=&limit=
Authorization: Bearer <token>
```
- Query-параметры `participant_id` / `judge_id` / `status` — фильтры; пагинация `page` / `limit`.
- ⚠️ **Авторизация:** результат ДОЛЖЕН ограничиваться текущим пользователем из JWT.
  Параметры фильтра — намерение клиента, а не замена проверки прав
  (участник видит только свои запросы, судья — только назначенные ему).

**Ответ `200`:**
```jsonc
{
  "data": [ /* FeedbackRequest[] */ ],
  "pagination": { "page": 1, "limit": 20, "total": 2 }
}
```

## 2. Поле `response_id` в `FeedbackRequest`

У участника нет способа узнать id готового отзыва: `GET /feedback/responses/{id}`
принимает только id ответа, а в `FeedbackRequest` ссылки на него нет.
Добавьте поле по аналогии с `video_id`:

```jsonc
// FeedbackRequest
{
  "id": "req-001",
  "judge_id": "usr-judge-001",
  "participant_id": "usr-part-001",
  "video_id": "vid-001",        // уже есть
  "response_id": "resp-001",    // ➕ ДОБАВИТЬ: null, пока отзыв не готов
  "comment": "…",
  "price": 1500,
  "status": "pending",
  "created_at": "2025-03-16T14:00:00Z",
  "deadline_at": "2025-04-15T14:00:00Z"
}
```

## 3. Агрегатные статы организатора (опционально)

Дашборд организатора показывает «всего участников по всем турнирам» и
«суммарную выплату». Отдельного эндпоинта под это нет — сейчас фронт считает
производные значения из списка соревнований. Если нужны точные агрегаты —
потребуется отдельный эндпоинт (например `GET /organizer/summary`). Не блокирует.
