<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-10 gap-y-12"
  >
    <h1 class="text-3xl text-center mb-10">Wähle dein Geschlecht:</h1>
    <div class="flex justify-center gap-x-10">
      <button
        @click="selectGender('male')"
        class="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        :class="{ 'bg-gray-200 dark:bg-gray-600': gender === 'male' }"
      >
        <span class="material-symbols-outlined" style="font-size: 4rem">male</span>
        <span class="text-lg">Mann</span>
      </button>
      <button
        @click="selectGender('female')"
        class="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        :class="{ 'bg-gray-200 dark:bg-gray-600': gender === 'female' }"
      >
        <span class="material-symbols-outlined" style="font-size: 4rem">female</span>
        <span class="text-lg">Frau</span>
      </button>
    </div>
    <button
      @click="nextStep"
      class="px-6 py-2 bg-green-500 text-white text-lg rounded-lg hover:bg-green-600"
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
  gender.value = gender.value === selected ? null : selected
}

const nextStep = () => {
  if (gender.value) router.push('/details')
}
</script>
