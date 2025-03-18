import { createRouter, createWebHistory } from 'vue-router'
import GenderSelection from '../views/GenderSelection.vue'
import UserDetails from '../views/UserDetails.vue'
import ActivityLevel from '../views/ActivityLevel.vue'
import RecipeOverview from '../components/RecipeOverview.vue'
import LocationSelection from '../views/LocationSelection.vue'
import RecipeBreakfast from '../components/RecipeBreakfast.vue'
import RecipeLunch from '../components/RecipeLunch.vue'
import RecipeDinner from '../components/RecipeDinner.vue'
import { useMealPlanStore } from '../stores/MealPlanStore'

const routes = [
  { path: '/', component: GenderSelection },
  { path: '/details', component: UserDetails },
  { path: '/activity', component: ActivityLevel },
  {
    path: '/recipes',
    component: RecipeOverview,
    // No special handling needed, component fetches data itself
  },
  { path: '/location', component: LocationSelection },
  {
    path: '/recipe-breakfast',
    component: RecipeBreakfast,
    // beforeEnter navigation guard ensures meal plan data is loaded
    beforeEnter: async (to, from, next) => {
      const { mealPlanData, hasLoaded, fetchMealPlan } = useMealPlanStore()

      // If we already have data for breakfast, proceed
      if (hasLoaded.value && mealPlanData.meals?.breakfast) {
        next()
      } else {
        // Try to fetch data
        const result = await fetchMealPlan()

        // Continue even if fetch fails - component will handle error display
        next()
      }
    },
  },
  {
    path: '/recipe-lunch',
    component: RecipeLunch,
    beforeEnter: async (to, from, next) => {
      const { mealPlanData, hasLoaded, fetchMealPlan } = useMealPlanStore()

      if (hasLoaded.value && mealPlanData.meals?.lunch) {
        next()
      } else {
        const result = await fetchMealPlan()
        next()
      }
    },
  },
  {
    path: '/recipe-dinner',
    component: RecipeDinner,
    beforeEnter: async (to, from, next) => {
      const { mealPlanData, hasLoaded, fetchMealPlan } = useMealPlanStore()

      if (hasLoaded.value && mealPlanData.meals?.dinner) {
        next()
      } else {
        const result = await fetchMealPlan()
        next()
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
