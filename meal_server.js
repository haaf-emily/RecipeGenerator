const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 8000;

const { swaggerUi, swaggerSpec } = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(cors());

const { GOOGLE_GEOCODE_API_KEY, NINJA_API_KEY, CALORIERAPIDAPI_KEY, RAPIDAPI_KEY } = process.env;

async function getCoordinates(location) {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: { address: location, key: GOOGLE_GEOCODE_API_KEY },
    });

    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }
    throw new Error("Geocoding failed: " + response.data.status);
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
  }
}

async function getFeelsLikeTemperature(latitude, longitude) {
  try {
    const { data } = await axios.get("https://api.api-ninjas.com/v1/weather", {
      params: { lat: latitude, lon: longitude },
      headers: { "X-Api-Key": NINJA_API_KEY },
    });
    return data.feels_like || null;
  } catch (error) {
    console.error("Fehler bei Wetter-API:", error.message);
    return null;
  }
}

async function calculateCalories(age, weight, height, gender, activity_level, goal) {
  try {
    const { data } = await axios.get("https://health-calculator-api.p.rapidapi.com/dcn", {
      params: { age, weight, height, gender, activity_level, goal, equation: "mifflin" },
      headers: { "X-RapidAPI-Key": CALORIERAPIDAPI_KEY },
    });
    return data.caloric_needs?.calories || null;
  } catch (error) {
    console.error("Fehler bei Kalorienberechnung:", error.message);
    return null;
  }
}

async function getRecipesByCategory(category) {
  try {
    const { data } = await axios.get("https://gustar-io-deutsche-rezepte.p.rapidapi.com/search_api", {
      params: { text: category, ingLimit: "0" },
      headers: { "X-RapidAPI-Key": RAPIDAPI_KEY },
    });
    return data.filter(recipe => recipe.nutrition?.kcal > 0) || [];
  } catch (error) {
    console.error(`Fehler bei Rezept-API für ${category}:`, error.message);
    return [];
  }
}

async function selectThreeMeals(calories, temperature) {
  let categories;
  if (temperature < 10) {
    categories = ["Warme Frühstücksgerichte", "Suppe", "Deftiges Abendessen"];
  } else if (temperature > 20) {
    categories = ["Leichtes Frühstück", "Salate", "Leichtes Abendessen"];
  } else {
    categories = ["Frühstück", "Hauptgericht", "Abendessen"];
  }

  const meals = await Promise.all(categories.map(getRecipesByCategory));

  if (meals.some(category => category.length === 0)) {
    return { error: "Nicht genügend Rezepte gefunden." };
  }
  let breakfast, lunch, dinner, totalCalories;
  // Sicherstellen, dass calories eine Zahl ist
  calories = parseFloat(calories);
  do {
      breakfast = meals[0][Math.floor(Math.random() * meals[0].length)];
      lunch = meals[1][Math.floor(Math.random() * meals[1].length)];
      dinner = meals[2][Math.floor(Math.random() * meals[2].length)];
      totalCalories = breakfast.nutrition.kcal + lunch.nutrition.kcal + dinner.nutrition.kcal;
  } while (totalCalories < calories - 100 || totalCalories > calories + 100);

  return { breakfast, lunch, dinner, totalCalories };
}

  /**
 * @swagger
 * /get_meal_plan:
 *   get:
 *     summary: Gibt einen personalisierten Ernährungsplan zurück.
 *     parameters:
 *       - in: query
 *         name: age
 *         schema:
 *           type: integer
 *         required: true
 *         description: Alter des Nutzers in Jahren.
 *       - in: query
 *         name: weight
 *         schema:
 *           type: number
 *         required: true
 *         description: Gewicht des Nutzers in Kilogramm.
 *       - in: query
 *         name: height
 *         schema:
 *           type: number
 *         required: true
 *         description: Körpergröße des Nutzers in cm.
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female]
 *         required: true
 *         description: Geschlecht des Nutzers.
 *       - in: query
 *         name: activity_level
 *         schema:
 *           type: string
 *           enum: [sedentary, lightly_active, moderately_active, very_active, extra_active]
 *         required: true
 *         description: Aktivitätslevel des Nutzers.
 *       - in: query
 *         name: goal
 *         schema:
 *           type: string
 *           enum: [weight_loss, maintenance, weight_gain]
 *         required: true
 *         description: Ernährungsziel.
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: true
 *         description: Standort des Nutzers (z. B. "Berlin, Germany").
 *     responses:
 *       200:
 *         description: Erfolgreiche Antwort mit Mahlzeiten.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 kalorienbedarf:
 *                   type: number
 *                 gefühlteTemperatur:
 *                   type: number
 *                 mahlzeiten:
 *                   type: object
 *                   properties:
 *                     frühstück:
 *                       type: string
 *                     mittagessen:
 *                       type: string
 *                     abendessen:
 *                       type: string
 *                 gesamtKalorien:
 *                   type: number
 *       400:
 *         description: Fehlende Parameter.
 *       500:
 *         description: Interner Serverfehler.
 */
app.get("/get_meal_plan", async (req, res) => {
  try {
    const { age, weight, height, gender, activity_level, goal, location } = req.query;
    if (![age, weight, height, gender, activity_level, goal, location].every(Boolean)) {
      return res.status(400).json({ error: "Fehlende Parameter!" });
    }

    const calories = await calculateCalories(age, weight, height, gender, activity_level, goal);
    if (!calories) return res.status(500).json({ error: "Fehler bei Kalorienberechnung" });

    const coordinates = await getCoordinates(location);
    if (!coordinates) return res.status(500).json({ error: "Fehler bei Geocoding" });

    const feelsLikeTemp = await getFeelsLikeTemperature(coordinates.latitude, coordinates.longitude);
    const mealPlan = await selectThreeMeals(calories, feelsLikeTemp);

    if (mealPlan.error) return res.status(500).json({ error: mealPlan.error });

    res.json({
      kalorienbedarf: calories,
      gefühlteTemperatur: feelsLikeTemp,
      mahlzeiten: { frühstück: mealPlan.breakfast, mittagessen: mealPlan.lunch, abendessen: mealPlan.dinner },
      gesamtKalorien: mealPlan.totalCalories,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen des Ernährungsplans:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
