<template>
  <div
    class="flex flex-col items-center justify-center text-gray-900 dark:text-gray-100 p-10 gap-y-12"
  >
    <h1 class="text-3xl text-center gap-y-10">Geben Sie Ihre Details ein:</h1>
    <div class="flex flex-col gap-y-10 w-full max-w-lg">
      <div>
        <label class="block text-lg font-semibold gap-y-2">Alter:</label>
        <div class="text-2xl font-bold gap-y-2">{{ age }}</div>
        <input
          type="range"
          v-model="age"
          min="10"
          max="100"
          class="w-full accent-[#6D9C6D] slider"
          @change="updateAge"
        />
      </div>
      <div>
        <label class="block text-lg font-semibold gap-y-2">Größe in cm:</label>
        <div class="text-2xl font-bold gap-y-2">{{ height }}</div>
        <input
          type="range"
          v-model="height"
          min="100"
          max="250"
          class="w-full accent-[#6D9C6D] slider"
          @change="updateHeight"
        />
      </div>
      <div>
        <label class="block text-lg font-semibold gap-y-2">Gewicht in kg:</label>
        <div class="text-2xl font-bold gap-y-2">{{ weight }}</div>
        <input
          type="range"
          v-model="weight"
          min="30"
          max="200"
          class="w-full accent-[#6D9C6D] slider"
          @change="updateWeight"
        />
      </div>

      <!-- Adding Goal Selection
      <div>
        <label class="block text-lg font-semibold gap-y-2">Ziel:</label>
        <select 
          v-model="goal" 
          @change="updateGoal"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="maintenance">Gewicht halten</option>
          <option value="weight_loss">Gewicht verlieren</option>
          <option value="weight_gain">Gewicht zunehmen</option>
        </select>
      </div> -->
    </div>
    <div class="flex justify-center gap-x-4 gap-y-12">
      <button
        @click="prevStep"
        class="px-6 py-2 bg-gray-500 text-white text-lg rounded-lg hover:bg-gray-600"
      >
        Zurück
      </button>
      <button
        @click="submitUserData"
        class="px-6 py-2 bg-[#E89BA7] text-white text-lg rounded-lg hover:bg-[#E17A89]"
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
import { useUserDataStore } from '../stores/UserDataStore.js'

const router = useRouter()
const { userData, isLoading, updateUserData, saveToBackend, loadFromBackend } = useUserDataStore()

// Create local refs that will sync with the store
const age = ref(userData.age || 25)
const height = ref(userData.height || 170)
const weight = ref(userData.weight || 70)
const goal = ref(userData.goal || 'maintenance')

// Load data on component mount
onMounted(async () => {
  await loadFromBackend()
  age.value = userData.age || 25
  height.value = userData.height || 170
  weight.value = userData.weight || 70
  goal.value = userData.goal || 'maintenance'
})

// Update functions to sync with store
const updateAge = () => updateUserData('age', parseInt(age.value))
const updateHeight = () => updateUserData('height', parseInt(height.value))
const updateWeight = () => updateUserData('weight', parseInt(weight.value))
// const updateGoal = () => updateUserData('goal', goal.value)

const prevStep = () => router.push('/')

const submitUserData = async () => {
  try {
    // Update store with current values to ensure they're saved
    updateUserData('age', parseInt(age.value))
    updateUserData('height', parseInt(height.value))
    updateUserData('weight', parseInt(weight.value))
    // updateUserData('goal', goal.value)

    // Save all data to backend
    await saveToBackend()
    router.push('/activity') // Move to the next step after a successful request
  } catch (error) {
    console.error('Error sending user data:', error)
    alert('Es gab ein Problem beim Senden der Daten.')
  }
}
</script>
