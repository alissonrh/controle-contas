import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { authenticateToken } from '../middleware/auth.middleware'

const router = Router()
const userController = new UserController()

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/me', authenticateToken, userController.getMe)

export default router
