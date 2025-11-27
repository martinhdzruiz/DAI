// ./model/Producto.js
import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    supercategoria: {
        type: String,
        required: true,
        trim: true,
    },
    
    categoria: {
        type: String,
        required: true,
        trim: true,
    },
    subcategoria: {
        type: String,
        trim: true,
    },
    url_img: {
        type: String,
        trim: true,
    },
    texto_1: {
        type: String,
        trim: true,
    },
    texto_2: {
        type: String,
        trim: true,
    },
    precio_euros: {
        type: Number,
        min: 0,
    },
    precio_rebajado: {
        type: Number,
        min: 0,
        default: 0
    },
    unidad_medida: {
        type: String,
        trim: true,
        default: "/ud" }
});

const Producto = mongoose.model("Producto", productoSchema);

export default Producto;
