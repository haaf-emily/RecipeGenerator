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