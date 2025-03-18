<template>
  <div
    class="flex flex-col items-center justify-center text-gray-900 dark:text-gray-100 p-10 gap-y-12"
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
    <p v-if="errorMessage" class="text-red-500 text-center">{{ errorMessage }}</p>
    <button
      @click="nextStep"
      class="px-6 py-2 bg-[#E89BA7] text-white text-lg rounded-lg hover:bg-[#E17A89]"
      :disabled="isLoading"
    >
      <span v-if="isLoading">Lädt...</span>
      <span v-else>Weiter</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserDataStore } from '../stores/UserDataStore.js'

const router = useRouter()
const { userData, isLoading, updateUserData, saveToBackend, loadFromBackend } = useUserDataStore()
const errorMessage = ref('')

// Use a ref for the UI binding but sync with the store
const gender = ref(userData.gender)

// Load data on component mount
onMounted(async () => {
  await loadFromBackend()
  gender.value = userData.gender
})

const selectGender = (selected) => {
  gender.value = gender.value === selected ? null : selected
  // Update the store
  updateUserData('gender', gender.value)
}

const nextStep = async () => {
  if (!gender.value) {
    errorMessage.value = 'Bitte wählen Sie eine Option aus'
    return
  }
  errorMessage.value = ''

  try {
    // Save the gender to backend
    await saveToBackend()
    router.push('/details') // Navigate to the next page
  } catch (error) {
    console.error('Error saving gender:', error)
    alert('Es gab ein Problem beim Senden der Daten.')
  }
}
</script>
