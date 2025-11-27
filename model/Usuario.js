// ./model/Usuario.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,  // Por defecto no es administrador
        required: false,
    },
    
});

// Middleware para cifrar la contraseña antes de guardar
usuarioSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
