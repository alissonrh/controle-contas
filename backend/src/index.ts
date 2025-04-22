import express from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

import morgan from 'morgan'
import { router } from './routes'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

app.use(express.json())
app.use(morgan('dev'))

app.use('/api', router)

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
