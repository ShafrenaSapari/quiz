<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../composables/useQuizStore'
import type { PersonaId } from '../composables/useQuizStore'

const router = useRouter()
const quiz = useQuizStore()
const allPersonas = computed(() => quiz.allPersonas.value)

onMounted(() => {
  if (!quiz.currentPersona.value) {
    router.replace({ name: 'results' })
  }
})

function openDrinkDetail(id: PersonaId) {
  quiz.setCurrentPersonaById(id)
  router.push({ name: 'drink-detail', params: { personaId: id } })
}

function goBackToResults() {
  router.push({ name: 'results' })
}

function tryAgain() {
  quiz.tryAgain()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="all-drinks-container">
    <h1 class="page-title">Kuih-muih Menu</h1>
    <p class="page-subtitle">Discover every personality kuih match!</p>
    <div class="drinks-grid">
      <button
        v-for="persona in allPersonas"
        :key="persona.id"
        class="drink-item"
        @click="openDrinkDetail(persona.id)"
      >
        <img :src="persona.thumbnail" :alt="persona.name" class="drink-thumbnail" />
        <span class="drink-label">{{ persona.name }}</span>
      </button>
    </div>
    <div class="bottom-buttons">
      <button class="btn back-button" @click="goBackToResults">← Back to Results</button>
      <button class="btn try-again-button" @click="tryAgain">Try Again</button>
    </div>
  </div>
</template>
