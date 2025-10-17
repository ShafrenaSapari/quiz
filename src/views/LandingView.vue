<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../composables/useQuizStore'

const router = useRouter()
const quiz = useQuizStore()

watch(
  () => quiz.secretUnlocked.value,
  unlocked => {
    if (unlocked) {
      router.push({ name: 'secret-home' })
    }
  }
)

function startQuiz() {
  quiz.startQuiz()
  router.push({ name: 'quiz' })
}
</script>

<template>
  <div class="intro-card">
    <header class="header">
      <h1 class="title" @click="quiz.handleTitleClick">Kuih-nomics</h1>
    </header>
    <h2 class="subtitle">What’s Your Financial Flavour?</h2>
    <h3 class="description">
      Discover your kuih personality in this fun Singapore heritage quiz! <br />From Ondeh Ondeh to Kueh Lapis, explore the sweet side of your character.
    </h3>
    <button class="btn main-button" @click="startQuiz">Take the quiz</button>
  </div>
</template>
