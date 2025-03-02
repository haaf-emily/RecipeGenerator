<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <h1 class="text-2xl font-bold mb-6">Ihr Bewegungslevel auswählen</h1>
    <div class="w-64">
      <div v-for="(level, index) in activityLevels" :key="index" class="flex items-center mb-4">
        <input type="checkbox" :id="level" v-model="selectedLevels" :value="level" class="mr-2" />
        <label :for="level" class="cursor-pointer">{{ level }}</label>
      </div>
    </div>
    <button
      @click="submit"
      class="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
    >
      Beenden
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activityLevels = ['Low', 'Moderate', 'Active', 'Very Active']
const selectedLevels = ref([])

const submit = () => {
  console.log('Selected activity levels:', selectedLevels.value)
  alert('Survey Completed!')
}
</script>
