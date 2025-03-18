<template>
  <div class="min-h-screen py-10 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <!-- Container für die Cards -->
    <div class="container mx-auto px-6">
      <div class="h-5"></div>
      <div class="bg-[#4A5759] py-6 shadow-md mb-16 w-full dark:bg-[#2C3E50]">
        <h1 class="text-4xl font-bold text-center text-white">Rezept Übersicht</h1>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center py-16">
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
            <tr>
              <td class="font-bold text-right pr-2">Dein täglicher Kalorienbedarf:</td>
              <td class="text-left">{{ formatCalories(mealPlanData.calorieRequirement) }} kcal</td>
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
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserDataStore } from '../stores/UserDataStore'
import { useMealPlanStore } from '../stores/MealPlanStore'

const router = useRouter()
const { userData, loadFromBackend } = useUserDataStore()
const { mealPlanData, isLoading, error, fetchMealPlan } = useMealPlanStore()

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

  if (
    !result.success &&
    result.error &&
    result.error.includes('Bitte füllen Sie die folgenden Felder aus')
  ) {
    // If missing user data, redirect after a delay
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }
}

onMounted(async () => {
  // First load user data from backend
  await loadFromBackend()

  // Then fetch meal plan
  loadMealPlan()
})
</script>
