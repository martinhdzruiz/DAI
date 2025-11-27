// consultas.js
import mongoose from "mongoose";
import connectDB from "./model/db.js";
import Producto from "./model/Producto.js";

// Conexión a la BD
await connectDB();

// 1️⃣ Productos de menos de 1 €
const baratos = await Producto.find({ precio_euros: { $lt: 1 } });
console.log("\n Productos de menos de 1€:");
console.log(
    baratos.map(p => `- ${p.texto_1} (${p.precio_euros} €)`).join("\n")
);

// 2️⃣ Productos de menos de 1 € que no sean agua
const noAgua = await Producto.find({
    precio_euros: { $lt: 1 },
    texto_1: { $not: /agua/i }
});
console.log("\nProductos de menos de 1€ que no son agua:");
console.log(
    noAgua.map(p => `- ${p.texto_1} (${p.precio_euros} €)`).join("\n")
);

// 3️⃣ Aceites ordenados por precio
const aceites = await Producto.find({ categoria: /aceite/i }).sort({ precio_euros: 1 });
console.log("\nAceites ordenados por precio:");
console.log(
    aceites.map(p => `- ${p.texto_1} → ${p.precio_euros} €`).join("\n")
);

// 4️⃣ Productos en garrafa
const garrafas = await Producto.find({
    $or: [
        { texto_1: /garrafa/i },
        { texto_2: /garrafa/i }
    ]
});
console.log("\nProductos en garrafa:");
console.log(
    garrafas.map(p => `- ${p.texto_1} (${p.precio_euros} €)`).join("\n")
);

// Cerrar conexión
mongoose.connection.close();
