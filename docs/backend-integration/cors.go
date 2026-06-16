// Пример настройки CORS для Gin под этот фронтенд.
// Зависимость: go get github.com/gin-contrib/cors
//
// Использование:
//   r := gin.Default()
//   SetupCORS(r, strings.Split(os.Getenv("CORS_ALLOWED_ORIGINS"), ","))
//   // ... регистрация маршрутов под группой /api/v1

package main

import (
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// SetupCORS подключает CORS-middleware с белым списком origin-ов.
func SetupCORS(r *gin.Engine, allowedOrigins []string) {
	r.Use(cors.New(cors.Config{
		AllowOrigins: allowedOrigins, // напр. ["http://localhost:3000", "https://dancefeedbackplatform.vercel.app"]
		AllowMethods: []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders: []string{"Content-Length"},
		// Фронт использует Bearer-токен из localStorage, а не cookie — credentials не нужны.
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))
}

// Вариант с поддержкой превью-деплоев Vercel (*.vercel.app).
// Используйте ВМЕСТО AllowOrigins, если нужно пускать любые превью-ссылки.
func SetupCORSWithVercelPreviews(r *gin.Engine, extraOrigins []string) {
	allowed := map[string]bool{}
	for _, o := range extraOrigins {
		allowed[o] = true
	}
	r.Use(cors.New(cors.Config{
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
		AllowOriginFunc: func(origin string) bool {
			if allowed[origin] {
				return true
			}
			// любой поддомен *.vercel.app
			return strings.HasSuffix(origin, ".vercel.app")
		},
	}))
}
