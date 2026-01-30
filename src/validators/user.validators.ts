import { z } from 'zod'

export const userSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required'
    })
    .min(2, { message: 'Name must have at least 2 characters' }),

  email: z
    .string({
      required_error: 'Email is required'
    })
    .email({ message: 'Invalid email format' }),

  password: z
    .string({
      required_error: 'Password is required'
    })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter'
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter'
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: 'Password must contain at least one special character'
    })
})

export type UserInput = z.infer<typeof userSchema>
