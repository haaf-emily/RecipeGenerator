<template>
  <div class="min-h-screen py-10 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <!-- Container für die Cards -->
    <div class="container mx-auto px-6">
      <div class="h-5"></div>
      <div class="bg-[#4A5759] py-6 shadow-md mb-16 w-full dark:bg-[#2C3E50]">
        <h1 class="text-4xl font-bold text-center text-white">Rezept Übersicht</h1>
      </div>
      <div class="h-5"></div>
      <div class="h-5"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Frühstück Card -->
        <div
          class="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 dark:bg-[#2C3E50] dark:text-white"
        >
          <img src="" alt="Frühstück" class="w-full h-48 object-cover" />
          <div class="p-6">
            <h2 class="text-xl font-semibold text-primary text-[#E89BA7] dark:text-[#FF9F7F]">
              Frühstück
            </h2>
            <p class="text-[#4A5759] mt-2 dark:text-gray-300">
              Starte deinen Tag mit leckeren und gesunden Frühstücksrezepten!
            </p>
            <router-link to="./recipe-breakfast"
              class="mt-4 inline-block text-white bg-primary px-4 py-2 rounded hover:bg-opacity-80 dark:bg-[#FF6F61] dark:hover:bg-opacity-90">Mehr
              erfahren</router-link>
          </div>
        </div>

        <!-- Mittagessen Card -->
        <div
          class="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 dark:bg-[#2C3E50] dark:text-white">
          <img src="" alt="Mittagessen" class="w-full h-48 object-cover">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-primary text-[#E89BA7] dark:text-[#FF9F7F]">Mittagessen</h2>
            <p class="text-[#4A5759] mt-2 dark:text-gray-300">Leckere Mittagsgerichte für Energie und Genuss!</p>
            <router-link to="./recipe-lunch"
              class="mt-4 inline-block text-white bg-primary px-4 py-2 rounded hover:bg-opacity-80 dark:bg-[#FF6F61] dark:hover:bg-opacity-90">Mehr
              erfahren</router-link>
          </div>
        </div>

        <!-- Abendessen Card -->
        <div
          class="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 dark:bg-[#2C3E50] dark:text-white"
        >
          <img src="" alt="Abendessen" class="w-full h-48 object-cover" />
          <div class="p-6">
            <h2 class="text-xl font-semibold text-primary text-[#E89BA7] dark:text-[#FF9F7F]">
              Abendessen
            </h2>
            <p class="mt-2 text-[#4A5759] dark:text-gray-300">
              Genieße dein Abendessen mit einer Vielfalt an leckeren Rezepten!
            </p>
            <router-link to="./recipe-dinner"
              class="mt-4 inline-block text-white bg-primary px-4 py-2 rounded hover:bg-opacity-80 dark:bg-[#FF6F61] dark:hover:bg-opacity-90">Mehr
              erfahren</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "RecipeOverview",
};
</script>

<style scoped>
/* Du kannst hier bei Bedarf weitere Styles hinzufügen */
</style>
