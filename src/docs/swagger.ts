// src/docs/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Controle de Contas API',
      version: '1.0.0',
      description:
        'Documentação da API para gerenciamento de dívidas e finanças pessoais'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts']
})
