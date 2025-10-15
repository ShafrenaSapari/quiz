<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../composables/useQuizStore'

const router = useRouter()
const quiz = useQuizStore()

const currentPersona = computed(() => quiz.currentPersona.value)
const personaQualified = computed(() => quiz.personaQualified.value)

onMounted(() => {
  if (!currentPersona.value) {
    router.replace({ name: 'quiz' })
  }
})

function shareQuest() {
  quiz.shareQuest()
}

function viewAllDrinks() {
  router.push({ name: 'all-drinks' })
}

function copyResultLink() {
  quiz.copyResultLink()
}

function tryAgain() {
  quiz.tryAgain()
  router.push({ name: 'home' })
}
</script>

<template>
  <div v-if="currentPersona" class="results-container">
    <div class="persona-header">
      <h1 class="persona-name">{{ currentPersona.name }}</h1>
      <h2 class="persona-headline">{{ currentPersona.headline }}</h2>
      <p v-if="!personaQualified" class="persona-note">
        You sampled many flavours this round! Try leaning into one vibe a little more next time to unlock a sharper kuih profile.
      </p>
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
        <span class="persona-cta__label">Want a treat to go with your kuih layers?</span>
        <p>You might just walk away with Savviya’s first-ever Kuih Plushie! Winners will be contacted directly. Good luck, and stay shiok!</p>
      </div>
    </div>

    <div class="button-container">
      <button class="btn small-button" @click="shareQuest">Share Quest</button>
      <button class="btn small-button" @click="viewAllDrinks">All Kuihs</button>
    </div>
    <div class="button-container">
      <button class="btn small-button" @click="copyResultLink">Copy Link</button>
      <button class="btn small-button" @click="tryAgain">Try Again</button>
    </div>
  </div>
</template>
