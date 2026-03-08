# Guia de Deploy para Self-Hosting com Docker

Este guia descreve os passos para implantar a aplicação Next.js em um servidor VPS (como o da Hostinger) usando Docker e Docker Compose.

## Pré-requisitos

1.  **Acesso ao Servidor**: Acesso SSH ao seu VPS com Ubuntu.
2.  **Docker Instalado**: [Instruções de instalação do Docker](https://docs.docker.com/engine/install/ubuntu/).
3.  **Docker Compose Instalado**: [Instruções de instalação do Docker Compose](https://docs.docker.com/compose/install/).

## Passos para o Deploy

### 1. Clone o Repositório

Conecte-se ao seu servidor via SSH e clone o repositório do projeto:

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DO_DIRETORIO_DO_PROJETO>
```

### 2. Crie o Arquivo de Variáveis de Ambiente

Crie um arquivo para as variáveis de ambiente de produção. Use o `.env.example` como base.

```bash
cp .env.example .env.prod
```

Agora, edite o arquivo `.env.prod` com um editor de texto (como `nano` ou `vim`) e preencha com suas chaves e segredos reais:

```bash
nano .env.prod
```

**Conteúdo do `.env.prod`:**

```env
# Cole suas chaves de API reais aqui
GEMINI_API_KEY="sua-chave-gemini"
OPENAI_API_KEY="sua-chave-openai"
MAGNUS_OPENAI_MODEL="gpt-4o-mini"

# Crie um token seguro e aleatório para o n8n
N8N_SECRET_TOKEN="um-token-bem-longo-e-seguro-aqui"

# Porta que a aplicação usará dentro do container
PORT=3000
```

### 3. Construa e Inicie os Containers

Use o Docker Compose para construir a imagem da sua aplicação e iniciar o container em modo "detached" (`-d`).

```bash
docker-compose up -d --build
```

-   `--build`: Força a reconstrução da imagem Docker, o que é importante ao aplicar novas alterações de código.
-   `-d`: Roda o container em segundo plano.

### 4. Verifique se a Aplicação está Rodando

Você pode verificar os logs para garantir que tudo iniciou corretamente:

```bash
docker-compose logs -f
```

Se tudo estiver OK, você deve ver uma mensagem indicando que o servidor Next.js iniciou na porta 3000. Pressione `Ctrl+C` para sair dos logs.

A aplicação estará acessível em `http://SEU_IP_DO_SERVIDOR:3000`.

### 5. (Recomendado) Configure um Reverse Proxy com Nginx

Para produção, não é recomendado expor a porta 3000 diretamente à internet. Use um reverse proxy como o Nginx para:
-   Atender a aplicação na porta 80 (HTTP) e 443 (HTTPS).
-   Configurar um domínio (ex: `app.suaempresa.com`).
-   Gerenciar certificados SSL/TLS para HTTPS (altamente recomendado usar Let's Encrypt).

**Exemplo de configuração básica do Nginx:**

Crie um arquivo em `/etc/nginx/sites-available/sua-app`:

```nginx
server {
    listen 80;
    server_name app.suaempresa.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative o site e reinicie o Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/sua-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Depois disso, use o `certbot` para configurar o HTTPS facilmente.

## Comandos Úteis do Docker

-   **Parar a aplicação**: `docker-compose down`
-   **Ver status dos containers**: `docker-compose ps`
-   **Ver logs**: `docker-compose logs -f renascer-app`
-   **Forçar a recriação dos containers**: `docker-compose up -d --force-recreate`
