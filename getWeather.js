const axios = require("axios");
require("dotenv").config();

const GOOGLE_GEOCODE_API_KEY = process.env.GOOGLE_GEOCODE_API_KEY;
const NINJA_API_KEY = process.env.NINJA_API_KEY;

async function getCoordinates(location) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: location,
          key: GOOGLE_GEOCODE_API_KEY,
        },
      }
    );

    if (response.data.status === "OK") {
      const { lat, lng } = response.data.results[0].geometry.location;
      console.log(
        `Coordinates for ${location}: Latitude ${lat}, Longitude ${lng}`
      );
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("Geocoding failed: " + response.data.status);
    }
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

    if (response.data) {
      console.log(`Weather data received:`, response.data);
      return response.data.feels_like;
    } else {
      throw new Error("Weather data not found");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  }
}

async function getFeelsLikeForLocation(location) {
  try {
    const { latitude, longitude } = await getCoordinates(location);
    const feelsLikeTemp = await getFeelsLikeTemperature(latitude, longitude);
    console.log(`Feels like temperature in ${location}: ${feelsLikeTemp}°C`);
    return feelsLikeTemp;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Example usage:
// getFeelsLikeForLocation(${city}, " ", ${country});
getFeelsLikeForLocation("New York, US");
