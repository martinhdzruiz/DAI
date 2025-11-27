#!/bin/bash

echo "=============================================="
echo "     🧹 LIMPIEZA COMPLETA DE ARCHIVOS GENERADOS"
echo "=============================================="

cd "$(dirname "$0")"

# -----------------------------------------------
# 1. Eliminar node_modules
# -----------------------------------------------
echo "🗑  Eliminando node_modules/ ..."
rm -rf node_modules
tm -rf data

# -----------------------------------------------
# 2. Eliminar package-lock.json
# -----------------------------------------------
echo "🗑  Eliminando package-lock.json ..."
rm -f package-lock.json


# -----------------------------------------------
# 3. Eliminar carpetas/logs generadas por Winston
# -----------------------------------------------
echo "🗑  Eliminando carpeta logs/ ..."
rm -rf logs

# -----------------------------------------------
# 4. Eliminar documentación de Swagger (si la hubiera)
# -----------------------------------------------
echo "🗑  Eliminando documentación Swagger (si existe) ..."
rm -rf swagger-output
rm -rf swagger



echo "----------------------------------------------"
echo "  ✔ LIMPIEZA COMPLETA SIN BORRAR MONGODB"
echo "----------------------------------------------"
