<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../composables/useQuizStore'

const router = useRouter()
const quiz = useQuizStore()

onMounted(() => {
  if (!quiz.secretUnlocked.value) {
    router.replace({ name: 'home' })
  }
})

function startSecretJourney() {
  quiz.startSecretJourney()
  router.push({ name: 'secret-quiz' })
}
</script>

<template>
  <header class="header">
    <h1 class="title" @click="quiz.handleTitleClick">Kuih-nomics</h1>
  </header>
  <h2 class="subtitle">
    Discover your Singaporean Drink!<br />
    (Secret Mode)
  </h2>
  <h3 class="description">You have unlocked a secret journey. Ready?</h3>
  <button class="btn main-button" @click="startSecretJourney">Start Secret Journey</button>
</template>
