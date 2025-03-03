<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-10 gap-y-12"
  >
    <h1 class="text-3xl text-center gap-y-10">Wählen Sie Ihr Aktivitätslevel:</h1>
    <div class="flex flex-col gap-y-6 w-1/2 max-w-lg">
      <button
        v-for="level in activityLevels"
        :key="level"
        @click="selectActivity(level)"
        class="p-4 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        :class="{ 'bg-gray-200 dark:bg-gray-600': selectedActivity === level }"
      >
        {{ level }}
      </button>
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
const activityLevels = ['Niedrig', 'Mittel', 'Hoch', 'Sehr Hoch']
const selectedActivity = ref(null)

const selectActivity = (level) => {
  selectedActivity.value = selectedActivity.value === level ? null : level
}

const prevStep = () => router.push('/details')
const nextStep = () => {
  if (selectedActivity.value) router.push('/summary')
}
</script>
