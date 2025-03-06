<template>
  <div
    class="flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-10 gap-y-12 flex-grow"
  >
    <h1 class="text-3xl font-bold mb-10 text-center">Wo wohnen Sie?</h1>
    <p class="max-w-3xs text-center text-gray-600 dark:text-gray-300">
      Ihr Standort wird benutzt um die Rezepte basierend auf der aktuellen Temperatur zu
      personalisieren.
    </p>

    <div class="w-full max-w-lg flex flex-col gap-y-6">
      <button
        @click="getLocation"
        class="px-6 py-2 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-700"
      >
        Aktuellen Standort abrufen
      </button>
      <div class="relative">
        <label class="block text-lg font-semibold mb-2">Stadt:</label>
        <input
          type="text"
          v-model="city"
          @input="fetchCities"
          @blur="hideSuggestions"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Stadt eingeben..."
        />
        <ul
          v-if="suggestedCities.length"
          class="absolute z-10 bg-white border rounded-lg w-full mt-1 shadow-lg"
        >
          <li
            v-for="suggestion in suggestedCities"
            :key="suggestion"
            @click="selectCity(suggestion)"
            class="p-2 hover:bg-gray-200 cursor-pointer"
          >
            {{ suggestion }}
          </li>
        </ul>
      </div>
    </div>

    <div class="flex justify-center gap-x-4 mt-12">
      <button
        @click="prevStep"
        class="px-6 py-2 bg-gray-500 text-white text-lg rounded-lg hover:bg-gray-700"
      >
        Zurück
      </button>
      <button
        @click="nextStep"
        class="px-6 py-2 bg-green-500 text-white text-lg rounded-lg hover:bg-green-600"
      >
        Rezepte anzeigen
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const city = ref('')
const country = ref('')
const suggestedCities = ref([])

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        )
        const data = await response.json()
        city.value = data.address.city || data.address.town || ''
        country.value = data.address.country || ''
      },
      (error) => {
        console.error('Geolocation error:', error)
      },
    )
  } else {
    alert('Geolocation wird von Ihrem Browser nicht unterstützt.')
  }
}

const fetchCities = async () => {
  if (city.value.length > 2) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${city.value}&addressdetails=1&limit=5&class=place&type=city,town,village,hamlet`,
      )
      const data = await response.json()

      console.log('API Response:', data) // Log the API response

      // List of terms to exclude (to remove squares, roads, etc.)
      const excludeKeywords = ['square', 'road', 'highway', 'station', 'airport', 'park', 'plaza']

      suggestedCities.value = data
        .map((item) => {
          const name =
            item.address.city || item.address.town || item.address.village || item.address.hamlet
          return name ? `${name}, ${item.address.country}` : null
        })
        .filter(
          (item, index, self) =>
            item !== null && // Remove null results
            self.indexOf(item) === index && // Remove duplicates
            !excludeKeywords.some(
              (
                word, // Remove unwanted locations
              ) => item.toLowerCase().includes(word),
            ),
        )

      console.log('Filtered Suggestions:', suggestedCities.value) // Log filtered results
    } catch (error) {
      console.error('Error fetching city suggestions:', error)
    }
  } else {
    suggestedCities.value = []
  }
}

const hideSuggestions = () => {
  setTimeout(() => {
    suggestedCities.value = []
  }, 200)
}

const selectCity = (selected) => {
  city.value = selected
  suggestedCities.value = []
}

const prevStep = () => router.push('/activity')
const nextStep = () => router.push('/recipes')
</script>
