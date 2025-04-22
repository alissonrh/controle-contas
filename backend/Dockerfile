# Etapa 1: build da aplicação com Node
FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /personal-finance-app

# Copia os arquivos necessários
COPY package.json package-lock.json* ./
COPY tsconfig.json ./

# Instala dependências
RUN apk add --no-cache git
RUN npm install

# Copia o restante do projeto
COPY . .

# Expõe a porta da API
EXPOSE 3000