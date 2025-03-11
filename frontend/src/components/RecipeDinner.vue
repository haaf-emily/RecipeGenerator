<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-gray-900 font-sans dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 dark:text-white">

    <div class="h-5"></div>
    <div class="bg-[#4A5759] py-6 shadow-md mb-16 w-full dark:bg-[#2C3E50]">
      <h1 class="text-4xl font-bold text-center text-white">Rezept Titel</h1>
    </div>
    <div class="h-5"></div>

    <!-- Zurück zur Übersicht Button -->
    <div class="flex justify mt-4">
      <router-link to="/overview" class="bg-[#D4D0C4] text-[#4A5759] font-semibold py-2 px-6 rounded-full shadow-sm 
           transition duration-300 transform hover:scale-105 
           hover:bg-[#4A5759] hover:text-[#D4D0C4] 
           dark:bg-[#3E4B4D] dark:text-white dark:hover:bg-[#E89BA7] dark:hover:text-white">
        ← Zurück zur Übersicht
      </router-link>
    </div>


    <div class="h-5"></div>

    <div class="flex justify-center items-center mt-12">
      <img src="./path-to-your-image.jpg" alt="Rezept Bild" class="rounded-lg shadow-md w-full h-auto object-cover" />
    </div>

    <div class="h-5"></div>
    <!-- Info-Sektion (volle Breite) -->
    <div class="bg-white p-8 rounded-xl shadow-md md:p-12 w-full mx-auto mt-8 dark:bg-[#2C3E50] dark:text-white">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 w-full">

        <div class="flex flex-col md:flex-row items-center justify-center gap-8 w-full">

          <!-- Linke Sektion (Rating) -->
          <div class="flex flex-col items-center md:items-start w-[20%]">
            <p class="text-[#E89BA7] font-bold mb-2 text-lg dark:text-[#FF9F7F]">{{ rating }}</p>
            <div class="w-36 h-4 bg-gray-200 rounded-full relative overflow-hidden dark:bg-gray-600">
              <div class="h-4 bg-gradient-to-r from-[#D4D0C4] to-[#AEC2AF] rounded-full transition-all duration-500"
                :style="{ width: (rating / 5) * 100 + '%' }"></div>
            </div>
          </div>

          <!-- Mittellinie (leicht nach links verschoben) -->
          <div class="hidden md:block w-px bg-gray-300 h-24 dark:bg-gray-500 mx-6"></div>

          <!-- Rechte Sektion (Datenpunkte) -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center w-[75%]">
            <div class="flex flex-col items-center p-4">
              <p class="text-[#E89BA7] font-bold text-xl mb-1 dark:text-[#FF9F7F]">470</p>
              <p class="text-[#4A5759] text-sm dark:text-gray-300">kcal</p>
            </div>
            <div class="flex flex-col items-center p-4">
              <p class="text-[#E89BA7] font-bold text-xl mb-1 dark:text-[#FF9F7F]">8</p>
              <p class="text-[#4A5759] text-sm dark:text-gray-300">Portionen</p>
            </div>
            <div class="flex flex-col items-center p-4">
              <p class="text-[#E89BA7] font-bold text-xl mb-1 dark:text-[#FF9F7F]">256</p>
              <p class="text-[#4A5759] text-sm dark:text-gray-300">kcal</p>
            </div>
            <div class="flex flex-col items-center p-4">
              <p class="text-[#E89BA7] font-bold text-xl mb-1 dark:text-[#FF9F7F]">524</p>
              <p class="text-[#4A5759] text-sm dark:text-gray-300">Bewertungen</p>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- Tags -->
    <div class="h-10"></div>
    <div class="flex gap-6 justify-center mt-12 text-xs">
      <span
        class="bg-white text-[#4A5759] py-1 px-4 rounded-full shadow-sm border border-[#AEC2AF] dark:bg-[#2C3E50] dark:text-white dark:border-gray-600">#vegan</span>
      <span
        class="bg-white text-[#4A5759] py-1 px-4 rounded-full shadow-sm border border-[#AEC2AF] dark:bg-[#2C3E50] dark:text-white dark:border-gray-600">#glutenfrei</span>
      <span
        class="bg-white text-[#4A5759] py-1 px-4 rounded-full shadow-sm border border-[#AEC2AF] dark:bg-[#2C3E50] dark:text-white dark:border-gray-600">#gesund</span>
    </div>
    <div class="h-10"></div>

    <!-- Zutaten -->
    <div class="mt-16 flex flex-col md:flex-row gap-16">
      <!-- Zutaten Block -->
      <div class="bg-white p-8 rounded-xl shadow-md w-full md:w-1/2 dark:bg-[#2C3E50] dark:text-white">
        <h2 class="text-2xl font-bold  text-[#E89BA7] mb-6 dark:text-[#FF9F7F]">Zutaten</h2>
        <ul class="list-disc pl-6 text-[#4A5759] space-y-2 dark:text-gray-300">
          <li>200g Nudeln</li>
          <li>1 Dose Tomaten</li>
          <li>1 Zwiebel</li>
          <li>2 Knoblauchzehen</li>
          <li>Salz und Pfeffer</li>
        </ul>
      </div>
      <!-- Zubereitung Block -->
      <div class="p-8 w-full md:w-1/2 dark:text-white">
        <h2 class="text-2xl font-bold text-[#E89BA7] mb-6 dark:text-[#FF9F7F]">Zubereitung</h2>
        <p class="text-[#4A5759] dark:text-gray-300">
          Bist du neugierig geworden und hast Lust, etwas Neues auszuprobieren? Klicke jetzt auf den Button, um das
          vollständige Rezept zu entdecken und Schritt für Schritt dein ganz persönliches Lieblingsgericht zu zaubern.
          Mit frischen Zutaten und einer einfachen Zubereitung wird dieses Rezept sicher zu einem kulinarischen
          Highlight in deiner Küche!
        </p>
        <div class="h-3"></div>
        <!-- Angepasster Button für das Rezept-Design -->
        <div class="flex justify-center mt-8">
          <a href="#" class="bg-[#D4D0C4] text-[#4A5759] font-semibold text-lg py-3 px-8 rounded-full shadow-sm 
           transition duration-300 transform hover:scale-105 
           hover:bg-[#4A5759] hover:text-[#D4D0C4] 
           dark:bg-[#3E4B4D] dark:text-white dark:hover:bg-[#E89BA7] dark:hover:text-white">
            Weg zur Zubereitung
          </a>
        </div>

      </div>
    </div>
    <div class="h-6"></div>
  </div>
</template>

<script>
export default {
  name: 'RecipeDinner',
}
</script>