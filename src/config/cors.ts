import cors, { CorsOptions } from 'cors'

export function getCorsMiddleware() {
  if (process.env.NODE_ENV !== 'development') {
    return (req: any, res: any, next: any) => next() // CORS desativado fora do dev
  }

  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://0.0.0.0:3000'
  ]

  const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        console.warn('❌ CORS bloqueado para origem:', origin)
        callback(new Error('Blocked by CORS policy'))
      }
    },
    credentials: true
  }

  return cors(corsOptions)
}
