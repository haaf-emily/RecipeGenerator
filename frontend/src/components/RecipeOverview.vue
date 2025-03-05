<template>
  <div class="min-h-screen bg-gray-100 px-4 md:px-8 lg:px-16 text-gray-900 font-sans">
    <header class="bg-gray-800 text-white py-6 md:py-8 rounded-lg shadow-lg">
      <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-center">Rezept Titel</h1>
    </header>

    <img src="./path-to-your-image.jpg" alt="Rezept Bild" class="mt-6 md:mt-8 rounded-2xl shadow-xl mx-auto">

    <div
      class="bg-white p-6 md:p-8 mt-12 md:mt-16 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start">
      <div class="mb-6 md:mb-0">
        <p class="font-semibold text-gray-700">Schwierigkeitsgrad</p>
        <p class="text-gray-600">Mittel</p>
        <p class="font-semibold text-gray-700 mt-4">Zubereitungszeit</p>
        <p class="text-gray-600">45 Minuten</p>
      </div>
      <div class="border-l border-gray-300 h-24 mx-6 hidden md:block"></div>
      <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mt-6 md:mt-0">
        <p><strong class="text-gray-500">kcal:</strong> <span class="text-gray-700">300 kcal</span></p>
        <p><strong class="text-gray-500">Kohlenhydrate:</strong> <span class="text-gray-700">4g</span></p>
        <p><strong class="text-gray-500">Fett:</strong> <span class="text-gray-700">Hauptgericht</span></p>
        <p><strong class="text-gray-500">Eiweiß:</strong> <span class="text-gray-700">Italienisch</span></p>
      </div>


    </div>

    <div class="mt-8 md:mt-12 flex flex-wrap gap-2 md:gap-3 justify-center">
      <span class="bg-gray-200 text-gray-800 px-3 md:px-4 py-1 md:py-2 rounded-full font-medium">#vegan</span>
      <span class="bg-gray-200 text-gray-800 px-3 md:px-4 py-1 md:py-2 rounded-full font-medium">#glutenfrei</span>
      <span class="bg-gray-200 text-gray-800 px-3 md:px-4 py-1 md:py-2 rounded-full font-medium">#gesund</span>
    </div>

    <div class="mt-8 md:mt-12 flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
      <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg lg:w-1/2">
        <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Zutaten</h2>
        <ul class="list-disc list-inside space-y-2 md:space-y-3 text-gray-700">
          <li>200g Nudeln</li>
          <li>1 Dose Tomaten</li>
          <li>1 Zwiebel</li>
          <li>2 Knoblauchzehen</li>
          <li>Salz und Pfeffer</li>
        </ul>
      </div>
      <div class="lg:w-1/2">
        <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">Zubereitung</h2>
        <ol class="space-y-4 md:space-y-6 text-gray-700">
          <li class="flex items-start">
            <span
              class="bg-gray-800 text-white rounded-full w-8 md:w-10 h-8 md:h-10 flex items-center justify-center mr-3 md:mr-4 font-bold">1</span>
            Nudeln kochen.
          </li>
          <li class="flex items-start">
            <span
              class="bg-gray-800 text-white rounded-full w-8 md:w-10 h-8 md:h-10 flex items-center justify-center mr-3 md:mr-4 font-bold">2</span>
            Zwiebeln und Knoblauch anbraten.
          </li>
          <li class="flex items-start">
            <span
              class="bg-gray-800 text-white rounded-full w-8 md:w-10 h-8 md:h-10 flex items-center justify-center mr-3 md:mr-4 font-bold">3</span>
            Tomaten hinzufügen und köcheln lassen.
          </li>
          <li class="flex items-start">
            <span
              class="bg-gray-800 text-white rounded-full w-8 md:w-10 h-8 md:h-10 flex items-center justify-center mr-3 md:mr-4 font-bold">4</span>
            Mit Salz und Pfeffer abschmecken.
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResponsiveRecipeComponent',
}
</script>

<style>
/* Add any custom styles here */
</style>
