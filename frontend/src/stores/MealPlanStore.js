import { ref, reactive } from 'vue'

// Create a default state object for initialization and reset
const defaultState = {
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
}

// Create a reactive store with the default state
const mealPlanData = reactive({ ...defaultState })

// Flag to track if data is being loaded
const isLoading = ref(false)
const hasLoaded = ref(false)
const error = ref('')

export function useMealPlanStore() {
  // Fetch meal plan data from API
  // In MealPlanStore.js

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
      const response = await fetch('/get_meal_plan')

      if (response.status === 400) {
        // This is expected if user data hasn't been entered yet
        console.log('User data required for meal plan - redirecting to questionnaire')
        error.value = 'Bitte füllen Sie zuerst Ihre persönlichen Daten aus'
        return {
          success: false,
          error: error.value,
          status: 'incomplete_profile',
        }
      } else if (!response.ok) {
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
    // Use the default state object to reset
    Object.assign(mealPlanData, { ...defaultState })
    hasLoaded.value = false
    error.value = ''

    // Also clear localStorage
    localStorage.removeItem('mealPlan')
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
