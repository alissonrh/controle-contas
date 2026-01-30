# Etapa 1: build da aplicação com Node
FROM node:20-alpine
# Instala dependências do sistema.

RUN apk add --no-cache git openssh
# Diretório de trabalho dentro do container
WORKDIR /workspaces/personal-finance-app

# Copia os arquivos necessários
COPY package.json package-lock.json* ./
COPY tsconfig.json ./
COPY prisma ./prisma

# Instala dependências
RUN npm install
RUN npx prisma generate

# Copia o restante do projeto
COPY . .

# Expõe a porta da API
EXPOSE 3001