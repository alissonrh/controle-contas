# Checklist de Segurança para Projetos Node.js

## 1. Validação e Sanitização
- [ ] Use bibliotecas como **Zod** ou **Joi** para validar inputs.
- [ ] Sempre **sanitize entradas** para evitar XSS e injeção de comandos.
- [ ] Nunca confie em dados vindos do cliente (mesmo IDs e flags booleanas).

## 2. Autenticação e Autorização
- [ ] Use **JWT com expiração curta** e renove com refresh tokens.
- [ ] Armazene senhas **com bcrypt (hash + salt)** — nunca salve em texto puro.
- [ ] Proteja rotas com middleware de autenticação.
- [ ] Nunca exponha dados de outros usuários — sempre filtre por `userId`.

## 3. Segurança na Configuração
- [ ] Use **Helmet.js** para configurar headers HTTP de segurança.
- [ ] Configure **CORS com origem específica** — nunca use `'*'` em produção.
- [ ] Desative **stack traces em produção** (evite `res.send(err)`).
- [ ] Use variáveis de ambiente seguras (`process.env`) com `.env`.

## 4. Gerenciamento de Dependências
- [ ] Use `npm audit` ou `yarn audit` com frequência para achar vulnerabilidades.
- [ ] Prefira pacotes populares, mantidos e com código aberto.
- [ ] Use ferramentas como **Snyk** para monitorar segurança contínua.
- [ ] Evite pacotes desnecessários (menos dependência = menos ataque).

## 5. Banco de Dados
- [ ] Use **ORMs seguros** como Prisma ou Sequelize para evitar SQL Injection.
- [ ] Nunca inclua diretamente queries baseadas em inputs do usuário.
- [ ] Limite os dados retornados em queries (`select` específico, nada de `SELECT *`).
- [ ] Faça validação e controle de permissões **dentro do service layer**.

## 6. Logging e Monitoramento
- [ ] Use ferramentas como **Morgan** com cuidado — **nunca logue tokens ou senhas**.
- [ ] Monitore erros com ferramentas como **Sentry** ou **LogRocket (backend)**.
- [ ] Tenha logs de autenticação, erros críticos e atividades suspeitas.

## 7. HTTPS e Produção
- [ ] Use HTTPS sempre (pode usar um proxy como Nginx + Certbot).
- [ ] Redirecione requisições HTTP para HTTPS.
- [ ] Remova **rotas de teste, console logs e endpoints de debug** antes de ir pra prod.

## 8. Proteção contra ataques
- [ ] Use **rate limiting** (`express-rate-limit`) para evitar brute force/DDoS.
- [ ] Use **express-mongo-sanitize** (se usar MongoDB) ou evite operadores perigosos.
- [ ] Implemente **Content Security Policy (CSP)** se servir HTML.
- [ ] Defina um `limit` para tamanho de payloads (ex: `express.json({ limit: '1mb' })`).
