# 1. Etapa de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Generar archivos estáticos
RUN npm run generate

# 2. Etapa de producción con Nginx
FROM nginx:stable-alpine

# Borra el contenido por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia tu configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia el build estático (Nuxt genera en .output/public)
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]