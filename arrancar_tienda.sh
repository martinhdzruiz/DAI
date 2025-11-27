#!/bin/bash

echo "=============================================="
echo "     🛒 ARRANQUE COMPLETO DE LA TIENDA"
echo "=============================================="

# 📌 Entrar en la carpeta del proyecto
cd "$(dirname "$0")"

# -----------------------------------------------
# 1. Instalar node-html-parser
# -----------------------------------------------
echo "➡ Instalando node-html-parser ..."
npm install node-html-parser
npm install nunjucks
npm install mongoose


# -----------------------------------------------
# 2. Ejecutar parser.js
# -----------------------------------------------
echo "➡ Ejecutando parser.js ..."
node parser.js

# -----------------------------------------------
# 3. Ejecutar seed.js
# -----------------------------------------------
echo "➡ Ejecutando seed.js ..."
node seed.js

# -----------------------------------------------
# 4. Ejecutar rebajas.js
# -----------------------------------------------
echo "➡ Ejecutando rebajas.js ..."
node rebajas.js

# -----------------------------------------------
# 5. Instalar winston
# -----------------------------------------------
echo "➡ Instalando winston ..."
npm install winston

# -----------------------------------------------
# 6. Instalar swagger-ui-express y swagger-jsdoc
# -----------------------------------------------
echo "➡ Instalando Swagger ..."
npm install swagger-ui-express swagger-jsdoc

# -----------------------------------------------
# 7. Iniciar la tienda en modo desarrollo
# -----------------------------------------------
echo "➡ Iniciando servidor con: npm run dev ..."
npm run dev

echo "----------------------------------------------"
echo "  🟢 La tienda está disponible en:"
echo "     http://localhost:8080"
echo "----------------------------------------------"
