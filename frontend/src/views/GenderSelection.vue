<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <h1 class="text-2xl font-bold mb-6">Wähle dein Geschlecht</h1>
    <div class="flex space-x-4">
      <button
        @click="selectGender('male')"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Mann
      </button>
      <button
        @click="selectGender('female')"
        class="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-700"
      >
        Frau
      </button>
    </div>
    <button
      @click="nextStep"
      class="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700"
    >
      Next
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const gender = ref(null)

const selectGender = (selected) => {
  gender.value = selected
}

const nextStep = () => {
  if (gender.value) router.push('/details')
}
</script>
