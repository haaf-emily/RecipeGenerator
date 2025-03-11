<template>
  <div
    class="flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-10 gap-y-12 flex-grow"
  >
    <h1 class="text-3xl font-bold mb-10 text-center">Wo wohnen Sie?</h1>
    <p class="max-w-3xs text-center text-gray-600 dark:text-gray-300">
      Ihr Standort wird benutzt um die Rezepte basierend auf der aktuellen Temperatur zu
      personalisieren. (Optional)
    </p>

    <div class="w-full max-w-lg flex flex-col gap-y-6">
      <button
        @click="getLocation"
        class="px-6 py-2 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-700"
        :disabled="isLoading || locationLoading"
      >
        <span v-if="locationLoading">Standort wird abgefragt...</span>
        <span v-else-if="isLoading">Lädt...</span>
        <span v-else>Aktuellen Standort abrufen</span>
      </button>
      <div v-if="locationError" class="text-red-500 text-center">{{ locationError }}</div>
      <div class="relative">
        <label class="block text-lg font-semibold mb-2">Stadt:</label>
        <input
          type="text"
          v-model="cityInput"
          @input="fetchCities"
          @blur="hideSuggestions"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Stadt eingeben..."
        />
        <ul
          v-if="suggestedCities.length"
          class="absolute z-10 bg-white dark:bg-gray-800 border rounded-lg w-full mt-1 shadow-lg"
        >
          <li
            v-for="suggestion in suggestedCities"
            :key="suggestion"
            @click="selectCity(suggestion)"
            class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
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
        :disabled="isLoading || locationLoading"
      >
        <span v-if="isLoading">Lädt...</span>
        <span v-else>Rezepte anzeigen</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserDataStore } from '../stores/UserDataStore.js'

const router = useRouter()
const { userData, isLoading, updateUserData, saveToBackend, loadFromBackend } = useUserDataStore()
const cityInput = ref(userData.location || '')
const suggestedCities = ref([])
const locationLoading = ref(false)
const locationError = ref('')

// Load data on component mount
onMounted(async () => {
  await loadFromBackend()
  cityInput.value = userData.location || ''
})

const getLocation = async () => {
  if (navigator.geolocation) {
    locationLoading.value = true
    locationError.value = ''

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            {
              headers: {
                'User-Agent': 'recipeGenerator',
                'Accept-Language': 'de,en', // Add preferred languages
              },
            },
          )

          if (!response.ok) {
            console.error('API response error:', await response.text())
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          // console.log('Location data received:', data)

          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.municipality ||
            data.address?.hamlet ||
            ''
          const country = data.address?.country || ''

          if (city && country) {
            cityInput.value = `${city}, ${country}`
            updateUserData('location', cityInput.value)
          } else {
            locationError.value = 'Konnte Ihren Standort nicht ermitteln.'
          }
        } catch (error) {
          console.error('Error processing location:', error)
          locationError.value = 'Fehler beim Verarbeiten des Standorts.'
        } finally {
          locationLoading.value = false
        }
      },
      (error) => {
        console.error('Geolocation error:', error)

        let errorMessage = 'Fehler beim Abrufen des Standorts.'
        if (error.code === 1) {
          errorMessage =
            'Standortzugriff verweigert. Bitte erlauben Sie den Zugriff in Ihren Browser-Einstellungen.'
        } else if (error.code === 2) {
          errorMessage = 'Standort nicht verfügbar. Bitte versuchen Sie es später erneut.'
        } else if (error.code === 3) {
          errorMessage =
            'Zeitüberschreitung beim Abrufen des Standorts. Bitte versuchen Sie es erneut.'
        }

        locationError.value = errorMessage
        locationLoading.value = false
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  } else {
    locationError.value = 'Geolocation wird von Ihrem Browser nicht unterstützt.'
  }
}

let lastRequestTime = 0
const minRequestInterval = 1000 // 1 second

const fetchCities = async () => {
  if (cityInput.value.length > 2) {
    const now = Date.now()
    if (now - lastRequestTime < minRequestInterval) {
      await new Promise((resolve) =>
        setTimeout(resolve, minRequestInterval - (now - lastRequestTime)),
      )
    }

    lastRequestTime = Date.now()
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityInput.value)}&addressdetails=1&limit=5&class=place&type=city,town,village,hamlet`,
      )
      const data = await response.json()

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
              (word) => item.toLowerCase().includes(word), // Remove unwanted locations
            ),
        )
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
  cityInput.value = selected
  updateUserData('location', selected)
  suggestedCities.value = []
}

const prevStep = () => router.push('/activity')

const nextStep = async () => {
  try {
    // Update location in store (even if empty)
    updateUserData('location', cityInput.value)
    await saveToBackend()
    router.push('/recipes')
  } catch (error) {
    console.error('Error saving location:', error)
    locationError.value = 'Es gab ein Problem beim Senden der Daten.'
  }
}
</script>
