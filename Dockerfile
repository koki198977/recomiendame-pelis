# Dockerfile para desarrollo/build local
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Generar archivos estáticos
RUN npm run generate

# Los archivos generados estarán en .output/public