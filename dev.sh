#!/bin/bash

# Script para iniciar desarrollo local

echo "🎨 Iniciando ZakaTattoo..."
echo ""

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar si .env existe
if [ ! -f ".env" ]; then
    echo "⚙️ Creando archivo .env..."
    cp .env.example .env
fi

echo ""
echo "🚀 Iniciando servidor..."
echo "📍 Accede a: http://localhost:3000"
echo "🔐 Panel admin: http://localhost:3000/admin.html"
echo "🔑 Clave admin: zaka2024"
echo ""

npm start
