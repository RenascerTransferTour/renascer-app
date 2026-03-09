# 1. Instalação de dependências
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

# 2. Build da aplicação
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 3. Imagem final de produção
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Adiciona um usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Cria o diretório para os dados e atribui permissão ao usuário não-root
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Copia os arquivos da build standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Inicia o servidor Next.js
CMD ["node", "server.js"]
