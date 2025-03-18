<template>
  <div class="h-screen flex flex-col items-center justify-between">
    <div class="flex-1 flex flex-col justify-center">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Footer from './components/Footer.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserDataStore } from './stores/UserDataStore.js'
import { useMealPlanStore } from './stores/MealPlanStore.js'

// Get router for navigation
const router = useRouter()

// Get store methods
const userDataStore = useUserDataStore()
const mealPlanStore = useMealPlanStore()

onMounted(async () => {
  try {
    // Clear all user data and meal plans when the app loads
    await userDataStore.clearUserData()
    mealPlanStore.resetMealPlan()

    console.log('App mounted: All user data and meal plans have been cleared')

    // Get the current route
    const currentRoute = router.currentRoute.value.path

    // If not already on the first question, redirect to it
    if (currentRoute !== '/') {
      router.push('/')
    }
  } catch (error) {
    console.error('Error during app initialization:', error)
  }
})
</script>
