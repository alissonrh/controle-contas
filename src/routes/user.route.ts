import { Router } from 'express'
import { getMe, loginUser, registerUser } from '../controllers/user.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', authenticateToken, getMe)

export default router
