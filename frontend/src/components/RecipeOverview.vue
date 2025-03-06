<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-gray-900 font-sans">

    <div class="h-5"></div>
    <div class="bg-[#4A5759] py-6 shadow-md mb-16 w-full">
      <h1 class="text-4xl font-bold text-center text-white">Rezept Titel</h1>
    </div>
    <div class="h-5"></div>

    <div class="flex justify-center items-center mt-12">
      <img src="./path-to-your-image.jpg" alt="Rezept Bild" class="rounded-lg shadow-md w-full h-auto object-cover" />
    </div>

    <div class="h-5"></div>
    <!-- Info-Sektion-->
    <div class="bg-white p-8 rounded-xl shadow-md md:p-12 max-w-5xl mx-auto mt-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex flex-col items-center md:items-start">
            <p class="text-[#E89BA7] font-bold mb-2 text-lg">{{ rating }}</p>
            <div class="w-36 h-4 bg-gray-200 rounded-full relative overflow-hidden">
              <div class="h-4 bg-gradient-to-r from-[#D4D0C4] to-[#AEC2AF] rounded-full transition-all duration-500"
                :style="{ width: (rating / 5) * 100 + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="hidden md:block w-px bg-gray-300 h-24"></div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center">
          <div class="flex flex-col items-center p-4">
            <p class=" text-[#E89BA7] font-bold text-xl mb-1">470</p>
            <p class="text-[#4A5759] text-sm">kcal</p>
          </div>
          <div class="flex flex-col items-center p-4">
            <p class="text-[#E89BA7] font-bold text-xl mb-1">8</p>
            <p class="text-[#4A5759] text-sm">Portionen</p>
          </div>
          <div class="flex flex-col items-center p-4">
            <p class=" text-[#E89BA7] font-bold text-xl mb-1">256</p>
            <p class="text-[#4A5759] text-sm">kcal</p>
          </div>
          <div class="flex flex-col items-center p-4">
            <p class=" text-[#E89BA7] font-bold text-xl mb-1">524</p>
            <p class="text-[#4A5759] text-sm">Bewertungen</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tags -->
    <div class="h-10"></div>
    <div class="flex gap-6 justify-center mt-12 text-xs">
      <span class="bg-white text-[#4A5759] py-1 px-4 rounded-full shadow-sm border border-[#AEC2AF]">#vegan</span>
      <span class="bg-white text-[#4A5759] py-1 px-4 rounded-full shadow-sm border border-[#AEC2AF]">#glutenfrei</span>
      <span class="bg-white text-[#4A5759] py-1 px-4 rounded-full shadow-sm border border-[#AEC2AF]">#gesund</span>
    </div>
    <div class="h-10"></div>

    <!-- Zutaten -->
    <div class="mt-16 flex flex-col md:flex-row gap-16">
      <!-- Zutaten Block -->
      <div class="bg-white p-8 rounded-xl shadow-md w-full md:w-1/2">
        <h2 class="text-2xl font-bold  text-[#E89BA7] mb-6">Zutaten</h2>
        <ul class="list-disc pl-6 text-[#4A5759] space-y-2">
          <li>200g Nudeln</li>
          <li>1 Dose Tomaten</li>
          <li>1 Zwiebel</li>
          <li>2 Knoblauchzehen</li>
          <li>Salz und Pfeffer</li>
        </ul>
      </div>
      <!-- Zubereitung Block -->
      <div class="p-8 w-full md:w-1/2">
        <h2 class="text-2xl font-bold text-[#E89BA7] mb-6">Zubereitung</h2>
        <p class="text-[#4A5759]">
          Bist du neugierig geworden und hast Lust, etwas Neues auszuprobieren? Klicke jetzt auf den Button, um das
          vollständige Rezept zu entdecken und Schritt für Schritt dein ganz persönliches Lieblingsgericht zu zaubern.
          Mit frischen Zutaten und einer einfachen Zubereitung wird dieses Rezept sicher zu einem kulinarischen
          Highlight in deiner Küche!
        </p>
        <div class="h-3"></div>
        <!-- Angepasster Button für das Rezept-Design -->
        <div class="flex justify-center mt-8">
          <a href="#" class="bg-[#D4D0C4] text-[#4A5759] font-semibold text-lg py-3 px-8 rounded-full shadow-sm 
    hover:bg-[#4A5759] hover:text-[#D4D0C4] transition duration-300 transform hover:scale-105">
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
  name: 'ResponsiveRecipe',
}
</script>
