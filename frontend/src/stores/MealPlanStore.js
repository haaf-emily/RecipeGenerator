import { ref, reactive } from 'vue'

// Create a reactive store for meal plan data
const mealPlanData = reactive({
  meals: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  calorieRequirement: 0,
  goal: 'maintenance',
  feelsLikeTemperature: 0,
  locationUsed: '',
  totalCalories: 0,
})

// Flag to track if data is being loaded
const isLoading = ref(false)
const hasLoaded = ref(false)
const error = ref('')

export function useMealPlanStore() {
  // Fetch meal plan data from API
  const fetchMealPlan = async (forceRefresh = false) => {
    // If we already have data and we're not forcing a refresh, just return
    if (hasLoaded.value && !forceRefresh) {
      return { success: true }
    }

    isLoading.value = true
    error.value = ''

    try {
      // First, try to get from localStorage if available and we're not forcing refresh
      if (!forceRefresh) {
        const storedMealPlan = localStorage.getItem('mealPlan')
        if (storedMealPlan) {
          const data = JSON.parse(storedMealPlan)
          if (data && data.meals) {
            // Update the store with data from localStorage
            Object.assign(mealPlanData, data)
            isLoading.value = false
            hasLoaded.value = true
            return { success: true }
          }
        }
      }

      // If not in localStorage or we're forcing a refresh, fetch from API
      const response = await fetch('http://localhost:8000/get_meal_plan')

      if (!response.ok) {
        throw new Error(`Server antwortet mit Status: ${response.status}`)
      }

      const data = await response.json()

      if (!data || !data.meals) {
        throw new Error('Keine Mahlzeitendaten verfügbar')
      }

      // Update store with retrieved data
      Object.assign(mealPlanData, data)

      // Store in localStorage for future use
      localStorage.setItem('mealPlan', JSON.stringify(data))

      hasLoaded.value = true
      return { success: true }
    } catch (err) {
      console.error('Error fetching meal plan:', err)
      error.value = err.message || 'Ein Fehler ist aufgetreten beim Abrufen der Rezepte'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Reset the store (useful when user data changes)
  const resetMealPlan = () => {
    Object.assign(mealPlanData, {
      meals: {
        breakfast: null,
        lunch: null,
        dinner: null,
      },
      calorieRequirement: 0,
      goal: 'maintenance',
      feelsLikeTemperature: 0,
      locationUsed: '',
      totalCalories: 0,
    })
    hasLoaded.value = false
    error.value = ''
  }

  return {
    mealPlanData,
    isLoading,
    hasLoaded,
    error,
    fetchMealPlan,
    resetMealPlan,
  }
}
