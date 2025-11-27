// update_rebajas.js
import mongoose from "mongoose";
import connectDB from "./model/db.js";
import Producto from "./model/Producto.js";

await connectDB();

async function aplicarRebajas() {
    try {
        // 🔹 Ejemplo 1: rebajar todos los productos de una categoría
        await Producto.updateMany(
            { categoria: "Especias" },
            { $set: { precio_rebajado: 0.8 } } // rebaja fija
        );
        // 🔹 Ejemplo 2: rebajar productos que contengan la palabra pollo
        // Rebaja aleatoria entre 5% y 30% para productos que contengan "pollo"
        const productosPollo = await Producto.find({ texto_1: /pollo/i });
        for (const p of productosPollo) {
            const min = 0.05, max = 0.30; // 5% - 30%
            const porcentaje = Math.random() * (max - min) + min;
            const precioRebajado = Number((p.precio_euros * (1 - porcentaje)).toFixed(2));
            await Producto.updateOne(
            { _id: p._id },
            { $set: { precio_rebajado: precioRebajado, porcentaje_rebaja: Math.round(porcentaje * 100) } }
            );
        }

        // 🔹 Ejemplo 3: rebajar un % automáticamente
        const productos = await Producto.find({ categoria: "Aceitunas y encurtidos" });
        for (let p of productos) {
            const precioDescuento = (p.precio_euros * 0.9).toFixed(2); // 10% de descuento
            await Producto.updateOne(
                { _id: p._id },
                { $set: { precio_rebajado: precioDescuento } }
            );
        }

        console.log("✅ Rebajas aplicadas correctamente.");
    } catch (err) {
        console.error("❌ Error aplicando rebajas:", err.message);
    } finally {
        mongoose.connection.close();
    }
}

aplicarRebajas();
