<template>
  <div class="min-h-screen py-10 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <!-- Container für die Cards -->
    <div class="container mx-auto px-6">
      <!-- Loading state - takes full screen with centered spinner -->
      <div v-if="isLoading" class="flex flex-col justify-center items-center h-screen">
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E89BA7]"
        ></div>
        <span class="mt-6 text-xl dark:text-white">Rezepte werden geladen...</span>
      </div>

      <!-- Content only shown when not loading -->
      <div v-else>
        <div class="h-5"></div>
        <div class="bg-[#4A5759] py-6 shadow-md mb-16 w-full dark:bg-[#2C3E50]">
          <h1 class="text-4xl font-bold text-center text-white">Rezept Übersicht</h1>
        </div>

        <!-- Error message -->
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-8"
        >
          <strong class="font-bold">Fehler!</strong>
          <span class="block sm:inline"> {{ error }}</span>
          <button
            @click="loadMealPlan(true)"
            class="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Erneut versuchen
          </button>
        </div>

        <!-- Meal plan info -->
        <div
          v-else-if="mealPlanData"
          class="mb-8 p-4 bg-white dark:bg-[#2C3E50] rounded-lg shadow flex justify-center"
        >
          <div class="mb-6 max-w-2xl">
            <table class="w-auto text-lg dark:text-white">
              <tbody>
                <tr>
                  <td class="font-bold text-right pr-2">Dein täglicher Kalorienbedarf:</td>
                  <td class="text-left">
                    {{ formatCalories(mealPlanData.calorieRequirement) }} kcal
                  </td>
                </tr>
                <tr v-if="mealPlanData.locationUsed">
                  <td class="font-bold text-right pr-2">Dein Standort:</td>
                  <td class="text-left">
                    {{ mealPlanData.locationUsed }}
                  </td>
                </tr>
                <tr v-if="mealPlanData.locationUsed">
                  <td class="font-bold text-right pr-2">Es ist gerade</td>
                  <td class="text-left">{{ mealPlanData.feelsLikeTemperature }}°C</td>
                </tr>
                <tr>
                  <td class="font-bold text-right pr-2 text-green-600 dark:text-green-400">
                    Gesamtkalorien vom Ernährungsplan:
                  </td>
                  <td class="text-left text-green-600 dark:text-green-400">
                    {{ formatCalories(mealPlanData.totalCalories) }} kcal
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="h-5"></div>
        <div v-if="!error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Recipe cards only shown when data is loaded and no errors -->
          <!-- Frühstück Card -->
          <div
            class="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 dark:bg-[#2C3E50] dark:text-white"
          >
            <img
              :src="
                mealPlanData && mealPlanData.meals
                  ? mealPlanData.meals.breakfast?.image_urls?.[0] || ''
                  : ''
              "
              :alt="
                mealPlanData && mealPlanData.meals
                  ? mealPlanData.meals.breakfast?.title || 'Frühstück'
                  : 'Frühstück'
              "
              class="w-full h-48 object-cover"
            />
            <div class="p-6">
              <h2 class="text-xl font-semibold text-primary text-[#E89BA7] dark:text-[#FF9F7F]">
                Frühstück
              </h2>
              <h3
                v-if="mealPlanData && mealPlanData.meals && mealPlanData.meals.breakfast"
                class="font-bold mt-2 text-[#4A5759] dark:text-gray-200"
              >
                {{ mealPlanData.meals.breakfast.title }}
              </h3>
              <p
                v-if="mealPlanData && mealPlanData.meals && mealPlanData.meals.breakfast"
                class="text-sm text-[#4A5759] mt-1 dark:text-gray-300"
              >
                {{ formatCalories(mealPlanData.meals.breakfast.nutrition.kcal) }} kcal
              </p>
              <p v-else class="text-[#4A5759] mt-2 dark:text-gray-300">
                Starte deinen Tag mit leckeren und gesunden Frühstücksrezepten!
              </p>
              <router-link
                to="./recipe-breakfast"
                class="mt-4 inline-block text-white bg-primary px-4 py-2 rounded hover:bg-opacity-80 dark:bg-[#FF6F61] dark:hover:bg-opacity-90"
              >
                Mehr erfahren
              </router-link>
            </div>
          </div>

          <!-- Mittagessen Card -->
          <div
            class="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 dark:bg-[#2C3E50] dark:text-white"
          >
            <img
              :src="
                mealPlanData && mealPlanData.meals
                  ? mealPlanData.meals.lunch?.image_urls?.[0] || ''
                  : ''
              "
              :alt="
                mealPlanData && mealPlanData.meals
                  ? mealPlanData.meals.lunch?.title || 'Mittagessen'
                  : 'Mittagessen'
              "
              class="w-full h-48 object-cover"
            />
            <div class="p-6">
              <h2 class="text-xl font-semibold text-primary text-[#E89BA7] dark:text-[#FF9F7F]">
                Mittagessen
              </h2>
              <h3
                v-if="mealPlanData && mealPlanData.meals && mealPlanData.meals.lunch"
                class="font-bold mt-2 text-[#4A5759] dark:text-gray-200"
              >
                {{ mealPlanData.meals.lunch.title }}
              </h3>
              <p
                v-if="mealPlanData && mealPlanData.meals && mealPlanData.meals.lunch"
                class="text-sm text-[#4A5759] mt-1 dark:text-gray-300"
              >
                {{ formatCalories(mealPlanData.meals.lunch.nutrition.kcal) }} kcal
              </p>
              <p v-else class="text-[#4A5759] mt-2 dark:text-gray-300">
                Leckere Mittagsgerichte für Energie und Genuss!
              </p>
              <router-link
                to="./recipe-lunch"
                class="mt-4 inline-block text-white bg-primary px-4 py-2 rounded hover:bg-opacity-80 dark:bg-[#FF6F61] dark:hover:bg-opacity-90"
              >
                Mehr erfahren
              </router-link>
            </div>
          </div>

          <!-- Abendessen Card -->
          <div
            class="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 dark:bg-[#2C3E50] dark:text-white"
          >
            <img
              :src="
                mealPlanData && mealPlanData.meals
                  ? mealPlanData.meals.dinner?.image_urls?.[0] || ''
                  : ''
              "
              :alt="
                mealPlanData && mealPlanData.meals
                  ? mealPlanData.meals.dinner?.title || 'Abendessen'
                  : 'Abendessen'
              "
              class="w-full h-48 object-cover"
            />
            <div class="p-6">
              <h2 class="text-xl font-semibold text-primary text-[#E89BA7] dark:text-[#FF9F7F]">
                Abendessen
              </h2>
              <h3
                v-if="mealPlanData && mealPlanData.meals && mealPlanData.meals.dinner"
                class="font-bold mt-2 text-[#4A5759] dark:text-gray-200"
              >
                {{ mealPlanData.meals.dinner.title }}
              </h3>
              <p
                v-if="mealPlanData && mealPlanData.meals && mealPlanData.meals.dinner"
                class="text-sm text-[#4A5759] mt-1 dark:text-gray-300"
              >
                {{ formatCalories(mealPlanData.meals.dinner.nutrition.kcal) }} kcal
              </p>
              <p v-else class="mt-2 text-[#4A5759] dark:text-gray-300">
                Genieße dein Abendessen mit einer Vielfalt an leckeren Rezepten!
              </p>
              <router-link
                to="./recipe-dinner"
                class="mt-4 inline-block text-white bg-primary px-4 py-2 rounded hover:bg-opacity-80 dark:bg-[#FF6F61] dark:hover:bg-opacity-90"
              >
                Mehr erfahren
              </router-link>
            </div>
          </div>
        </div>

        <div class="h-5"></div>

        <!-- Regenerate button -->
        <div v-if="!error" class="flex justify-center mt-12">
          <button
            @click="regenerateMealPlan"
            class="bg-[#E89BA7] hover:bg-[#d88995] text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center dark:bg-[#FF6F61] dark:hover:bg-[#e56356]"
            :disabled="isRegenerating"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            <div class="w-1"></div>
            <span>
              {{
                isRegenerating ? 'Neue Rezepte werden erstellt...' : 'Andere Rezepte vorschlagen'
              }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserDataStore } from '../stores/UserDataStore'
import { useMealPlanStore } from '../stores/MealPlanStore'

const router = useRouter()
const { userData, loadFromBackend } = useUserDataStore()
const { mealPlanData, isLoading, error, hasLoaded, fetchMealPlan } = useMealPlanStore()
const isRegenerating = ref(false)
const regenerateSuccess = ref(false)

// Format calories to be a whole number
const formatCalories = (calories) => {
  if (calories === null || calories === undefined) return 0

  // If calories is a string that includes "kcal/day", extract just the number
  if (typeof calories === 'string' && calories.includes('kcal')) {
    const match = calories.match(/^(\d+(\.\d+)?)/)
    if (match) {
      return Math.round(parseFloat(match[1]))
    }
  }

  return Math.round(calories)
}

// Load meal plan data
const loadMealPlan = async (forceRefresh = false) => {
  const result = await fetchMealPlan(forceRefresh)

  if (!result.success) {
    if (
      result.status === 'incomplete_profile' ||
      (result.error && result.error.includes('persönlichen Daten'))
    ) {
      // User needs to complete the questionnaire
      console.log('Redirecting to questionnaire due to incomplete profile')
      router.push('/')
    }
  }
}

// Regenerate meal plan
const regenerateMealPlan = async () => {
  isRegenerating.value = true
  regenerateSuccess.value = false
  try {
    const result = await fetchMealPlan(true) // Force refresh
    if (result.success) {
      regenerateSuccess.value = true
      // Hide success message after 3 seconds
      setTimeout(() => {
        regenerateSuccess.value = false
      }, 3000)
    }
  } finally {
    isRegenerating.value = false
  }
}

onMounted(async () => {
  // First load user data from backend
  await loadFromBackend()

  // Check if we already have recipe data
  if (!hasLoaded.value) {
    // Only fetch meal plan if we don't already have data (first time after questionnaire)
    loadMealPlan(false)
  }
})
</script>
