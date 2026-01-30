import { Router } from 'express'
import { refreshTokenHandler } from '../controllers/auth.controller'

const router = Router()

router.post('/refresh-token', refreshTokenHandler)

export default router
