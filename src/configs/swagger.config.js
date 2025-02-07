const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const port = 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swagger API Bookshelf",
      version: "1.0.0",
      description: "API documentation for the system",
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
      },
    ],
  },
  apis: [path.join(__dirname, "../routers/*.js")], // Ensure correct path
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
