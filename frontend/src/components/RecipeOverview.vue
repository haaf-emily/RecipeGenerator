<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-gray-900 font-sans">

      <div class="h-5"></div>
      <div class="bg-teal-600 text-white py-6 shadow-md mb-16 w-full">
        <h1 class="text-4xl font-bold text-center">Rezept Titel</h1>
      </div>
      <div class="h-5"></div>

    <img src="./path-to-your-image.jpg" alt="Rezept Bild"
     class="mt-12 rounded-lg shadow-2xl duration-500 hover:shadow-xl max-w-full object-cover mx-auto" />

    <div class="h-5"></div>
<!-- Info-Sektion -->
<div class="bg-gradient-to-br from-gray-50 to-white p-6 md:p-12 rounded-lg shadow-lg">
    <!-- Bewertung -->
    <div class="flex flex-col items-center mb-6 md:mb-0 md:mr-12">
      <div class="flex items-center mb-2">
        <span class="text-gray-700 mr-2 font-semibold">Bewertung:</span>
        <div class="flex">
          <span v-for="index in 5" :key="index" class="w-3 h-3 rounded-full mr-1"
            :class="index <= rating ? 'bg-yellow-500' : 'bg-gray-300'"></span>
        </div>
      </div>
      <p class="text-gray-600 text-sm md:text-base">{{ rating }} von 5</p>
    </div>

    <!-- Nährwerte -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
      <div>
        <p class="text-gray-500 mb-1 text-sm md:text-base">kcal</p>
        <p class="text-gray-800 font-semibold text-lg md:text-xl">470</p>
      </div>
      <div>
        <p class="text-gray-500 mb-1 text-sm md:text-base">Kohlenhydrate</p>
        <p class="text-gray-800 font-semibold text-lg md:text-xl">38g</p>
      </div>
      <div>
        <p class="text-gray-500 mb-1 text-sm md:text-base">Fett</p>
        <p class="text-gray-800 font-semibold text-lg md:text-xl">7.6g</p>
      </div>
      <div>
        <p class="text-gray-500 mb-1 text-sm md:text-base">Eiweiß</p>
        <p class="text-gray-800 font-semibold text-lg md:text-xl">10.1g</p>
      </div>
    </div>
  </div>






    <!-- Tags -->
    <div class="flex gap-6 justify-center mt-12">
      <span
        class="bg-teal-200 text-teal-800 py-1 px-4 rounded-full shadow-sm transition-transform duration-300 hover:scale-105">#vegan</span>
      <span
        class="bg-teal-200 text-teal-800 py-1 px-4 rounded-full shadow-sm transition-transform duration-300 hover:scale-105">#glutenfrei</span>
      <span
        class="bg-teal-200 text-teal-800 py-1 px-4 rounded-full shadow-sm transition-transform duration-300 hover:scale-105">#gesund</span>
    </div>

    <!-- Zutaten und Zubereitung -->
    <div class="mt-16 flex flex-col gap-16">
      <div class="bg-white p-8 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
        <h2 class="text-2xl font-bold text-teal-600 mb-6">Zutaten</h2>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>200g Nudeln</li>
          <li>1 Dose Tomaten</li>
          <li>1 Zwiebel</li>
          <li>2 Knoblauchzehen</li>
          <li>Salz und Pfeffer</li>
        </ul>
      </div>

      <div class="bg-white p-8 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
        <h2 class="text-2xl font-bold text-teal-600 mb-6">Zubereitung</h2>
        <ol class="list-decimal pl-6 text-gray-700 space-y-4">
          <li>Nudeln kochen.</li>
          <li>Zwiebeln und Knoblauch anbraten.</li>
          <li>Tomaten hinzufügen und köcheln lassen.</li>
          <li>Mit Salz und Pfeffer abschmecken.</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResponsiveRecipe',
}
</script>
