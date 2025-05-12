import express from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import userRoutes from './routes/user.route'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger'

import morgan from 'morgan'
import { router } from './routes'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

app.use(express.json())
app.use(morgan('dev'))

app.use('/api', router)
app.use('/api/users', userRoutes)

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
  console.log('📚 Documentação Swagger: http://localhost:3000/api-docs')
})
