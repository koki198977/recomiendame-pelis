#!/bin/bash

# Script de despliegue para coach.recomiendameapp.cl

echo "🚀 Desplegando coach.recomiendameapp.cl"

# 1. Actualizar código
echo "📥 Actualizando código..."
git fetch origin main
git reset --hard origin/main

# 2. Levantar con Docker Compose
echo "🏗️ Construyendo y levantando contenedor..."
docker-compose down
docker-compose up -d --build

echo "✅ ¡Despliegue completado!"
echo "🌐 Tu sitio está disponible en: https://coach.recomiendameapp.cl"
echo "🐳 Contenedor corriendo en puerto 8081"