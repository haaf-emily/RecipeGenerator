<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <h1 class="text-2xl font-bold mb-6">Geben Sie Ihre Details ein</h1>
    <div class="w-64">
      <label class="block mb-2">Alter: {{ age }}</label>
      <input type="range" v-model="age" min="10" max="100" class="w-full mb-4" />
      <label class="block mb-2">Größe (cm): {{ height }}</label>
      <input type="range" v-model="height" min="100" max="250" class="w-full mb-4" />
      <label class="block mb-2">Gewicht (kg): {{ weight }}</label>
      <input type="range" v-model="weight" min="30" max="200" class="w-full" />
    </div>
    <div class="mt-6 flex space-x-4">
      <button
        @click="prevStep"
        class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
      >
        Back
      </button>
      <button
        @click="nextStep"
        class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700"
      >
        Next
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
