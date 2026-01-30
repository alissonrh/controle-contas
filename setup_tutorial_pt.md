# Tutorial de Setup Inicial para Projetos Node.js

Este guia passo a passo foi inspirado na estrutura do repositório `controle-contas` e tem como objetivo ajudar desenvolvedores a iniciarem um novo projeto Node.js seguindo boas práticas de segurança e organização. A sequência a seguir aborda desde a configuração do ambiente até considerações de deploy futuro.

## 1. Inicialização do projeto

1. Instale o Node.js (recomendado LTS) e o Docker com Docker Compose.
2. Crie uma pasta para o projeto e inicialize um `package.json`:
   ```bash
   mkdir meu-projeto && cd meu-projeto
   npm init -y
   ```
3. Instale as dependências básicas:
   ```bash
   npm install express cors helmet morgan cookie-parser jsonwebtoken zod dotenv
   npm install bcrypt @prisma/client swagger-ui-express yamljs --save
   npm install -D typescript ts-node-dev prisma @types/express @types/node @types/jsonwebtoken @types/cors @types/morgan @types/cookie-parser jest ts-jest @types/jest eslint prettier
   ```
4. Crie um `tsconfig.json` semelhante ao usado em `controle-contas` para compilar TypeScript para a pasta `dist`.

## 2. Estrutura de Pastas Sugerida

Organize o código em camadas, separando responsabilidades:

```
src/
├─ controllers/
├─ service/
├─ routes/
├─ middleware/
├─ validators/
├─ utils/
└─ index.ts
```

```
mkdir -p src/{controllers,service,routes,middleware,validators,utils} && touch src/index.ts
```

Essa divisão facilita a manutenção e a escalabilidade do projeto.

## 3. Configuração do Express e Middlewares

No arquivo `src/index.ts`:

```ts
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { getCorsMiddleware } from './config/cors'

dotenv.config()
const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cookieParser())
app.use(getCorsMiddleware())
```

O uso de Helmet e CORS personalizados ajuda a proteger a API, como visto em `src/config/cors.ts` do repositório de referência.

## 4. TypeScript

Adote o TypeScript para maior segurança na tipagem. Um `tsconfig.json` simples pode conter:

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

Utilize `ts-node-dev` para reiniciar a aplicação automaticamente em modo de desenvolvimento.

## 5. Docker e Dev Container

Crie um `Dockerfile` e um `docker-compose.yml` para isolar o ambiente. O `docker-compose.yml` deve subir o PostgreSQL e a aplicação Node.js, seguindo o exemplo:

```yaml
services:
  postgres:
    image: postgres:16
    restart: always
    env_file:
      - .env
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: .
    depends_on:
      - postgres
    ports:
      - '3000:3000'
    env_file:
      - .env
    environment:
      DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    volumes:
      - .:/workspaces/app
    command: tail -f /dev/null

volumes:
  pgdata:
```

Para usuários do VS Code, adicione uma pasta `.devcontainer` com um `devcontainer.json` que aponte para o serviço `backend`. Isso permite abrir o projeto em um contêiner de desenvolvimento pronto para uso.

## 6. Prisma e PostgreSQL

1. Execute `npx prisma init` para gerar o diretório `prisma/` e o arquivo `schema.prisma`.
2. Defina o modelo de dados no `schema.prisma` (veja exemplo em `prisma/schema.prisma`).
3. Rode `npx prisma generate` para criar o cliente.
4. Crie migrações e seeds com `npx prisma migrate dev` e scripts em `prisma/seed.ts`.

## 7. Validação com Zod e Tratamento de Erros

Utilize Zod para validar entradas, como em `src/validators/user.validators.ts`:

```ts
import { z } from 'zod'
export const userSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8)
})
```

Crie um `handleError` central para capturar erros de validação e erros personalizados:

```ts
import { Response } from 'express'
import { ZodError } from 'zod'
import { BaseError } from './class/baseError'

export const handleError = (res: Response, error: unknown) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: 'VALIDATION_ERROR' })
  }
  if (error instanceof BaseError) {
    return res.status(error.status).json({ error: error.message })
  }
  return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' })
}
```

## 8. Autenticação com JWT

Implemente autenticação em duas etapas: access token de curta duração e refresh token em cookie `HttpOnly`. No repositório de referência, a função `signAccessToken` foi usada para gerar tokens com o pacote `jsonwebtoken`.

```ts
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET!
export function signAccessToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}
```

Crie um endpoint para refresh token, definindo o novo access token no cookie, conforme `src/controllers/auth.controller.ts`.

## 9. Organização em Camadas

- **Controller:** lida com a requisição HTTP e chama o serviço correspondente.
- **Service:** regras de negócio e acesso ao banco via Prisma.
- **Interface/Types:** definições de tipos e contratos.

Esse padrão mantém a aplicação organizada e facilita testes unitários.

## 10. Checklist de Segurança

Incorpore práticas do `checklist_seguranca_nodejs.md` do projeto:

- Validação de dados com Zod.
- Uso de Helmet e CORS configurado.
- Hash de senha com bcrypt.
- Controle de dependências com `npm audit`.
- Uso de HTTPS em produção com redirecionamento para HTTPS.

## 11. Considerações para Deploy Futuro

1. **Homologação e Produção:** utilize variáveis de ambiente diferentes e configure serviços (banco, aplicação) em servidores ou provedores de nuvem.
2. **HTTPS com Nginx:** configure um proxy reverso com Nginx e obtenha certificados (Let's Encrypt) para servir a API em HTTPS, redirecionando todo o tráfego HTTP para HTTPS.
3. **CI/CD:** considere pipelines para rodar testes, lint e deploy automático.

## 12. Próximos Passos

- Adicione testes com Jest (`npm run test`).
- Configure ESLint e Prettier para padronizar o código.
- Monitore a aplicação e registre logs de forma segura.

Siga este guia como ponto de partida para novos projetos Node.js que buscam segurança e organização desde o início. Boa codificação!
