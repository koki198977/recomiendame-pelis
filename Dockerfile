# syntax=docker/dockerfile:1

# 1. Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar solo dependencias primero (mejor cache)
COPY package.json package-lock.json ./

# Instalar dependencias usando cache de npm entre builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# 2. Etapa de producción con Nginx
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/.output/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
