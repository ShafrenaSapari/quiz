<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { personas, useQuizStore } from '../composables/useQuizStore'
import type { PersonaId } from '../composables/useQuizStore'

const router = useRouter()
const route = useRoute()
const quiz = useQuizStore()

const personaId = computed(() => route.params.personaId as PersonaId)
const currentPersona = computed(() => quiz.currentPersona.value)

function ensureValidPersona(target: PersonaId | undefined) {
  if (!target || !personas.some(persona => persona.id === target)) {
    router.replace({ name: 'results' })
    return false
  }
  const didSet = quiz.setCurrentPersonaById(target)
  if (!didSet) {
    router.replace({ name: 'results' })
  }
  return didSet
}

onMounted(() => {
  ensureValidPersona(personaId.value)
})

watch(personaId, value => {
  ensureValidPersona(value)
})

function goBackToAll() {
  router.push({ name: 'all-drinks' })
}

function takeQuizAgain() {
  quiz.tryAgain()
  router.push({ name: 'home' })
}
</script>

<template>
  <div v-if="currentPersona" class="results-container">
    <div class="persona-header">
      <h1 class="persona-name">{{ currentPersona.name }}</h1>
      <h2 class="persona-headline">{{ currentPersona.headline }}</h2>
    </div>
    <div class="result-card">
      <img :src="currentPersona.image" :alt="currentPersona.name" class="drink-result-image" />
    </div>
    <div class="persona-body">
      <div class="persona-section">
        <h3 class="persona-section__title">Traits</h3>
        <ul class="persona-traits">
          <li v-for="trait in currentPersona.traits" :key="trait">{{ trait }}</li>
        </ul>
      </div>
      <div class="persona-section persona-financial">
        <h3 class="persona-section__title">Financial personality</h3>
        <p>{{ currentPersona.financialPersonality }}</p>
      </div>
      <div class="persona-section">
        <p class="persona-story">{{ currentPersona.story }}</p>
      </div>
      <div class="persona-section persona-cta">
        <span class="persona-cta__label">Ready to level up?</span>
        <p>{{ currentPersona.cta }}</p>
      </div>
    </div>
    <div class="button-container">
      <button class="btn small-button" @click="goBackToAll">← All Kuihs</button>
      <button class="btn small-button" @click="takeQuizAgain">Take Quiz</button>
    </div>
  </div>
</template>
