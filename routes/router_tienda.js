import express from "express";
import Producto from "../model/Producto.js";

const router = express.Router();

// Portada
router.get("/", async (req, res) => {
    try {
        const productos = await Producto.aggregate([{ $sample: { size: 3 } }]);

        // 3 productos rebajados al azar
        const productosRebajados = await Producto.aggregate([
            { $match: { precio_rebajado: { $gt: 0 } } },
            { $sample: { size: 3 } }
        ]);

        const categorias = await Producto.aggregate([
            { $group: { _id: "$categoria", subcategorias: { $addToSet: "$subcategoria" } } },
            { $sort: { _id: 1 } }
        ]);

        res.render("portada.html", { productos, productosRebajados, categorias });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});



// ------------------
// 📌 CATEGORÍAS (con menú + destacados/rebajados)
// ------------------
router.get("/categorias", async (req, res) => {
    try {
        const productos = await Producto.aggregate([{ $sample: { size: 3 } }]);
        const productosRebajados = await Producto.aggregate([
            { $match: { precio_rebajado: { $gt: 0 } } },
            { $sample: { size: 3 } }
        ]);

        // Agrupar supercategorías → categorías
        const categorias = await Producto.aggregate([
            { $group: { _id: { super: "$supercategoria", cat: "$categoria" } } },
            { $sort: { "_id.super": 1, "_id.cat": 1 } }
        ]);

        let supercategorias = {};
        categorias.forEach(item => {
            const supercat = item._id.super || "General";
            const cat = item._id.cat;
            if (!supercategorias[supercat]) supercategorias[supercat] = [];
            supercategorias[supercat].push(cat);
        });

        res.render("categorias.html", {
            productos,
            productosRebajados,
            supercategorias
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error cargando categorías");
    }
});

// ------------------
// 📌 UNA CATEGORÍA (productos agrupados por subcategoría)
// ------------------
router.get("/categoria/:cat", async (req, res) => {
    try {
        const { cat } = req.params;
        const productos = await Producto.find({ categoria: cat });

        if (!productos.length) {
            return res.status(404).send("No hay productos en esta categoría");
        }

        // Agrupar por subcategoría
        const productosPorSubcategoria = {};
        productos.forEach(p => {
            const sub = p.subcategoria || "Otros";
            if (!productosPorSubcategoria[sub]) {
                productosPorSubcategoria[sub] = [];
            }
            productosPorSubcategoria[sub].push(p);
        });

        // Menú lateral
        const categorias = await Producto.aggregate([
            { $group: { _id: { super: "$supercategoria", cat: "$categoria" } } },
            { $sort: { "_id.super": 1, "_id.cat": 1 } }
        ]);

        let supercategorias = {};
        categorias.forEach(item => {
            const supercat = item._id.super || "General";
            const cat = item._id.cat;
            if (!supercategorias[supercat]) supercategorias[supercat] = [];
            supercategorias[supercat].push(cat);
        });

        res.render("categoria.html", {
            categoria: cat,
            productosPorSubcategoria,
            supercategorias
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error cargando la categoría");
    }
});



// Buscar
router.get("/buscar", async (req, res) => {
    const { q } = req.query;
    try {
        const productos = await Producto.find({
            $or: [
                { categoria: { $regex: q, $options: "i" } },
                { subcategoria: { $regex: q, $options: "i" } },
                { texto_1: { $regex: q, $options: "i" } },
                { texto_2: { $regex: q, $options: "i" } }
            ]
        });

        res.render("portada.html", { productos, categorias: [] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en la búsqueda");
    }
});



// Detalle de producto
router.get('/producto/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).send("Producto no encontrado");
        res.render('producto.html', { producto });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al cargar el producto");
    }
});

// Añadir al carrito
router.get('/al_carrito/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).send("Producto no encontrado");

        if (!req.session.carrito) req.session.carrito = [];
        req.session.carrito.push(producto);


        console.log(" Carrito actualizado:", req.session.carrito);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al añadir al carrito");
    }
});



// Eliminar un producto del carrito
router.get('/eliminar_carrito/:id', async(req, res) => {
    if (!req.session.carrito) req.session.carrito = [];
    req.session.carrito = req.session.carrito.filter(p => p._id != req.params.id);

    console.log(" Producto eliminado. Carrito:", req.session.carrito);
    res.redirect('/'); // O '/carrito'
});

export default router;
