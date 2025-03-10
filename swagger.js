const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Meal Plan API",
      version: "1.0.0",
      description: "API zur Berechnung des Kalorienbedarfs und Erstellung eines Ernährungsplans.",
    },
    servers: [{ url: "http://localhost:8000" }],
  },
  apis: ["meal_server.js"], // Hier werden die API-Routen dokumentiert
};

const swaggerSpec = swaggerJsDoc(options);
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));  //wird das wirklich gebraucht?
module.exports = { swaggerUi, swaggerSpec };
