<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../composables/useQuizStore'

const router = useRouter()
const quiz = useQuizStore()

const secretResult = computed(() => quiz.secretResult.value)

onMounted(() => {
  if (!quiz.secretUnlocked.value) {
    router.replace({ name: 'home' })
    return
  }

  if (!secretResult.value) {
    router.replace({ name: 'secret-quiz' })
  }
})

function shareSecretResult() {
  quiz.shareQuest(true)
}

function resetSecret() {
  quiz.resetSecret()
  router.push({ name: 'home' })
}
</script>

<template>
  <div v-if="secretResult" class="results-container">
    <div class="share-header">
      <div class="share-text">Secret Result</div>
      <div class="share-text">wow... you found your way here!</div>
      <div class="share-tip">share this around but don't reveal the secret! ;)</div>
    </div>
    <div class="result-card">
      <img :src="secretResult.image" :alt="secretResult.name" class="drink-result-image" />
    </div>
    <div class="button-container">
      <button class="btn small-button" @click="shareSecretResult">Share</button>
      <button class="btn small-button" @click="resetSecret">Back to Normal</button>
    </div>
  </div>
</template>
