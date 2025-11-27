import fs from "fs";

// Leer archivo JSON
const data = JSON.parse(fs.readFileSync("datos_mercadona.json", "utf8"));

// Objeto para agrupar categorías y subcategorías
const categorias = {};

for (const producto of data) {
    const cat = producto.categoria || "Sin categoría";
    const sub = producto.subcategoria || "Sin subcategoría";

    if (!categorias[cat]) {
        categorias[cat] = new Set();
    }
    categorias[cat].add(sub);
}

// Mostrar resultados en terminal
console.log("📂 Categorías encontradas en datos_mercadona.json:\n");

Object.keys(categorias).sort().forEach(cat => {
    console.log(`- ${cat}`);
    const subs = Array.from(categorias[cat]).filter(s => s !== "Sin subcategoría").sort();
    subs.forEach(sub => {
        console.log(`   ↳ ${sub}`);
    });
});
