import express from 'express'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import morgan from 'morgan'
dotenv.config()

import { getCorsMiddleware } from './config/cors'
import { router } from './routes'
import userRoutes from './routes/user.route'
import debtSourceRoutes from './routes/debtSource.routes'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(getCorsMiddleware())

app.use('/api', router)
app.use('/api/users', userRoutes)
app.use('/api/debt-sources', debtSourceRoutes)

// Swagger
const swaggerDocument = YAML.load('src/utils/docs/swagger.yaml')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
  console.log('📚 Documentação Swagger: http://localhost:3000/api-docs')
})
