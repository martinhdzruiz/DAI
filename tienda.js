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

// 🟢 1. Primero JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🟢 2. Cookies
app.use(cookieParser());

// 🟢 3. Sesión
app.use(
    session({
        secret: "my-secret",
        resave: false,
        saveUninitialized: false,
    })
);

// 🟢 4. Guardar sesión en plantillas
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// 🟢 5. Autenticación JWT
const autenticacion = (req, res, next) => {
    const token = req.cookies.access_token;
    if (token) {
        try {
            const data = jwt.verify(token, process.env.SECRET_KEY || "missecret");
            req.username = data.usuario;
            req.esAdmin = data.admin || false;
            app.locals.usuario = data.usuario;
            app.locals.esAdmin = data.admin || false;
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

app.use(autenticacion);

// 🟢 6. Swagger
import { swaggerSpec, swaggerUiMiddleware } from "./swagger.js";
app.use("/api-docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));

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
    apis: ["./routes/router_api.js"],
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// 🟢 7. AHORA SÍ: montar API
app.use("/api/productos", ApiRouter);

// 🟢 8. Configurar Nunjucks
const IN = process.env.IN || "development";
const env = nunjucks.configure("views", {
    autoescape: true,
    noCache: IN === "development",
    watch: IN === "development",
    express: app,
});
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

// 🟢 9. Rutas principales
app.use("/", TiendaRouter);
app.use("/usuarios", UsuariosRouter);
app.get("/login", (req, res) => {
    res.redirect("/usuarios/login");
});

// 🟢 10. Archivos estáticos
app.use("/static", express.static("public"));

// Test
app.get("/hola", (req, res) => res.send("Hola desde el servidor 🚀"));
app.get("/test", (req, res) => res.render("test.html"));

// 🟢 11. Inicio servidor
const PORT = process.env.PORT || 8080;
const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
    });
};
start();
