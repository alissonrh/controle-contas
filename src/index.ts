import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
dotenv.config()

import { getCorsMiddleware } from './config/cors'
import userRoutes from './routes/user.route'
import debtSourceRoutes from './routes/debtSource.routes'
import refreshToken from './routes/auth.routes'
import debtRouutes from './routes/debt.routes'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(
  helmet({
    contentSecurityPolicy: false
  })
)
app.use(cookieParser())
app.use(getCorsMiddleware())
app.use((req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production'
  const isHttp = req.headers['x-forwarded-proto'] === 'http'

  if (isProd && isHttp) {
    const httpsUrl = `https://${req.headers.host}${req.url}`
    return res.redirect(301, httpsUrl)
  }

  next()
})

// Routes

app.use('/api/users', userRoutes)
app.use('/api/debt-sources', debtSourceRoutes)
app.use('/api/debt', debtRouutes)
app.use('/api', refreshToken)

// Swagger

app.use(express.static(path.join(__dirname, 'utils', 'public')))

app.get('/api-docs/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'utils', 'public', 'swagger-login.html'))
})

const swaggerDocument = YAML.load('src/utils/docs/swagger.yaml')
app.use(
  '/api-docs',
  (
    req: { cookies: { accessToken: unknown } },
    res: { redirect: (arg0: string) => unknown },
    next: () => unknown
  ) => (req.cookies.accessToken ? next() : res.redirect('/api-docs/login')),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      withCredentials: true,
      requestInterceptor: (req: { credentials: string }) => {
        req.credentials = 'include'
        return req
      }
    }
  })
)

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000')
  console.log('📚 Documentação Swagger: http://localhost:3000/api-docs')
})
