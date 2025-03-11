const express = require("express");
const axios = require("axios");
const cors = require("cors");
const NodeCache = require("node-cache"); // Add this dependency
require("dotenv").config();

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

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
  age: (val) => Number.isInteger(Number(val)) && val > 0 && val < 120,
  weight: (val) => !isNaN(val) && val > 30 && val < 300,
  height: (val) => !isNaN(val) && val > 100 && val < 250,
  gender: (val) => ["male", "female"].includes(val.toLowerCase()),
  activity_level: (val) =>
    [
      "sedentary",
      "lightly_active",
      "moderately_active",
      "very_active",
      "extra_active",
    ].includes(val),
  goal: (val) => ["lose", "maintain", "gain"].includes(val),
  location: (val) => typeof val === "string" && val.trim().length > 0,
};

// Validate user data
function validateUserData(data) {
  const errors = {};
  const validated = {};

  Object.keys(userDataSchema).forEach((field) => {
    if (data[field] !== undefined) {
      if (userDataSchema[field](data[field])) {
        validated[field] = data[field];
      } else {
        errors[field] = `Invalid value for ${field}`;
      }
    }
  });

  return { validated, errors, isValid: Object.keys(errors).length === 0 };
}

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

// Store user data when received
app.post("/api/user-data", async (req, res) => {
  try {
    // Validate incoming data
    const { validated, errors, isValid } = validateUserData(req.body);

    if (!isValid) {
      return res.status(400).json({
        error: "Invalid data provided",
        details: errors,
      });
    }

    // Update user data with validated values
    userData = { ...userData, ...validated };
    console.log("Updated user data:", userData);

    res.json({
      message: "Data received and validated successfully",
      receivedData: validated,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get stored user data for frontend persistence
app.get("/api/user-data", (req, res) => {
  res.json(userData);
});

// Generate meal plan using stored user data
app.get("/get_meal_plan", async (req, res) => {
  try {
    const { age, weight, height, gender, activity_level, goal, location } =
      userData;

    // Validate required fields are present
    if (
      !age ||
      !weight ||
      !height ||
      !gender ||
      !activity_level ||
      !goal ||
      !location
    ) {
      return res.status(400).json({
        error: "Missing required parameters",
        required: [
          "age",
          "weight",
          "height",
          "gender",
          "activity_level",
          "goal",
          "location",
        ],
      });
    }

    const calories = await calculateCalories(
      age,
      weight,
      height,
      gender,
      activity_level,
      goal
    );

    if (!calories) {
      return res.status(500).json({ error: "Error calculating calories" });
    }

    const coordinates = await getCoordinates(location);
    if (!coordinates) {
      return res.status(500).json({ error: "Error with geocoding" });
    }

    const feelsLikeTemp = await getFeelsLikeTemperature(
      coordinates.latitude,
      coordinates.longitude
    );

    if (feelsLikeTemp === null) {
      return res.status(500).json({ error: "Error fetching temperature" });
    }

    const mealPlan = await selectThreeMeals(calories, feelsLikeTemp);

    if (mealPlan.error) {
      return res.status(500).json({ error: mealPlan.error });
    }

    res.json({
      calorieRequirement: calories,
      feelsLikeTemperature: feelsLikeTemp,
      meals: {
        breakfast: mealPlan.breakfast,
        lunch: mealPlan.lunch,
        dinner: mealPlan.dinner,
      },
      totalCalories: mealPlan.totalCalories,
    });
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
