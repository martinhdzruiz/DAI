// swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Rest Tienda — Práctica 4 DAI",
            version: "1.0.0",
            description: "Documentación del API REST de productos para la práctica 4 de DAI",
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Servidor local"
            }
        ],
    },

    // Rutas donde swagger buscará anotaciones
    apis: ["./routes/router_api.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiMiddleware = swaggerUi;
