const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ernährungsplan-App läuft mit Node.js!");
});

// Beispiel: Kalorienbedarf berechnen
app.post("/calculate_calories", async (req, res) => {
  const { age, weight, height, gender, activity_level, goal, location } = req.body;

  let baseCalories = 10 * weight + 6.25 * height - 5 * age;
  baseCalories += gender === "male" ? 5 : -161;

  // Wetterdaten abrufen (OpenWeather API)
  try {
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=DEIN_API_KEY`
    );
    const temperature = weatherResponse.data.main.temp - 273.15;

    res.json({ daily_calories: baseCalories, temperature });
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Abrufen der Wetterdaten" });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
