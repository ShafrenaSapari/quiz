import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/LandingView.vue')
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: () => import('../views/QuizView.vue')
    },
    {
      path: '/results',
      name: 'results',
      component: () => import('../views/ResultsView.vue')
    },
    {
      path: '/results/all',
      name: 'all-drinks',
      component: () => import('../views/AllDrinksView.vue')
    },
    {
      path: '/results/:personaId',
      name: 'drink-detail',
      component: () => import('../views/DrinkDetailView.vue')
    },
    {
      path: '/secret',
      name: 'secret-home',
      component: () => import('../views/SecretHomeView.vue')
    },
    {
      path: '/secret/quiz',
      name: 'secret-quiz',
      component: () => import('../views/SecretQuizView.vue')
    },
    {
      path: '/secret/result',
      name: 'secret-result',
      component: () => import('../views/SecretResultView.vue')
    }
  ],
  scrollBehavior: () => ({ top: 0 })
})

export default router
