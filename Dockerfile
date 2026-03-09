# Estágio 1: Builder - Constrói a aplicação Next.js
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de gerenciamento de dependências
COPY package*.json ./

# Instala as dependências de produção
RUN npm ci --only=production

# Copia o restante dos arquivos do projeto
COPY . .

# Define o ambiente como produção e constrói a aplicação
ENV NODE_ENV=production
RUN npm run build

# ---

# Estágio 2: Runner - Executa a aplicação otimizada
FROM node:20-alpine AS runner

# Define o diretório de trabalho
WORKDIR /app

# Define o ambiente como produção
ENV NODE_ENV=production
# A porta padrão do Next.js. Pode ser sobrescrita por .env.prod no docker-compose.
ENV PORT=3000

# Cria um usuário não-root para segurança e o diretório de dados
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001 \
    && mkdir -p data \
    && chown -R nextjs:nodejs data

# Copia a pasta .next standalone do estágio de builder
COPY --from=builder /app/.next/standalone ./

# Copia os ativos estáticos (CSS, imagens, fontes) do estágio de builder.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Troca para o usuário não-root
USER nextjs

# Expõe a porta em que a aplicação será executada.
# O padrão é 3000, mas pode ser alterado com a variável de ambiente PORT.
EXPOSE 3000

# O comando para iniciar a aplicação.
CMD ["node", "server.js"]
