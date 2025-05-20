# 💰 Controle de Contas

API REST para gerenciamento de finanças pessoais. Com ela, você pode cadastrar fontes de dívida (como cartão de crédito, bancos, empréstimos), registrar dívidas e organizar as parcelas. Ideal para quem quer ter controle total dos seus compromissos financeiros.

## 🚀 Tecnologias usadas

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Docker + Docker Compose
- JWT para autenticação
- Dev Container para ambiente de desenvolvimento

## 🛠️ Como rodar o projeto

### Pré-requisitos

- Node.js
- Docker + Docker Compose
- VS Code com extensão "Dev Containers" (opcional, mas recomendado)

### Passo a passo

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/controle-contas.git
cd controle-contas
```

## 🛠️ Como rodar o projeto

### 1. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`.

### 2. Suba os containers com Docker

```bash
docker-compose up -d
```

### 3. (Opcional) Abra no VS Code com Dev Container

Se estiver usando o VS Code com a extensão **Dev Containers**, clique em **"Reopen in Container"** para rodar o projeto em um ambiente isolado, com todas as dependências já configuradas.

### 4. Rode as migrações e os seeds

```bash
npm run db:migrate
npm run db:seed
```

### 5. Inicie o servidor

```bash
npm run dev
```

A API estará disponível em: [http://localhost:3000](http://localhost:3000)

A documentação da API (Swagger) pode ser acessada em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## ✅ Funcionalidades

- [x] Cadastro de usuários
- [x] Login com autenticação JWT
- [x] CRUD de fontes de dívida
- [x] CRUD de dívidas e parcelas
- [x] Proteção de rotas por usuário autenticado
- [x] Documentação da API com Swagger
