import fs from "fs";
import path from "path";
import { parse } from "node-html-parser";

const baseDir = "htmls"; // carpeta raíz
const Info = [];

// Recorre recursivamente y devuelve todos los .html junto con su directorio padre
function listarHTML(dir) {
    let lista = [];
    const archivos = fs.readdirSync(dir, { withFileTypes: true });

    for (const archivo of archivos) {
        const ruta = path.join(dir, archivo.name);
        if (archivo.isDirectory()) {
            lista = lista.concat(listarHTML(ruta));
        } else if (archivo.isFile() && archivo.name.endsWith(".html")) {
            lista.push(ruta);
        }
    }
    return lista;
}

const archivos = listarHTML(baseDir);

for (const archivo of archivos) {
    const html = Lee_archivo(archivo);
    const root = parse(html);

    // Supercategoría: nombre del directorio dentro de .html
    const supercategoria = path.basename(path.dirname(archivo));

    // Categoría: del h1 o del nombre del archivo
    const categoria =
        root.querySelector("h1.category-detail__title")?.text.trim() ||
        root.querySelector("h1")?.text.trim() ||
        path.basename(archivo, ".html");

    const secciones = root.querySelectorAll('section[data-testid="section"]');

    if (secciones.length > 0) {
        for (const seccion of secciones) {
            const subcategoria =
                seccion.querySelector("h2.section__header")?.text.trim() ||
                "Sin subcategoría";

            const lista_productos = seccion.querySelectorAll(
                'div[data-testid="product-cell"], div.product-cell'
            );

            for (const producto of lista_productos) {
                Info.push(extraerProducto(producto, supercategoria, categoria, subcategoria));
            }

            console.log(` ${supercategoria} / ${categoria} / ${subcategoria} → ${lista_productos.length} productos`);
        }
    } else {
        const lista_productos = root.querySelectorAll(
            'div[data-testid="product-cell"], div.product-cell'
        );

        for (const producto of lista_productos) {
            Info.push(extraerProducto(producto, supercategoria, categoria, "Sin subcategoría"));
        }

        console.log(` ${supercategoria} / ${categoria} / Sin subcategoría → ${lista_productos.length} productos`);
    }
}

// Guardar JSON
try {
    fs.writeFileSync("datos_mercadona.json", JSON.stringify(Info, null, 2));
    console.log("✅ Guardado archivo datos_mercadona.json correctamente");
} catch (error) {
    console.error("❌ Error guardando archivo: ", error);
}

// --- FUNCIONES AUXILIARES ---
function extraerProducto(producto, supercategoria, categoria, subcategoria) {
    const img = producto.querySelector("img");
    const url_img = img?.getAttribute("src") || "";
    const texto_1 = img?.getAttribute("alt") || "";
    const t2 = producto.querySelector("div.product-format");
    const texto_2 = Arregla_texto(t2?.text || "");

    const texto_precio = Arregla_texto(
        producto.querySelector("div.product-price, [data-testid='product-price']")?.innerText || ""
    );

    const r1 = texto_precio.match(/(\d+),?(\d+)?\s*(.*)/);

    let precio_euros, unidad_medida;
    if (r1 && r1.length > 3) {
        precio_euros = Number(r1[1] + "." + (r1[2] || "0"));
        unidad_medida = r1[3].replace("€", "").trim() || "/ud";
    } else {
        precio_euros = 0;
        unidad_medida = "/ud";
    }

    return {
        supercategoria,
        categoria,
        subcategoria,
        url_img,
        texto_1,
        texto_2,
        precio_euros,
        unidad_medida,
    };
}

function Arregla_texto(texto) {
    return texto.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

function Lee_archivo(archivo) {
    try {
        return fs.readFileSync(archivo, "utf8");
    } catch (error) {
        console.error("Error leyendo archivo:", archivo, error);
    }
}
