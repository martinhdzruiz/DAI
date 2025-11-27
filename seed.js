// seed.js
import mongoose from "mongoose";
import fs from "fs";

import connectDB from "./model/db.js";
import Producto from "./model/Producto.js";

await connectDB();

const datos_productos = fs.readFileSync("datos_mercadona.json", "utf8");
const lista_productos = JSON.parse(datos_productos);

await guardarEnModelo(Producto, lista_productos);

// Cerrar conexión y salir
await mongoose.disconnect();
process.exit(0);

async function guardarEnModelo(modelo, lista) {
    try {
        // Vacía la colección primero (opcional, para evitar duplicados)
        await modelo.deleteMany({});
        const insertados = await modelo.insertMany(lista);
        console.log(`✅ Insertados ${insertados.length} documentos`);
    } catch (error) {
        console.error(`❌ Error guardando lista: ${error.message}`);
    }
}
