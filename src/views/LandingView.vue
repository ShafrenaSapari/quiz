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
  <header class="header">
    <h1 class="title" @click="quiz.handleTitleClick">Kuih-nomics</h1>
  </header>
  <h2 class="subtitle">What’s Your Financial Flavour?</h2>
  <h3 class="description">
    Let's masuk dapur and find out which kuih matches<br /> your financial personality!
  </h3>
  <button class="btn main-button" @click="startQuiz">Take the quiz</button>
</template>
