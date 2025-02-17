const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

const GOOGLE_GEOCODE_API_KEY = process.env.GOOGLE_GEOCODE_API_KEY;
const NINJA_API_KEY = process.env.NINJA_API_KEY;
const CALORIERAPIDAPI_KEY = process.env.CALORIERAPIDAPI_KEY;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

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
    const response = await axios.get(`https://api.api-ninjas.com/v1/weather`, {
      params: { lat: latitude, lon: longitude },
      headers: { "X-Api-Key": NINJA_API_KEY },
    });

    return response.data.feels_like;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  }
}

async function calculateCalories(age, weight, height, gender, activity_level, goal) {
  try {
    const response = await axios.get("https://health-calculator-api.p.rapidapi.com/dcn", {
      params: { age, weight, height, gender, activity_level, goal, equation: "mifflin" },
      headers: { "X-RapidAPI-Key": CALORIERAPIDAPI_KEY },
    });

    return response.data.caloric_needs.calories;
  } catch (error) {
    console.error("Fehler bei der API-Anfrage für Kalorien:", error.message);
  }
}

async function getRecipes(query, ingLimit = "0") {
  try {
    const response = await axios.get("https://gustar-io-deutsche-rezepte.p.rapidapi.com/search_api", {
      params: { text: query, ingLimit },
      headers: { "X-RapidAPI-Key": RAPIDAPI_KEY },
    });

    return response.data;
  } catch (error) {
    console.error("Fehler bei der Rezept-API:", error.message);
  }
}
async function getRecipesByCategory(category) {
    try {
      const response = await axios.get("https://gustar-io-deutsche-rezepte.p.rapidapi.com/search_api", {
        params: { text: category, ingLimit: "0" },
        headers: { "X-RapidAPI-Key": RAPIDAPI_KEY },
      });
  
      return response.data.filter(recipe => recipe.nutrition && recipe.nutrition.kcal > 0); // Rezepte ohne kcal rausfiltern
    } catch (error) {
      console.error(`Fehler bei der Rezept-API für ${category}:`, error.message);
      return [];
    }
  }
  
  async function selectThreeMeals(calories) {
    const breakfastRecipes = await getRecipesByCategory("Frühstück");
    const lunchRecipes = await getRecipesByCategory("Hauptgericht");
    const dinnerRecipes = await getRecipesByCategory("Leichtes Abendessen");
  
    if (!breakfastRecipes.length || !lunchRecipes.length || !dinnerRecipes.length) {
      return { error: "Nicht genügend Rezepte gefunden." };
    }
  
    // Wähle zufällig eine Mahlzeit aus jeder Kategorie
    const breakfast = breakfastRecipes[Math.floor(Math.random() * breakfastRecipes.length)];
    const lunch = lunchRecipes[Math.floor(Math.random() * lunchRecipes.length)];
    const dinner = dinnerRecipes[Math.floor(Math.random() * dinnerRecipes.length)];
  
    const totalCalories = breakfast.nutrition.kcal + lunch.nutrition.kcal + dinner.nutrition.kcal;
    
    return { breakfast, lunch, dinner, totalCalories };
  }
  
  app.get("/get_meal_plan", async (req, res) => {
    try {
      const { age, weight, height, gender, activity_level, goal, location } = req.query;
      if (!age || !weight || !height || !gender || !activity_level || !goal || !location) {
        return res.status(400).json({ error: "Fehlende Parameter!" });
      }
  
      const calories = await calculateCalories(age, weight, height, gender, activity_level, goal);
      const { latitude, longitude } = await getCoordinates(location);
      const feelsLikeTemp = await getFeelsLikeTemperature(latitude, longitude);
      const mealPlan = await selectThreeMeals(calories);
  
      res.json({
        kalorienbedarf: calories,
        gefühlteTemperatur: feelsLikeTemp,
        mahlzeiten: {
          frühstück: mealPlan.breakfast,
          mittagessen: mealPlan.lunch,
          abendessen: mealPlan.dinner
        },
        gesamtKalorien: mealPlan.totalCalories
      });
    } catch (error) {
      console.error("Fehler beim Abrufen des Ernährungsplans:", error);
      res.status(500).json({ error: "Interner Serverfehler" });
    }
  });
  app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
  });
  