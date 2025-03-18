<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-gray-900 font-sans dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 dark:text-white"
  >
    <div class="h-5"></div>
    <div class="bg-[#4A5759] py-6 shadow-md mb-16 w-full dark:bg-[#2C3E50]">
      <h1 class="text-4xl font-bold text-center text-white">
        {{ lunch.title || 'Mittagessen wird geladen...' }}
      </h1>
    </div>
    <div class="h-5"></div>

    <!-- Zurück zur Übersicht Button -->
    <div class="flex justify mt-4">
      <router-link
        to="/recipes"
        class="bg-[#D4D0C4] text-[#4A5759] font-semibold py-2 px-6 rounded-full shadow-sm transition duration-300 transform hover:scale-105 hover:bg-[#4A5759] hover:text-[#D4D0C4] dark:bg-[#3E4B4D] dark:text-white dark:hover:bg-[#E89BA7] dark:hover:text-white"
      >
        ← Zurück zur Übersicht
      </router-link>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E89BA7]"></div>
      <span class="ml-4 text-lg">Rezept wird geladen...</span>
    </div>

    <!-- Error message -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-8"
    >
      <strong class="font-bold">Fehler!</strong>
      <span class="block sm:inline"> {{ error }}</span>
      <router-link
        to="/recipes"
        class="mt-4 inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Zurück zur Rezeptübersicht
      </router-link>
    </div>

    <div v-if="!loading && !error" class="h-5"></div>

    <div v-if="!loading && !error" class="flex justify-center items-center mt-12">
      <img
        :src="lunch.image_urls?.[0] || ''"
        :alt="lunch.title"
        class="rounded-lg shadow-md w-full h-auto object-cover max-h-[50vh]"
      />
    </div>

    <div class="h-5"></div>
    <!-- Info-Sektion (volle Breite) -->
    <div
      v-if="!loading && !error"
      class="bg-white p-8 rounded-xl shadow-md md:p-12 w-full mx-auto mt-8 dark:bg-[#2C3E50] dark:text-white"
    >
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
        <div class="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
          <!-- Linke Sektion (Rating) -->
          <!-- <div class="flex flex-col items-center md:items-start w-[20%]">
            <p class="text-[#E89BA7] font-bold mb-2 text-lg dark:text-[#FF9F7F]">
              {{ lunch.rating?.ratingValue || 0 }}
            </p>
            <div
              class="w-36 h-4 bg-gray-200 rounded-full relative overflow-hidden dark:bg-gray-600"
            >
              <div
                class="h-4 bg-gradient-to-r from-[#D4D0C4] to-[#AEC2AF] rounded-full transition-all duration-500"
                :style="{ width: ((lunch.rating?.ratingValue || 0) / 5) * 100 + '%' }"
              ></div>
            </div>
          </div> -->

          <!-- Mittellinie (leicht nach links verschoben) -->
          <!-- <div class="hidden md:block w-px bg-gray-300 h-24 dark:bg-gray-500 mx-6"></div> -->

          <!-- Rechte Sektion (Datenpunkte) -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center w-[75%]">
            <div class="flex flex-col items-center p-4">
              <p class="text-[#E89BA7] font-bold text-xl mb-1 dark:text-[#FF9F7F]">
                {{ lunch.nutrition?.kcal || 0 }}
              </p>
              <p class="text-[#4A5759] text-sm dark:text-gray-300">kcal</p>
            </div>
            <div class="flex flex-col items-center p-4">
              <p class="text-[#E89BA7] font-bold text-xl mb-1 dark:text-[#FF9F7F]">
                {{ lunch.portions || 1 }}
              </p>
              <p class="text-[#4A5759] text-sm dark:text-gray-300">Portionen</p>
            </div>
            <div class="flex flex-col items-center p-4">
              <p class="text-[#E89BA7] font-bold text-xl mb-1 dark:text-[#FF9F7F]">
                {{ Math.round((lunch.nutrition?.kcal || 0) / (lunch.portions || 1)) }}
              </p>
              <p class="text-[#4A5759] text-sm dark:text-gray-300">kcal pro Portion</p>
            </div>
            <div class="flex flex-col items-center p-4">
              <p class="text-[#E89BA7] font-bold text-xl mb-1 dark:text-[#FF9F7F]">
                {{ lunch.rating?.ratingCount || 0 }}
              </p>
              <p class="text-[#4A5759] text-sm dark:text-gray-300">Bewertungen</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tags -->
    <!-- <div v-if="!loading && !error" class="h-10"></div>
    <div v-if="!loading && !error" class="flex gap-6 justify-center mt-12 text-xs">
      <span
        class="bg-white text-[#4A5759] py-1 px-4 rounded-full shadow-sm border border-[#AEC2AF] dark:bg-[#2C3E50] dark:text-white dark:border-gray-600"
        >#vegan</span
      >
      <span
        class="bg-white text-[#4A5759] py-1 px-4 rounded-full shadow-sm border border-[#AEC2AF] dark:bg-[#2C3E50] dark:text-white dark:border-gray-600"
        >#glutenfrei</span
      >
      <span
        class="bg-white text-[#4A5759] py-1 px-4 rounded-full shadow-sm border border-[#AEC2AF] dark:bg-[#2C3E50] dark:text-white dark:border-gray-600"
        >#gesund</span
      >
    </div>
    <div v-if="!loading && !error" class="h-10"></div> -->

    <!-- Zutaten -->
    <div v-if="!loading && !error" class="h-5"></div>
    <div v-if="!loading && !error" class="mt-16 flex flex-col md:flex-row gap-16">
      <!-- Zutaten Block -->
      <div
        class="bg-white p-8 rounded-xl shadow-md w-full md:w-1/2 dark:bg-[#2C3E50] dark:text-white"
      >
        <h2 class="text-2xl font-bold text-[#E89BA7] mb-6 dark:text-[#FF9F7F]">Zutaten</h2>
        <ul class="list-disc pl-6 text-[#4A5759] space-y-2 dark:text-gray-300">
          <li v-for="(ingredient, index) in lunch.ingredients" :key="index">
            {{ ingredient.amount }} {{ ingredient.unit }} {{ ingredient.name }}
          </li>
        </ul>
      </div>
      <!-- Zubereitung Block -->
      <div class="p-8 w-full md:w-1/2 dark:text-white">
        <h2 class="text-2xl font-bold text-[#E89BA7] mb-6 dark:text-[#FF9F7F]">Zubereitung</h2>
        <p class="text-[#4A5759] dark:text-gray-300">
          Bist du neugierig geworden und hast Lust, etwas Neues auszuprobieren? Klicke jetzt auf den
          Button, um das vollständige Rezept zu entdecken und Schritt für Schritt dein ganz
          persönliches Lieblingsgericht zu zaubern. Mit frischen Zutaten und einer einfachen
          Zubereitung wird dieses Rezept sicher zu einem kulinarischen Highlight in deiner Küche!
        </p>
        <div class="h-3"></div>
        <!-- Angepasster Button für das Rezept-Design -->
        <div class="flex justify-center mt-8">
          <a
            :href="lunch.source"
            target="_blank"
            class="bg-[#D4D0C4] text-[#4A5759] font-semibold text-lg py-3 px-8 rounded-full shadow-sm transition duration-300 transform hover:scale-105 hover:bg-[#4A5759] hover:text-[#D4D0C4] dark:bg-[#3E4B4D] dark:text-white dark:hover:bg-[#E89BA7] dark:hover:text-white"
          >
            Weg zur Zubereitung
          </a>
        </div>
      </div>
    </div>
    <div class="h-6"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const lunch = ref({
  title: '',
  image_urls: [''],
  ingredients: [],
  nutrition: {
    kcal: 0,
  },
  portions: 0,
  rating: {
    ratingValue: 0,
    ratingCount: 0,
  },
  source: '',
})
const loading = ref(true)
const error = ref('')
const API_URL = 'http://localhost:8000'

// Fetch lunch data from API
const fetchMealPlan = async () => {
  loading.value = true
  error.value = ''

  try {
    // First, try to get from localStorage if available
    const storedMealPlan = localStorage.getItem('mealPlan')
    if (storedMealPlan) {
      const data = JSON.parse(storedMealPlan)
      if (data && data.meals && data.meals.lunch) {
        lunch.value = data.meals.lunch
        loading.value = false
        return
      }
    }

    // If not in localStorage, fetch from API
    const response = await fetch(`${API_URL}/get_meal_plan`)

    if (!response.ok) {
      throw new Error(`Server antwortet mit Status: ${response.status}`)
    }

    const data = await response.json()

    if (!data || !data.meals || !data.meals.lunch) {
      throw new Error('Keine Mittagessen-Daten verfügbar')
    }

    lunch.value = data.meals.lunch

    // Store in localStorage for future use
    localStorage.setItem('mealPlan', JSON.stringify(data))
  } catch (err) {
    console.error('Error fetching lunch data:', err)
    error.value = err.message || 'Ein Fehler ist aufgetreten beim Abrufen des Rezepts'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMealPlan()
})
</script>
