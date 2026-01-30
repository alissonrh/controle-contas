import { Router } from 'express'
import { prisma } from '@/utils/lib/prisma'
import { signAccessToken } from '@/utils/jwt'
import bcrypt from 'bcrypt'

const router = Router()

router.post('/api-docs', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.redirect('/api-docs/login')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.redirect('/api-docs/login')

    const token = signAccessToken({ userId: user.id, email: user.email })

    res.cookie('accessToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 // 60 min
    })

    return res.redirect('/api-docs')
  } catch (err) {
    console.error('Erro ao autenticar login Swagger:', err)
    return res.redirect('/api-docs/login')
  }
})

export default router
