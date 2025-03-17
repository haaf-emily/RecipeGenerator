const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Meal Plan API",
      version: "1.0.0",
      description:
        "API zur Berechnung des Kalorienbedarfs und Erstellung eines Ernährungsplans.",
    },
    servers: [{ url: "http://localhost:8000" }],
    components: {
      schemas: {
        UserData: {
          type: "object",
          properties: {
            gender: {
              type: "string",
              enum: ["male", "female"],
              description: "Geschlecht des Benutzers",
            },
            age: {
              type: "integer",
              minimum: 1,
              maximum: 120,
              description: "Alter in Jahren",
            },
            height: {
              type: "number",
              minimum: 100,
              maximum: 250,
              description: "Körpergröße in Zentimetern",
            },
            weight: {
              type: "number",
              minimum: 30,
              maximum: 300,
              description: "Gewicht in Kilogramm",
            },
            activity_level: {
              type: "string",
              enum: [
                "sedentary",
                "lightly_active",
                "moderately_active",
                "very_active",
                "extra_active",
              ],
              description: "Aktivitätsniveau des Benutzers",
            },
            goal: {
              type: "string",
              enum: ["weight_loss", "maintenance", "weight_gain"],
              default: "maintenance",
              description: "Ziel des Benutzers (abnehmen, halten, zunehmen)",
            },
            location: {
              type: "string",
              description: "Standort des Benutzers (Stadt, Land) - optional",
            },
          },
        },
        MealPlan: {
          type: "object",
          properties: {
            calorieRequirement: {
              type: "number",
              description:
                "Täglicher Kalorienbedarf basierend auf den Benutzerdaten",
            },
            goal: {
              type: "string",
              description: "Verwendetes Ziel für die Berechnung",
            },
            feelsLikeTemperature: {
              type: "number",
              description:
                "Aktuelle Gefühlstemperatur am Standort des Benutzers oder Standardwert",
            },
            locationUsed: {
              type: "string",
              description:
                "Verwendeter Standort oder Hinweis auf Standardtemperatur",
            },
            meals: {
              type: "object",
              properties: {
                breakfast: {
                  type: "object",
                  description: "Details zum Frühstücksrezept",
                },
                lunch: {
                  type: "object",
                  description: "Details zum Mittagsrezept",
                },
                dinner: {
                  type: "object",
                  description: "Details zum Abendessensrezept",
                },
              },
            },
            totalCalories: {
              type: "number",
              description: "Gesamtkalorien im Mahlzeitenplan",
            },
          },
        },
      },
    },
  },
  apis: ["./meal_server.js"], // Hier werden die API-Routen dokumentiert
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = { swaggerUi, swaggerSpec };
