# 1. Builder Stage: Instala dependências e constrói a aplicação Next.js.
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Instala dependências com base nos arquivos de pacote
COPY package*.json ./
RUN npm install

# Copia todos os outros arquivos de origem
COPY . .

# Desabilita a telemetria do Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Constrói a aplicação Next.js para produção
# O modo de saída 'standalone' será usado conforme configurado em next.config.js.
RUN npm run build

# 2. Runner Stage: Uma imagem menor para executar a aplicação.
FROM node:18-alpine AS runner

WORKDIR /app

# Define o ambiente para produção
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Cria um usuário não-root para maior segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copia a saída standalone do Next.js do estágio de builder.
# Isso inclui o arquivo server.js e a pasta .next/.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copia os ativos estáticos (CSS, imagens, fontes) do estágio de builder.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Troca para o usuário não-root
USER nextjs

# Expõe a porta em que a aplicação será executada.
# O padrão é 3000, mas pode ser alterado com a variável de ambiente PORT.
EXPOSE 3000

# O comando para iniciar a aplicação.
CMD ["node", "server.js"]
