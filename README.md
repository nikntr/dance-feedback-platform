# Dance Feedback Platform — Frontend

Платформа обратной связи для танцевальных соревнований.

## Стек

| Инструмент | Назначение |
|------------|-----------|
| **Vite + React 18 + TypeScript** | Основа проекта |
| **React Router v6** | Клиентский роутинг |
| **TanStack Query v5** | Серверный стейт, кэширование |
| **Zustand** | Клиентский стейт (авторизация) |
| **Axios** | HTTP-клиент с interceptors |
| **React Hook Form + Zod** | Формы и валидация |
| **Tailwind CSS** | Стилизация |
| **axios-mock-adapter** | Моки API |
| **react-hot-toast** | Уведомления |
| **lucide-react** | Иконки |

## Тестовые аккаунты (мок-режим)

| Роль | Email | Пароль |
|------|-------|--------|
| Участник | `participant@test.ru` | `password123` |
| Судья | `judge@test.ru` | `password123` |
| Организатор | `organizer@test.ru` | `password123` |

## Структура проекта

```
src/
├── api/
│   ├── client.ts          # Axios + interceptors + mock setup
│   ├── types.ts           # Все типы из OpenAPI spec
│   └── endpoints/         # Хуки React Query по эндпоинтам
│       ├── auth.ts
│       ├── competitions.ts
│       ├── judges.ts
│       ├── feedback.ts
│       └── videos.ts
├── store/
│   └── auth.store.ts      # Zustand: авторизация
├── router/
│   ├── index.tsx          # Все маршруты
│   └── ProtectedRoute.tsx # Защита маршрутов + RoleGuard
├── components/ui/         # Базовые UI-компоненты
├── shared/                # Общие компоненты (AppShell, Sidebar...)
├── features/              # Страницы по ролям
│   ├── auth/
│   ├── participant/
│   ├── judge/
│   └── organizer/
└── mocks/                 # Mock данные и handlers
    ├── data.ts
    └── handlers.ts
```

## Дизайн-система

**Цвета:** Тёмная тема с amber/gold акцентом (#E8900A)  
**Шрифты:** Unbounded (заголовки) + Onest (текст)  
**Компоненты:** Button, Input, Card, Badge, StatusBadge
```
