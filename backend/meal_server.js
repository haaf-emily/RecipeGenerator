const express = require("express");
const axios = require("axios");
const cors = require("cors");
const NodeCache = require("node-cache");
require("dotenv").config();

// Import swagger configuration from external file
const { swaggerUi, swaggerSpec } = require("./swagger");

const app = express();
const PORT = 8000;

// Middleware setup
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  // Disable caching for testing purposes
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Setup Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Environment variables and validation
const {
  GOOGLE_GEOCODE_API_KEY,
  NINJA_API_KEY,
  CALORIERAPIDAPI_KEY,
  RAPIDAPI_KEY,
} = process.env;

// Validate API keys on startup
if (
  !GOOGLE_GEOCODE_API_KEY ||
  !NINJA_API_KEY ||
  !CALORIERAPIDAPI_KEY ||
  !RAPIDAPI_KEY
) {
  console.error("Missing required API keys in environment variables");
}

// Create cache instances with TTL (time to live)
const coordinatesCache = new NodeCache({ stdTTL: 43200 }); // Cache for 12 hours
const temperatureCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
const caloriesCache = new NodeCache({ stdTTL: 43200 }); // Cache for 12 hours
const recipesCache = new NodeCache({ stdTTL: 43200 }); // Cache for 12 hours

let userData = {}; // Store user data persistently

// Data validation schemas
const userDataSchema = {
  age: (val) =>
    val === undefined || val === null
      ? true
      : Number.isInteger(Number(val)) && val > 0 && val < 120,

  weight: (val) =>
    val === undefined || val === null
      ? true
      : !isNaN(val) && val > 30 && val < 300,

  height: (val) =>
    val === undefined || val === null
      ? true
      : !isNaN(val) && val > 100 && val < 250,

  gender: (val) =>
    val === undefined || val === null
      ? true
      : ["male", "female"].includes(String(val).toLowerCase()),

  activity_level: (val) =>
    val === undefined || val === null
      ? true
      : [
          "sedentary",
          "lightly_active",
          "moderately_active",
          "very_active",
          "extra_active",
        ].includes(val),

  goal: (val) =>
    val === undefined || val === null
      ? true
      : ["weight_loss", "maintenance", "weight_gain"].includes(val),

  location: (val) => {
    // Always return true for undefined, null, or empty string
    if (val === undefined || val === null || val === "") {
      return true;
    }
    // Otherwise check if it's a non-empty string
    return typeof val === "string" && val.trim().length > 0;
  },
};

/**
 * Validate user data against the validation schema
 * @param {Object} data - User data to validate
 * @returns {Object} - Validation results
 */
function validateUserData(data) {
  const errors = {};
  const validated = {};

  // First pass: copy all data to validated object
  Object.keys(data).forEach((field) => {
    validated[field] = data[field];
  });

  // Second pass: check validation and collect errors
  Object.keys(data).forEach((field) => {
    // Skip fields that aren't in our schema
    if (!userDataSchema[field]) return;

    if (!userDataSchema[field](data[field])) {
      errors[field] = `Invalid value for ${field}`;
    }
  });

  return { validated, errors, isValid: Object.keys(errors).length === 0 };
}

/**
 * Get geographic coordinates from a location name
 * @param {string} location - Location name (city, country)
 * @returns {Object|null} - Coordinates object or null if not found
 */
async function getCoordinates(location) {
  try {
    if (!location) return null;

    // Check cache first
    const cacheKey = `coords-${location.toLowerCase().replace(/\s+/g, "")}`;
    const cachedCoords = coordinatesCache.get(cacheKey);
    if (cachedCoords) {
      console.log("Using cached coordinates for:", location);
      return cachedCoords;
    }

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: { address: location, key: GOOGLE_GEOCODE_API_KEY },
      }
    );

    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      const coordinates = { latitude: lat, longitude: lng };

      // Store in cache
      coordinatesCache.set(cacheKey, coordinates);
      return coordinates;
    }
    throw new Error("Geocoding failed: " + response.data.status);
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    return null;
  }
}

/**
 * Get the feels-like temperature for a location
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {number|null} - Temperature in Celsius or null if not available
 */
async function getFeelsLikeTemperature(latitude, longitude) {
  try {
    if (!latitude || !longitude) return null;

    // Check cache first
    const cacheKey = `temp-${latitude}-${longitude}`;
    const cachedTemp = temperatureCache.get(cacheKey);
    if (cachedTemp !== undefined) {
      console.log("Using cached temperature data");
      return cachedTemp;
    }

    const { data } = await axios.get("https://api.api-ninjas.com/v1/weather", {
      params: { lat: latitude, lon: longitude },
      headers: { "X-Api-Key": NINJA_API_KEY },
    });

    const feelsLike = data.feels_like || null;

    // Store in cache
    temperatureCache.set(cacheKey, feelsLike);
    return feelsLike;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return null;
  }
}

/**
 * Calculate daily calorie needs based on user data
 * @param {number} age - User's age
 * @param {number} weight - User's weight in kg
 * @param {number} height - User's height in cm
 * @param {string} gender - User's gender
 * @param {string} activity_level - User's activity level
 * @param {string} goal - User's weight goal
 * @returns {number|null} - Daily calorie needs or null if calculation failed
 */
async function calculateCalories(
  age,
  weight,
  height,
  gender,
  activity_level,
  goal
) {
  try {
    // Check cache first
    const cacheKey = `calories-${age}-${weight}-${height}-${gender}-${activity_level}-${goal}`;
    const cachedCalories = caloriesCache.get(cacheKey);
    if (cachedCalories !== undefined) {
      console.log("Using cached calorie data");
      return cachedCalories;
    }

    const { data } = await axios.get(
      "https://health-calculator-api.p.rapidapi.com/dcn",
      {
        params: {
          age,
          weight,
          height,
          gender,
          activity_level,
          goal,
          equation: "mifflin",
        },
        headers: { "X-RapidAPI-Key": CALORIERAPIDAPI_KEY },
      }
    );

    const calories = data.caloric_needs?.calories || null;

    // Store in cache
    if (calories !== null) {
      caloriesCache.set(cacheKey, calories);
    }

    return calories;
  } catch (error) {
    console.error("Error calculating calories:", error.message);
    return null;
  }
}

/**
 * Get recipes for a specific category
 * @param {string} category - Recipe category
 * @returns {Array} - Array of recipes
 */
async function getRecipesByCategory(category) {
  try {
    // Check cache first
    const cacheKey = `recipes-${category}`;
    const cachedRecipes = recipesCache.get(cacheKey);
    if (cachedRecipes) {
      console.log("Using cached recipes for category:", category);
      return cachedRecipes;
    }

    const { data } = await axios.get(
      "https://gustar-io-deutsche-rezepte.p.rapidapi.com/search_api",
      {
        params: { text: category, ingLimit: "0" },
        headers: { "X-RapidAPI-Key": RAPIDAPI_KEY },
      }
    );

    const recipes = data.filter((recipe) => recipe.nutrition?.kcal > 0) || [];

    // Store in cache
    recipesCache.set(cacheKey, recipes);
    return recipes;
  } catch (error) {
    console.error(`Error fetching recipes for ${category}:`, error.message);
    return [];
  }
}

/**
 * Select three meals (breakfast, lunch, dinner) based on calorie target and temperature
 * @param {number} calories - Target calorie total
 * @param {number} temperature - Current temperature in Celsius
 * @returns {Object} - Selected meals
 */
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

  if (meals.some((category) => category.length === 0)) {
    return { error: "Not enough recipes found." };
  }

  // Improved meal selection algorithm with a safety counter to prevent infinite loops
  let breakfast, lunch, dinner, totalCalories;
  let attempts = 0;
  const maxAttempts = 100;
  calories = parseFloat(calories);

  do {
    breakfast = meals[0][Math.floor(Math.random() * meals[0].length)];
    lunch = meals[1][Math.floor(Math.random() * meals[1].length)];
    dinner = meals[2][Math.floor(Math.random() * meals[2].length)];
    totalCalories =
      breakfast.nutrition.kcal + lunch.nutrition.kcal + dinner.nutrition.kcal;
    attempts++;

    // Break the loop if we can't find a match after maxAttempts
    if (attempts >= maxAttempts) {
      console.log(
        `Couldn't find exact calorie match after ${maxAttempts} attempts. Using best match.`
      );
      break;
    }
  } while (totalCalories < calories - 100 || totalCalories > calories + 100);

  return { breakfast, lunch, dinner, totalCalories };
}

// === API ENDPOINTS ===

/**
 * @swagger
 * /api/user-data:
 *   post:
 *     tags:
 *       - User Data Management
 *     summary: Benutzerdaten speichern
 *     description: Speichert Benutzerprofildaten für die Mahlzeitenplanung
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserData'
 *     responses:
 *       200:
 *         description: Daten erfolgreich empfangen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data received and validated successfully
 *                 receivedData:
 *                   $ref: '#/components/schemas/UserData'
 *       400:
 *         description: Ungültige Daten übermittelt
 *       500:
 *         description: Serverfehler
 */
app.post("/api/user-data", async (req, res) => {
  try {
    // console.log("Received user data:", req.body);

    // Use the more lenient validation
    const { validated, errors, isValid } = validateUserData(req.body);

    if (!isValid) {
      console.log("Validation errors:", errors);
      return res.status(400).json({
        error: "Invalid data provided",
        details: errors,
      });
    }

    // Update user data with validated values, keeping existing data
    userData = { ...userData, ...validated };
    // console.log("Updated user data:", userData);

    res.json({
      message: "Data received and validated successfully",
      receivedData: validated,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /api/clear-cache:
 *   post:
 *     tags:
 *       - System Management
 *     summary: Cache leeren
 *     description: Löscht alle zwischengespeicherten Daten einschließlich Koordinaten, Temperaturen, Kalorien, Rezepte und Benutzerdaten
 *     responses:
 *       200:
 *         description: Cache erfolgreich geleert
 *       500:
 *         description: Fehler beim Leeren des Caches
 */
app.post("/api/clear-cache", async (req, res) => {
  try {
    // Reset user data
    userData = {};

    // Clear all caches
    coordinatesCache.flushAll();
    temperatureCache.flushAll();
    caloriesCache.flushAll();
    recipesCache.flushAll();

    console.log("All caches cleared");
    res.json({ message: "Cache cleared successfully" });
  } catch (error) {
    console.error("Error clearing cache:", error);
    res.status(500).json({ error: "Failed to clear cache" });
  }
});

/**
 * @swagger
 * /api/user-data:
 *   get:
 *     tags:
 *       - User Data Management
 *     summary: Benutzerdaten abrufen
 *     description: Ruft gespeicherte Benutzerprofildaten ab
 *     responses:
 *       200:
 *         description: Benutzerdaten erfolgreich abgerufen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserData'
 */
app.get("/api/user-data", (req, res) => {
  res.json(userData);
});

/**
 * @swagger
 * /get_meal_plan:
 *   get:
 *     tags:
 *       - Meal Planning
 *     summary: Ernährungsplan generieren
 *     description: >
 *       Generiert einen personalisierten Ernährungsplan basierend auf Benutzerdaten und Standort.
 *       Der Ernährungsplan berücksichtigt den Kalorienbedarf des Benutzers, sein Gewichtsziel und
 *       die aktuelle Temperatur an seinem Standort, um passende Mahlzeiten vorzuschlagen.
 *     responses:
 *       200:
 *         description: Ernährungsplan erfolgreich generiert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MealPlan'
 *       400:
 *         description: Fehlende erforderliche Benutzerdaten
 *       500:
 *         description: Fehler bei der Generierung des Ernährungsplans
 */
app.get("/get_meal_plan", async (req, res) => {
  try {
    const {
      age,
      weight,
      height,
      gender,
      activity_level,
      goal = "maintenance",
      location,
    } = userData;

    // Check if required fields are present
    const missingFields = [];
    ["age", "weight", "height", "gender", "activity_level"].forEach((field) => {
      if (!userData[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required parameters",
        required: missingFields,
        currentData: userData,
      });
    }

    // Use default goal if not set
    const calculationGoal = goal || "maintenance";

    // Calculate calories without goal and location if necessary
    const calories = await calculateCalories(
      age,
      weight,
      height,
      gender,
      activity_level,
      calculationGoal
    );

    // Log after calorie calculation
    // console.log("Calorie calculation result:", calories);

    if (!calories) {
      return res.status(500).json({ error: "Error calculating calories" });
    }

    // Use default temperature if location is missing
    let feelsLikeTemp = 15; // Default to moderate temperature

    // Only get real temperature if location is provided
    if (location && location.trim()) {
      const coordinates = await getCoordinates(location);
      if (coordinates) {
        const tempResult = await getFeelsLikeTemperature(
          coordinates.latitude,
          coordinates.longitude
        );
        // console.log("Temperature result:", tempResult);

        if (tempResult !== null) {
          feelsLikeTemp = tempResult;
          // console.log("Using actual temperature:", feelsLikeTemp);
        }
      }
    }

    const mealPlan = await selectThreeMeals(calories, feelsLikeTemp);
    // console.log(
    //   "Meal plan selection result:",
    //   JSON.stringify(mealPlan, null, 2)
    // );

    if (mealPlan.error) {
      return res.status(500).json({ error: mealPlan.error });
    }

    // Create the response object
    const response = {
      calorieRequirement: calories,
      goal: calculationGoal,
      feelsLikeTemperature: feelsLikeTemp,
      locationUsed:
        location && location.trim()
          ? location
          : "Not provided (using default temperature)",
      meals: {
        breakfast: mealPlan.breakfast,
        lunch: mealPlan.lunch,
        dinner: mealPlan.dinner,
      },
      totalCalories: mealPlan.totalCalories,
    };

    // Send the response only once
    res.json(response);
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - System Management
 *     summary: Gesundheitscheck
 *     description: Einfacher Endpunkt, um zu prüfen, ob der Server läuft
 *     responses:
 *       200:
 *         description: Server ist gesund
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `API documentation available at http://localhost:${PORT}/api-docs`
  );
});
