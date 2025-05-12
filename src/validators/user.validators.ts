import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha muito curta (mínimo 8)')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'A senha deve conter pelo menos um símbolo'
    )
})
