import cors from 'cors'

const devOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://0.0.0.0:3000',
  'http://localhost:5173'
]

const prodOrigins = ['https://app.controlecontas.com.br']

const allowedOrigins =
  process.env.NODE_ENV === 'production' ? prodOrigins : devOrigins

export const getCorsMiddleware = () =>
  cors({
    origin: (origin, callback) => {
      const isDev = process.env.NODE_ENV !== 'production'
      const isWhitelisted = origin && allowedOrigins.includes(origin)
      const isSwaggerOrBrowser = isDev && origin === undefined

      if (isWhitelisted || isSwaggerOrBrowser) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
  })
