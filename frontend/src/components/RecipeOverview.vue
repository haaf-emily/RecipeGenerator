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

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E89BA7]"
        ></div>
        <span class="ml-4 text-lg dark:text-white">Rezepte werden geladen...</span>
      </div>

      <!-- Error message -->
      <div
        v-else-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-8"
      >
        <strong class="font-bold">Fehler!</strong>
        <span class="block sm:inline"> {{ error }}</span>
        <button
          @click="fetchMealPlan"
          class="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Erneut versuchen
        </button>
      </div>

      <!-- Meal plan info -->
      <div
        v-else-if="mealPlan"
        class="mb-8 p-4 bg-white dark:bg-[#2C3E50] rounded-lg shadow flex justify-center"
      >
        <div class="mb-6 max-w-2xl">
          <table class="w-auto text-lg dark:text-white">
            <tr>
              <td class="font-bold text-right pr-2">Dein täglicher Kalorienbedarf:</td>
              <td class="text-left">{{ formatCalories(mealPlan.calorieRequirement) }} kcal</td>
            </tr>
            <!-- <tr>
          <td class="font-bold text-right pr-4">Ziel:</td>
          <td class="text-left">{{ formatGoal(mealPlan.goal) }}</td>
        </tr> -->
            <tr v-if="mealPlan.locationUsed">
              <td class="font-bold text-right pr-2">Dein Standort:</td>
              <td class="text-left">
                {{ mealPlan.locationUsed }}
              </td>
            </tr>
            <tr v-if="mealPlan.locationUsed">
              <td class="font-bold text-right pr-2">Es ist gerade</td>
              <td class="text-left">{{ mealPlan.feelsLikeTemperature }}°C</td>
            </tr>
            <tr>
              <td class="font-bold text-right pr-2 text-green-600 dark:text-green-400">
                Gesamtkalorien vom Ernährungsplan:
              </td>
              <td class="text-left text-green-600 dark:text-green-400">
                {{ formatCalories(mealPlan.totalCalories) }} kcal
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div class="h-5"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Frühstück Card -->
        <div
          class="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 dark:bg-[#2C3E50] dark:text-white"
        >
          <img
            :src="mealPlan && mealPlan.meals ? mealPlan.meals.breakfast?.image_urls?.[0] || '' : ''"
            :alt="
              mealPlan && mealPlan.meals
                ? mealPlan.meals.breakfast?.title || 'Frühstück'
                : 'Frühstück'
            "
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <h2 class="text-xl font-semibold text-primary text-[#E89BA7] dark:text-[#FF9F7F]">
              Frühstück
            </h2>
            <h3
              v-if="mealPlan && mealPlan.meals && mealPlan.meals.breakfast"
              class="font-bold mt-2 text-[#4A5759] dark:text-gray-200"
            >
              {{ mealPlan.meals.breakfast.title }}
            </h3>
            <p
              v-if="mealPlan && mealPlan.meals && mealPlan.meals.breakfast"
              class="text-sm text-[#4A5759] mt-1 dark:text-gray-300"
            >
              {{ formatCalories(mealPlan.meals.breakfast.nutrition.kcal) }} kcal
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
            :src="mealPlan && mealPlan.meals ? mealPlan.meals.lunch?.image_urls?.[0] || '' : ''"
            :alt="
              mealPlan && mealPlan.meals
                ? mealPlan.meals.lunch?.title || 'Mittagessen'
                : 'Mittagessen'
            "
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <h2 class="text-xl font-semibold text-primary text-[#E89BA7] dark:text-[#FF9F7F]">
              Mittagessen
            </h2>
            <h3
              v-if="mealPlan && mealPlan.meals && mealPlan.meals.lunch"
              class="font-bold mt-2 text-[#4A5759] dark:text-gray-200"
            >
              {{ mealPlan.meals.lunch.title }}
            </h3>
            <p
              v-if="mealPlan && mealPlan.meals && mealPlan.meals.lunch"
              class="text-sm text-[#4A5759] mt-1 dark:text-gray-300"
            >
              {{ formatCalories(mealPlan.meals.lunch.nutrition.kcal) }} kcal
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
            :src="mealPlan && mealPlan.meals ? mealPlan.meals.dinner?.image_urls?.[0] || '' : ''"
            :alt="
              mealPlan && mealPlan.meals
                ? mealPlan.meals.dinner?.title || 'Abendessen'
                : 'Abendessen'
            "
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <h2 class="text-xl font-semibold text-primary text-[#E89BA7] dark:text-[#FF9F7F]">
              Abendessen
            </h2>
            <h3
              v-if="mealPlan && mealPlan.meals && mealPlan.meals.dinner"
              class="font-bold mt-2 text-[#4A5759] dark:text-gray-200"
            >
              {{ mealPlan.meals.dinner.title }}
            </h3>
            <p
              v-if="mealPlan && mealPlan.meals && mealPlan.meals.dinner"
              class="text-sm text-[#4A5759] mt-1 dark:text-gray-300"
            >
              {{ formatCalories(mealPlan.meals.dinner.nutrition.kcal) }} kcal
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
