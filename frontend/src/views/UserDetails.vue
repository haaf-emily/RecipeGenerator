<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <h1 class="text-2xl font-bold mb-6">Geben Sie Ihre Details ein</h1>
    <div class="w-72 flex flex-col space-y-12 items-center">
      <div class="w-full text-center">
        <label class="block text-lg font-semibold mb-2">Alter:</label>
        <div class="text-2xl font-bold mb-2">{{ age }}</div>
        <input type="range" v-model="age" min="10" max="100" class="w-full accent-blue-500" />
      </div>
      <div class="w-full text-center">
        <label class="block text-lg font-semibold mb-2">Größe:</label>
        <div class="text-2xl font-bold mb-2">{{ height }}</div>
        <input type="range" v-model="height" min="100" max="250" class="w-full accent-blue-500" />
      </div>
      <div class="w-full text-center">
        <label class="block text-lg font-semibold mb-2">Gewicht:</label>
        <div class="text-2xl font-bold mb-2">{{ weight }}</div>
        <input type="range" v-model="weight" min="30" max="200" class="w-full accent-blue-500" />
      </div>
    </div>
    <div class="mt-12 flex space-x-6">
      <button
        @click="prevStep"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Zurück
      </button>
      <button
        @click="nextStep"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Weiter
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const age = ref(25)
const height = ref(170)
const weight = ref(70)

const prevStep = () => router.push('/')
const nextStep = () => router.push('/activity')
</script>
