#!/bin/bash

# Test de verificación del sistema ZakaTattoo

echo "🧪 INICIANDO TESTS..."
echo ""

# Test 1: Verificar Node.js
echo "1️⃣  Verificando Node.js..."
if command -v node &> /dev/null; then
    VERSION=$(node -v)
    echo "   ✅ Node.js instalado: $VERSION"
else
    echo "   ❌ Node.js NO instalado"
    exit 1
fi

# Test 2: Verificar npm
echo ""
echo "2️⃣  Verificando npm..."
if command -v npm &> /dev/null; then
    VERSION=$(npm -v)
    echo "   ✅ npm instalado: $VERSION"
else
    echo "   ❌ npm NO instalado"
    exit 1
fi

# Test 3: Verificar archivos
echo ""
echo "3️⃣  Verificando archivos..."
FILES=("index.html" "admin.html" "server.js" "package.json" ".env")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ Falta $file"
    fi
done

# Test 4: Verificar dependencias
echo ""
echo "4️⃣  Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules existe"
else
    echo "   ⚠️  node_modules no existe, ejecutar: npm install"
fi

# Test 5: Verificar puerto
echo ""
echo "5️⃣  Verificando puerto 3000..."
if lsof -i :3000 &> /dev/null; then
    echo "   ⚠️  Puerto 3000 ya está en uso"
    echo "      Cambiar PORT en .env o usar otro puerto"
else
    echo "   ✅ Puerto 3000 disponible"
fi

# Test 6: Verificar base de datos
echo ""
echo "6️⃣  Verificando base de datos..."
if [ -f "consultas.db" ]; then
    SIZE=$(du -h consultas.db | cut -f1)
    echo "   ✅ consultas.db existe (Tamaño: $SIZE)"
else
    echo "   ⚠️  consultas.db no existe (se creará al iniciar)"
fi

echo ""
echo "════════════════════════════════════════════════"
echo "✅ VERIFICACIÓN COMPLETADA"
echo "════════════════════════════════════════════════"
echo ""
echo "📝 PRÓXIMOS PASOS:"
echo ""
echo "1. Si falta npm o Node.js: Instalarlos"
echo "2. Si falta node_modules: npm install"
echo "3. Para iniciar servidor: npm start"
echo "4. Acceder a: http://localhost:3000"
echo "5. Panel admin: http://localhost:3000/admin.html"
echo ""
echo "🎨 ¡A tatuarse de código!"
