import { createRouter, createWebHistory } from 'vue-router'
import GenderSelection from '../views/GenderSelection.vue';
import UserDetails from '../views/UserDetails.vue';
import ActivityLevel from '../views/ActivityLevel.vue';
import RecipeOverview from '../components/RecipeOverview.vue';
import LocationSelection from '../views/LocationSelection.vue';
import RecipeBreakfast from '../components/RecipeBreakfast.vue';
import RecipeLunch from '../components/RecipeLunch.vue';
import RecipeDinner from '../components/RecipeDinner.vue'
  import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';

const routes = [
  { path: '/', component: GenderSelection },
  { path: '/details', component: UserDetails },
  { path: '/activity', component: ActivityLevel },
  { path: '/recipes', component: RecipeOverview },
  { path: '/location', component: LocationSelection },
  { path: '/recipe-breakfast', component: RecipeBreakfast },
  { path: '/recipe-lunch', component: RecipeLunch},
  { path: '/recipe-dinner', component: RecipeDinner},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

// Default code
// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView,
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue'),
//     },
//   ],
// })

// export default router
