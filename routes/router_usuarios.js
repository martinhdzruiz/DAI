// ./routes/router_usuarios.js
import express from "express";
import jwt from "jsonwebtoken";
import Usuario from "../model/Usuario.js";

const router = express.Router();

// Mostrar formulario de login
router.get("/login", (req, res) => {
    res.render("login.html", { error: null });
});

// Procesar formulario de login
// Procesar formulario de login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await Usuario.findOne({ username });

    if (!user) {
        return res.render("login.html", { error: "Usuario no encontrado" });
    }

    const esValido = await user.compararPassword(password);
    if (!esValido) {
        return res.render("login.html", { error: "Contraseña incorrecta" });
    }


    // Token con info del usuario y si es admin
    const token = jwt.sign(
        { usuario: user.username, admin: user.admin },
        process.env.SECRET_KEY || "missecret"
    );

    res
        .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.IN === "production",
        })
        .redirect("/");
});

// Mostrar formulario de registro
router.get("/registro", (req, res) => {
    res.render("registro.html", { error: null });
});

// Procesar registro
router.post("/registro", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existe = await Usuario.findOne({ username });
        if (existe) {
            return res.render("registro.html", { error: "El usuario ya existe" });
        }

        const nuevo = new Usuario({ username, password });
        await nuevo.save();
        res.redirect("/usuarios/login");
    } catch (err) {
        res.render("registro.html", { error: "Error al registrar usuario" });
    }
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("access_token"); // borrar cookie del token
        res.redirect("/");
    });
});
export default router;
