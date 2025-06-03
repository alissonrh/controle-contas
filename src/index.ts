import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
dotenv.config()

import { getCorsMiddleware } from './config/cors'
import userRoutes from './routes/user.route'
import debtSourceRoutes from './routes/debtSource.routes'
import refreshToken from './routes/auth.routes'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(getCorsMiddleware())
app.use(
  helmet({
    contentSecurityPolicy: false
  })
)
app.use(cookieParser())
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://0.0.0.0:3000',
      'http://localhost:5173'
    ],
    credentials: true
  })
)

app.use('/api/users', userRoutes)
app.use('/api/debt-sources', debtSourceRoutes)
app.use('/api', refreshToken)

// Swagger
const swaggerDocument = YAML.load('src/utils/docs/swagger.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000')
  console.log('📚 Documentação Swagger: http://localhost:3000/api-docs')
})
