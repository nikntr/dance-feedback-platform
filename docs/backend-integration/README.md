# Интеграция фронтенда с бэкендом (Go / Gin + PostgreSQL)

Этот каталог — материалы для бэкенд-разработчика и инструкция по подключению
React-фронтенда (этот репозиторий) к реальному API.

## Содержимое

| Файл | Назначение |
| --- | --- |
| [`API_CONTRACT.md`](./API_CONTRACT.md) | Полный список эндпоинтов, которые вызывает фронт, формат JWT и **2 эндпоинта/поля, которых нет в `api.yaml` v1.0.1** |
| [`Dockerfile`](./Dockerfile) | Шаблон multi-stage сборки Go-сервиса |
| [`docker-compose.yml`](./docker-compose.yml) | Локальный запуск: API + PostgreSQL (+ Adminer) одной командой |
| [`.env.example`](./.env.example) | Переменные окружения бэкенда |
| [`cors.go`](./cors.go) | Готовый CORS-middleware для Gin |

---

## 1. Архитектура

```
[ Vercel: фронт (статика, HTTPS) ]  ──HTTPS──▶  [ Хостинг: Gin в Docker ] ──▶ [ PostgreSQL ]
   уже задеплоен                                  Render / Railway / Fly.io
```

Фронт **не** кладётся в контейнер — он живёт на Vercel. Контейнеризуется только
бэкенд (Go) и БД.

## 2. Что фронт ожидает от бэкенда

- **База путей:** все эндпоинты под префиксом **`/api/v1`**
  (например `POST /api/v1/auth/login`).
- **Порт в деве:** `8080` (фронт по умолчанию ходит на `http://localhost:8080/api/v1`).
- **Авторизация:** JWT в заголовке `Authorization: Bearer <access_token>`.
  - `POST /auth/login` и `POST /auth/register` возвращают
    `{ access_token, refresh_token, user: { id, email, role, full_name } }`.
  - `POST /auth/refresh` принимает `{ refresh_token }` и возвращает
    `{ access_token, refresh_token }`. Фронт сам дергает refresh при `401`
    (кроме самих `/auth/*`) — см. `src/api/client.ts`.
- **Формат ошибок:** `{ "error": "сообщение", "code": "MACHINE_CODE" }`
  (для 422 — с массивом `details: [{ field, message }]`).
- **Роли:** `participant` | `judge` | `organizer`.

Полный перечень и тела запросов/ответов — в [`API_CONTRACT.md`](./API_CONTRACT.md).

> ⚠️ **Два пробела в `api.yaml` v1.0.1**, которые фронт уже использует и которые
> бэкенд должен реализовать: список `GET /feedback/requests` и поле
> `FeedbackRequest.response_id`. Детали — в контракте.

## 3. CORS (обязательно)

Фронт на другом origin (Vercel-домен / `localhost:3000`), поэтому без CORS
браузер заблокирует запросы. Используйте [`cors.go`](./cors.go)
(пакет `github.com/gin-contrib/cors`). Разрешить нужно:

- **Origins:** `http://localhost:3000` (дев) и продакшн-домен Vercel
  `https://dancefeedbackplatform.vercel.app`
  (плюс, при желании, превью-деплои `https://*.vercel.app`).
- **Headers:** `Authorization`, `Content-Type`.
- **Methods:** `GET, POST, PATCH, PUT, DELETE, OPTIONS`.
- **Credentials:** не нужны — фронт шлёт Bearer-токен из `localStorage`, а не cookie.

## 4. HTTPS — критично для демо

Фронт на Vercel отдаётся по HTTPS. Браузер заблокирует запрос на `http://`
(mixed content). Поэтому в продакшне бэкенд **должен быть на HTTPS**.
Хостинги, которые собирают из `Dockerfile` и сразу дают HTTPS-домен бесплатно:
**Render**, **Railway**, **Fly.io**. Там же поднимается managed PostgreSQL.

## 5. Локальный запуск (для разработки/защиты)

```bash
# в репозитории бэкенда (куда скопированы Dockerfile / docker-compose.yml / .env.example)
cp .env.example .env          # при необходимости поправить значения
docker compose up --build
# API:      http://localhost:8080
# Adminer:  http://localhost:8081  (просмотр БД на защите)
```

## 6. Подключение фронта к бэкенду

Фронт переключается между моками и реальным API одной переменной.

**Локально** (`.env.development`):
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_USE_MOCKS=false
```

**Прод (Vercel → Project Settings → Environment Variables):**
```
VITE_API_BASE_URL=https://<ваш-бэкенд>/api/v1
VITE_USE_MOCKS=false
```

> ⚠️ В репозитории есть `.env.production` с `VITE_USE_MOCKS=true` (он держит
> текущее демо живым без бэкенда). Он **перекрывает** настройку Vercel при сборке,
> поэтому для реальной интеграции его нужно изменить на `false` (или удалить и
> задать переменные в Vercel).

> 💡 **Совет к защите.** Оставьте мок-режим как страховку: текущая мок-ссылка
> работает всегда. Реальную интеграцию покажите как основной сценарий — если
> бэкенд «уснёт»/упадёт, переключение `VITE_USE_MOCKS=true` мгновенно вернёт
> рабочее демо.
