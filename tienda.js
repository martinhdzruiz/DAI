// tienda.js
import express from "express";
import nunjucks from "nunjucks";
import session from "express-session";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import connectDB from "./model/db.js";
import TiendaRouter from "./routes/router_tienda.js";
import UsuariosRouter from "./routes/router_usuarios.js";
import ApiRouter from "./routes/router_api.js";




const app = express();
import { swaggerSpec, swaggerUiMiddleware } from "./swagger.js";

// Ruta Swagger UI
app.use("/api-docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));

app.use("/api/productos", ApiRouter);

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Tienda",
            version: "1.0.0",
        },
    },
    apis: ["./routes/router_api.js"], // comentarios JSDoc
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// 🧩 Middleware de sesión (para carrito o estado temporal)
app.use(
    session({
        secret: "my-secret",
        resave: false,
        saveUninitialized: false,
    })
);

// Guardar la sesión en las plantillas (res.locals)
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// 🧩 Middleware para procesar formularios y cookies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔑 Middleware de autenticación con JWT
const autenticacion = (req, res, next) => {
    const token = req.cookies.access_token;
    if (token) {
        try {
            const data = jwt.verify(token, process.env.SECRET_KEY || "missecret");
            req.username = data.usuario;
            req.esAdmin = data.admin || false;
            app.locals.usuario = data.usuario;
            app.locals.esAdmin = data.admin || false; // 💡 visible en plantillas
        } catch (err) {
            app.locals.usuario = undefined;
            app.locals.esAdmin = false;
        }
    } else {
        app.locals.usuario = undefined;
        app.locals.esAdmin = false;
    }
    next();
};

app.use(express.json());
app.use(autenticacion);

// 🧠 Configuración de entorno y Nunjucks
const IN = process.env.IN || "development";

const env = nunjucks.configure("views", {
    autoescape: true,
    noCache: IN === "development",
    watch: IN === "development",
    express: app,
});

// Filtro personalizado: suma de campos numéricos (para carrito, totales…)
env.addFilter("sum", function (array, attr = null, fallback = null) {
    if (!array) return 0;
    return array
        .reduce((total, item) => {
            if (attr && item[attr] && item[attr] > 0) return total + item[attr];
            if (fallback && item[fallback]) return total + item[fallback];
            return total;
        }, 0)
        .toFixed(2);
});

app.set("view engine", "html");

// 🧱 Rutas principales
app.use("/", TiendaRouter);
app.use("/usuarios", UsuariosRouter); // rutas de login/registro/logout
app.get("/login", (req, res) => {
    res.redirect("/usuarios/login");
});


// Archivos estáticos (CSS, JS, imágenes)
app.use("/static", express.static("public"));

// --- Test ---
app.get("/hola", (req, res) => res.send("Hola desde el servidor 🚀"));
app.get("/test", (req, res) => res.render("test.html"));

// --- Inicio del servidor ---
const PORT = process.env.PORT || 8080;

const start = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
    });
};

start();
