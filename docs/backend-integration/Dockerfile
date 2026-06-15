# Шаблон multi-stage сборки Go-сервиса (Gin).
# Скопируйте в корень репозитория бэкенда и при необходимости поправьте:
#   - версию Go (строка FROM)
#   - путь к main-пакету в команде build (например ./cmd/api или .)

# ---- build stage ----
FROM golang:1.23-alpine AS build
WORKDIR /app

# Кэшируем зависимости отдельным слоем
COPY go.mod go.sum ./
RUN go mod download

COPY . .
# ⬇️ ПОПРАВЬТЕ путь к точке входа под структуру вашего проекта
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /bin/server ./cmd/api

# ---- runtime stage ----
FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata \
    && adduser -D -u 10001 appuser
WORKDIR /home/appuser

COPY --from=build /bin/server /usr/local/bin/server
# Если миграции лежат файлами и нужны в рантайме — раскомментируйте:
# COPY --from=build /app/migrations ./migrations

USER appuser
EXPOSE 8080
ENTRYPOINT ["server"]
