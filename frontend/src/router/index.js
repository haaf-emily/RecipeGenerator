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

// Reusable navigation guard factory
function createMealGuard(mealType) {
  return async (to, from, next) => {
    const { mealPlanData, hasLoaded, fetchMealPlan } = useMealPlanStore()

    // If we already have data for this meal type, proceed
    if (hasLoaded.value && mealPlanData.meals?.[mealType]) {
      next()
    } else {
      // Try to fetch data, but don't force a refresh
      const result = await fetchMealPlan(false)
      next()
    }
  }
}

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
    beforeEnter: createMealGuard('breakfast'),
  },
  {
    path: '/recipe-lunch',
    component: RecipeLunch,
    beforeEnter: createMealGuard('lunch'),
  },
  {
    path: '/recipe-dinner',
    component: RecipeDinner,
    beforeEnter: createMealGuard('dinner'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
