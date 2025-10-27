#!/bin/bash

# Script de despliegue para coach.recomiendameapp.cl

echo "🚀 Desplegando coach.recomiendameapp.cl"

# 1. Actualizar código
echo "📥 Actualizando código..."
git fetch origin main
git reset --hard origin/main

# 2. Construir la aplicación usando Docker
echo "🏗️ Construyendo aplicación..."
docker build -t recomiendame-coach-web .

# 3. Extraer archivos generados del contenedor
echo "📋 Extrayendo archivos generados..."
docker run --rm -v $(pwd)/.output:/output recomiendame-coach-web cp -r /app/.output/public /output/

# 4. Copiar archivos al directorio de Nginx
echo "📁 Copiando archivos a Nginx..."
sudo rm -rf /var/www/html/recomiendame-coach-web/.output/public/*
sudo mkdir -p /var/www/html/recomiendame-coach-web/.output/public
sudo cp -r .output/public/* /var/www/html/recomiendame-coach-web/.output/public/
sudo chown -R www-data:www-data /var/www/html/recomiendame-coach-web/

# 5. Recargar Nginx
echo "🔄 Recargando Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ ¡Despliegue completado!"
echo "🌐 Tu sitio está disponible en: https://coach.recomiendameapp.cl"