#!/bin/bash

# MOK Landing Page - Setup Script
# Este script verifica que todo está listo para desarrollar

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         MOK - LANDING PAGE MÉDICO ESTÉTICO                    ║"
echo "║                  Verificación del Proyecto                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar Node.js
echo "🔍 Verificando requisitos del sistema..."
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js no está instalado"
    exit 1
fi

if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm no está instalado"
    exit 1
fi

echo ""
echo "🛠  Verificando dependencias del proyecto..."

# Lista de dependencias críticas
DEPS=("next" "@mui/material" "@emotion/react" "react" "typescript")

for dep in "${DEPS[@]}"; do
    if npm list "$dep" &> /dev/null; then
        VERSION=$(npm list "$dep" --depth=0 2>&1 | grep "$dep" | head -1 | awk '{print $NF}' | tr -d '()')
        echo "✅ $dep: $VERSION"
    else
        echo "❌ $dep no está instalado"
    fi
done

echo ""
echo "📁 Verificando estructura de carpetas..."

FOLDERS=("src" "src/app" "src/components" "src/theme" "src/lib" "public")

for folder in "${FOLDERS[@]}"; do
    if [ -d "$folder" ]; then
        echo "✅ $folder"
    else
        echo "❌ $folder falta"
    fi
done

echo ""
echo "📄 Verificando archivos críticos..."

FILES=(
    "src/app/layout.tsx"
    "src/app/page.tsx"
    "src/app/providers.tsx"
    "src/theme/theme.ts"
    "src/lib/data.ts"
    "src/components/layout/Header.tsx"
    "src/components/layout/Footer.tsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file falta"
    fi
done

echo ""
echo "🚀 Verificación completada!"
echo ""
echo "Próximos pasos:"
echo "1. npm run dev      - Inicia servidor de desarrollo"
echo "2. npm run build    - Compila para producción"
echo "3. npm run start    - Inicia servidor de producción"
echo ""
echo "📖 Lee GUIA_COMPLETA.md para instrucciones detalladas"
echo ""
