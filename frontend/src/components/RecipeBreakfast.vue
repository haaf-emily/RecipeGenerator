<template>
  <div class="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-gray-900 font-sans dark:text-white">
    <div class="h-5"></div>
    <div class="bg-[#4A5759] py-6 shadow-md mb-16 w-full dark:bg-[#2C3E50] rounded">
      <h1 class="text-4xl font-bold text-center text-white">
        {{ breakfast?.title || 'Frühstück wird geladen...' }}
      </h1>
    </div>
    <div class="h-5"></div>

    <!-- Zurück zur Übersicht Button -->
    <div class="flex justify mt-4">
      <router-link
        to="/recipes"
        class="mt-4 inline-block text-white bg-primary px-4 py-2 rounded hover:bg-opacity-80 bg-[#86AC86] hover:bg-[#6D9C6D] dark:bg-[#86AC86] dark:hover:bg-[#6D9C6D]"
      >
        ← Zurück zur Übersicht
      </router-link>
    </div>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E89BA7]"></div>
      <span class="ml-4 text-lg">Rezept wird geladen...</span>
    </div>

    <!-- Error message -->
    <div
      v-else-if="storeError"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-8"
    >
      <strong class="font-bold">Fehler!</strong>
      <span class="block sm:inline"> {{ storeError }}</span>
      <router-link
        to="/recipes"
        class="mt-4 inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Zurück zur Rezeptübersicht
      </router-link>
    </div>

    <div v-if="!isLoading && !storeError" class="h-5"></div>

    <div v-if="!isLoading && !storeError" class="flex justify-center items-center mt-12">
      <img
        :src="breakfast?.image_urls?.[0] || ''"
        :alt="breakfast?.title"
        class="rounded-lg shadow-md w-full h-auto object-cover max-h-[50vh]"
      />
    </div>

    <div class="h-5"></div>
    <!-- Info-Sektion (volle Breite) -->
    <div
      v-if="!isLoading && !storeError"
      class="bg-white p-8 rounded-xl shadow-md md:p-12 w-full mx-auto mt-8 dark:bg-[#2C3E50] dark:text-white"
    >
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
        <div class="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
          <!-- Rechte Sektion (Datenpunkte) -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center w-[75%]">
            <div class="flex flex-col items-center p-4">
              <p class="text-[#E89BA7] font-bold text-xl mb-1 dark:text-[#FF9F7F]">
                {{ breakfast?.nutrition?.kcal || 0 }}
              </p>
              <p class="text-[#4A5759] text-sm dark:text-gray-300">kcal</p>
            </div>
            <div class="flex flex-col items-center p-4">
              <p class="text-[#E89BA7] font-bold text-xl mb-1 dark:text-[#FF9F7F]">
                {{ breakfast?.portions || 1 }}
              </p>
              <p class="text-[#4A5759] text-sm dark:text-gray-300">Portionen</p>
            </div>
            <div class="flex flex-col items-center p-4">
              <p class="text-[#E89BA7] font-bold text-xl mb-1 dark:text-[#FF9F7F]">
                {{ Math.round((breakfast?.nutrition?.kcal || 0) / (breakfast?.portions || 1)) }}
              </p>
              <p class="text-[#4A5759] text-sm dark:text-gray-300">kcal pro Portion</p>
            </div>
            <div class="flex flex-col items-center p-4">
              <p class="text-[#E89BA7] font-bold text-xl mb-1 dark:text-[#FF9F7F]">
                {{ breakfast?.rating?.ratingCount || 0 }}
              </p>
              <p class="text-[#4A5759] text-sm dark:text-gray-300">Bewertungen</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zutaten -->
    <div v-if="!isLoading && !storeError" class="h-5"></div>
    <div v-if="!isLoading && !storeError" class="mt-16 flex flex-col md:flex-row gap-16">
      <!-- Zutaten Block -->
      <div
        class="bg-white p-8 rounded-xl shadow-md w-full md:w-1/2 dark:bg-[#2C3E50] dark:text-white"
      >
        <h2 class="text-2xl font-bold text-[#E89BA7] mb-6 dark:text-[#FF9F7F]">Zutaten</h2>
        <ul class="list-disc pl-6 text-[#4A5759] space-y-2 dark:text-gray-300">
          <li v-for="(ingredient, index) in breakfast?.ingredients" :key="index">
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
            :href="breakfast?.source"
            target="_blank"
            class="mt-4 inline-block text-white bg-primary px-4 py-2 rounded hover:bg-opacity-80 bg-[#86AC86] hover:bg-[#6D9C6D] dark:bg-[#86AC86] dark:hover:bg-[#6D9C6D]"
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
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMealPlanStore } from '../stores/MealPlanStore'

const router = useRouter()
const { mealPlanData, isLoading, error: storeError, fetchMealPlan } = useMealPlanStore()

// Get breakfast data from the store
const breakfast = computed(() => mealPlanData.meals?.breakfast || null)

onMounted(async () => {
  // Only fetch data if we don't already have it
  if (!breakfast.value) {
    const result = await fetchMealPlan()
    if (!result.success) {
      // If there's an error and we can't get the data, go back to the overview
      setTimeout(() => {
        router.push('/recipes')
      }, 3000)
    }
  }
})
</script>
