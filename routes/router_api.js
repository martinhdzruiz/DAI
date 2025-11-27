import express from "express";
import Producto from "../model/Producto.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - supercategoria
 *         - categoria
 *       properties:
 *         supercategoria:
 *           type: string
 *         categoria:
 *           type: string
 *         subcategoria:
 *           type: string
 *         url_img:
 *           type: string
 *         texto_1:
 *           type: string
 *         texto_2:
 *           type: string
 *         precio_euros:
 *           type: number
 *         precio_rebajado:
 *           type: number
 *         unidad_medida:
 *           type: string
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
router.get("/", async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: "Error obteniendo productos" });
    }
});


/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtiene un producto por su ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
        res.json(producto);
    } catch (err) {
        res.status(400).json({ error: "ID inválido" });
    }
});


/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 */
router.post("/", async (req, res) => {
    try {
        const nuevo = new Producto(req.body);
        await nuevo.save();
        res.status(201).json(nuevo);
    } catch (err) {
        res.status(400).json({ error: "Error creando producto" });
    }
});


/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Elimina un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.delete("/:id", async (req, res) => {
    try {
        const eliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!eliminado) return res.status(404).json({ error: "Producto no encontrado" });
        res.json({ mensaje: "Producto eliminado" });
    } catch (err) {
        res.status(400).json({ error: "ID inválido" });
    }
});


/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualiza el precio de un producto
 *     tags: [Productos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               precio_euros:
 *                 type: number
 *               precio_rebajado:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put("/:id", async (req, res) => {
    try {
        const cambios = {};

        if (typeof req.body.precio_euros !== "undefined") {
            cambios.precio_euros = req.body.precio_euros;
        }

        if (typeof req.body.precio_rebajado !== "undefined") {
            cambios.precio_rebajado = req.body.precio_rebajado;
        }

        const actualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            cambios,
            { new: true, runValidators: true }
        );


        if (!actualizado) return res.status(404).json({ error: "Producto no encontrado" });

        res.json(actualizado);

    } catch (err) {
        console.error("ERROR REAL EN PUT:", err);
        res.status(400).json({ error: "ID inválido" });
    }
});

/**
 * @swagger
 * /api/busqueda-anticipada/{texto}:
 *   get:
 *     summary: Búsqueda anticipada de productos
 *     tags: [Productos]
 *     parameters:
 *       - name: texto
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de productos coincidentes
 */
router.get("/busqueda-anticipada/:texto", async (req, res) => {

    try {
        const texto = req.params.texto;

        if (texto.length < 1)
            return res.json([]);

        const regex = new RegExp(texto, "i"); // búsqueda case-insensitive

        const productos = await Producto.find({
            $or: [
                { texto_1: regex },
                { texto_2: regex },
                { categoria: regex },
                { subcategoria: regex }
            ]
        }).limit(50); // limitar para que no devuelva 1800 productos

        res.json(productos);

    } catch (err) {
        console.error("❌ ERROR en búsqueda anticipada:", err);
        res.status(500).json({ error: "Error en la búsqueda" });
    }
});


export default router;
