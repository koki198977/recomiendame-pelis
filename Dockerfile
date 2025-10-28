# 1. Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Asegurar que las imágenes estén en public antes del build
RUN cp assets/logo.png public/ || true
RUN cp assets/screens/screen*.jpeg public/ || true

# Construir la aplicación
RUN npm run build

# 2. Etapa de producción con Nginx
FROM nginx:stable-alpine

# Borra el contenido por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia tu configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia el build estático (Nuxt build genera en .output/public)
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]