import Joi from 'joi'

export const userSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8) // mínimo de 8 caracteres
    .pattern(new RegExp('[A-Z]')) // pelo menos uma maiúscula
    .pattern(new RegExp('[a-z]')) // pelo menos uma minúscula
    .pattern(new RegExp('[0-9]')) // pelo menos um número
    .pattern(new RegExp('[!@#$%^&*(),.?":{}|<>]')) // pelo menos um símbolo
    .required()
})
