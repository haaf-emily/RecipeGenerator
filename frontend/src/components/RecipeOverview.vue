<template>
    <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-6">
      <!-- Header -->
      <header class="text-center mb-6">
        <h1 class="text-4xl font-bold mb-4">Titel</h1>
      </header>
  
      <!-- Image and Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <img src="https://via.placeholder.com/600x400" alt="Rezept Bild" class="w-full h-auto rounded-lg shadow-md" />
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="font-semibold">Schwierigkeit:</p>
            <div class="flex items-center gap-1">
              <span class="text-yellow-500">● ● ● ○ ○</span>
            </div>
          </div>
          <div>
            <p class="font-semibold">Zubereitungszeit:</p>
            <p>20 min</p>
          </div>
          <div class="text-center">
            <p>470 Kcal</p>
            <p class="text-sm text-gray-600">Kalorien</p>
          </div>
          <div class="text-center">
            <p>38g</p>
            <p class="text-sm text-gray-600">Kohlenhydrate</p>
          </div>
          <div class="text-center">
            <p>7,62g</p>
            <p class="text-sm text-gray-600">Fett</p>
          </div>
          <div class="text-center">
            <p>20,8g</p>
            <p class="text-sm text-gray-600">Eiweiß</p>
          </div>
        </div>
      </div>
  
      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-8">
        <span class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full">Tag</span>
        <span class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full">Tag</span>
        <span class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1 rounded-full">Tag</span>
      </div>
  
      <!-- Zutaten und Schritte -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Zutaten -->
        <div>
          <h2 class="text-2xl mb-4">Zutaten</h2>
          <ul class="list-disc ml-6">
            <li>Zutat 1</li>
            <li>Zutat 2</li>
            <li>Zutat 3</li>
          </ul>
        </div>
  
        <!-- Schritte -->
        <div class="md:col-span-2">
          <h2 class="text-2xl mb-4">Schritte</h2>
          <ol class="list-decimal ml-6">
            <li>Schritt 1</li>
            <li>Schritt 2</li>
            <li>Schritt 3</li>
          </ol>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  // Keine speziellen Typen benötigt, einfacher Aufbau
  </script>
  
  <style scoped>
  /* Zusätzliche Styles falls nötig */
  </style>
  