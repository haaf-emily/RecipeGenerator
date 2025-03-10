<template>
  <div
    class="flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-10 gap-y-12"
  >
    <h1 class="text-3xl text-center gap-y-10">Wählen Sie Ihr Aktivitätslevel:</h1>
    <div class="flex flex-col gap-y-6 w-1/2 max-w-lg">
      <button
        v-for="level in activityLevels"
        :key="level.value"
        @click="selectActivity(level.value)"
        class="p-4 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        :class="{ 'bg-gray-200 dark:bg-gray-600': selectedActivity === level.value }"
      >
        {{ level.label }}
      </button>
    </div>
    <p v-if="errorMessage" class="text-red-500 text-center">{{ errorMessage }}</p>

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
        :disabled="isLoading"
      >
        <span v-if="isLoading">Lädt...</span>
        <span v-else>Weiter</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserDataStore } from '../stores/UserDataStore'

const router = useRouter()
const errorMessage = ref('')
const { userData, isLoading, updateUserData, saveToBackend, loadFromBackend } = useUserDataStore()

// Map the German labels to the expected API values
const activityLevels = [
  { label: 'Sesshaft', value: 'sedentary' },
  { label: 'Leicht', value: 'lightly_active' },
  { label: 'Mäßig', value: 'moderately_active' },
  { label: 'Sehr', value: 'very_active' },
  { label: 'Extra', value: 'extra_active' },
]

const selectedActivity = ref(userData.activity_level)

// Load data on component mount
onMounted(async () => {
  await loadFromBackend()
  selectedActivity.value = userData.activity_level
})

const selectActivity = (level) => {
  selectedActivity.value = selectedActivity.value === level ? null : level
  updateUserData('activity_level', selectedActivity.value)
}

// Go back to the previous step
const prevStep = () => router.push('/details')

// Go to the next step and send data to backend
const nextStep = async () => {
  if (!selectedActivity.value) {
    errorMessage.value = 'Bitte wählen Sie eine Option aus'
    return
  }
  errorMessage.value = ''

  try {
    await saveToBackend() // Send activity level to backend before proceeding
    router.push('/location')
  } catch (error) {
    console.error('Error sending activity level:', error)
    alert('Es gab ein Problem beim Senden der Daten.')
  }
}
</script>
