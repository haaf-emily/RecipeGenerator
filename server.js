const express = require("express");
const axios = require("axios"); // oder fetch
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors()); 

app.get("/", (req, res) => {
  res.send("Ernährungsplan-App läuft mit Node.js!");
});

// Beispiel: Kalorienbedarf berechnen
app.get("/calculate_calories", async (req, res) => {
  try {
    //const { age, weight, height, gender, activity_level } = req.body;
    const age = '25';
    const weight = '70';
    const height = '175';
    const gender = 'male';
    const activitylevel = 'sedentary';
    const goal = 'maintenance';
    const equation = 'mifflin';
    
    const options = {
      method: "GET",
      url: "https://health-calculator-api.p.rapidapi.com/dcn",
      params: {
        age: age,
        weight: weight,
        height: height,
        gender: gender,
        activity_level: activitylevel,
        goal: goal,
        equation: equation
      },
      headers: {
        "X-RapidAPI-Key": process.env.CALORIERAPIDAPI_KEY, // API-Key aus .env Datei
        "X-RapidAPI-Host": "health-calculator-api.p.rapidapi.com",
      },
    };

    
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error("Fehler bei der API-Anfrage:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

app.get("/get_recipes", async (req, res) => {
  console.log("Endpunkt /get_recipes wurde aufgerufen."); // Debugging
  try {
    const options = {
      method: "GET",
      url: "https://gustar-io-deutsche-rezepte.p.rapidapi.com/search_api",
      params: {
        text: "Käse",
        ingLimit:"0",
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY, // API-Key aus der .env Datei
        "X-RapidAPI-Host": "gustar-io-deutsche-rezepte.p.rapidapi.com",
      },
    };

    //console.log("Request-Options:", options);

    // API-Anfrage senden
    
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error("Fehler bei der API-Anfrage:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});