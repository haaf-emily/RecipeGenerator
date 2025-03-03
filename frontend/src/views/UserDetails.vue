<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-10 gap-y-12"
  >
    <h1 class="text-3xl text-center gap-y-10">Geben Sie Ihre Details ein:</h1>
    <div class="flex flex-col gap-y-10 w-full max-w-lg">
      <div>
        <label class="block text-lg font-semibold gap-y-2">Alter:</label>
        <div class="text-2xl font-bold gap-y-2">{{ age }}</div>
        <input type="range" v-model="age" min="10" max="100" class="w-full" />
      </div>
      <div>
        <label class="block text-lg font-semibold gap-y-2">Größe in cm:</label>
        <div class="text-2xl font-bold gap-y-2">{{ height }}</div>
        <input type="range" v-model="height" min="100" max="250" class="w-full" />
      </div>
      <div>
        <label class="block text-lg font-semibold gap-y-2">Gewicht in kg:</label>
        <div class="text-2xl font-bold gap-y-2">{{ weight }}</div>
        <input type="range" v-model="weight" min="30" max="200" class="w-full" />
      </div>
    </div>
    <div class="flex justify-center gap-x-4 gap-y-12">
      <button
        @click="prevStep"
        class="px-6 py-2 bg-gray-500 text-white text-lg rounded-lg hover:bg-gray-600"
      >
        Zurück
      </button>
      <button
        @click="nextStep"
        class="px-6 py-2 bg-green-500 text-white text-lg rounded-lg hover:bg-green-600"
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
