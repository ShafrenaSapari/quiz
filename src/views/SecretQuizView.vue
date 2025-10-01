<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { secretImage, secretScenario, useQuizStore } from '../composables/useQuizStore'

const router = useRouter()
const quiz = useQuizStore()

onMounted(() => {
  if (!quiz.secretUnlocked.value) {
    router.replace({ name: 'home' })
  }
})

function answerSecret(choiceIdx: number) {
  quiz.answerSecret(choiceIdx)
  router.push({ name: 'secret-result' })
}
</script>

<template>
  <div class="quiz-container">
    <div class="question">{{ secretScenario.question }}</div>
    <img :src="secretImage" alt="Secret Quiz" class="question-image" />
    <div class="choices-container">
      <button
        v-for="(choice, idx) in secretScenario.choices"
        :key="idx"
        class="btn choice"
        @click="answerSecret(idx)"
      >
        {{ choice }}
      </button>
    </div>
  </div>
</template>
