<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { endingImage, questionImages, questions, useQuizStore } from '../composables/useQuizStore'

const router = useRouter()
const quiz = useQuizStore()

const totalQuestions = questions.length
const questionIndex = computed(() => quiz.questionIndex.value)
const quizCompleted = computed(() => quiz.quizCompleted.value)
const currentQuestion = computed(() => questions[questionIndex.value])
const currentImage = computed(() => questionImages[questionIndex.value])
const selectedChoices = computed(() => quiz.selectedChoices.value)
const canGoBack = computed(() => questionIndex.value > 0)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  dob: '',
  citizenship: '',
  consent: false
})

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  dob: '',
  citizenship: '',
  consent: ''
})

const submitting = ref(false)
const submitError = ref('')

function answerQuestion(choiceIdx: number) {
  quiz.answerQuestion(choiceIdx)
}

function goBack() {
  if (!canGoBack.value) return
  quiz.goToPreviousQuestion()
}

function validateForm() {
  errors.name = form.name.trim() ? '' : 'Name is required'
  errors.email = /.+@.+\..+/.test(form.email.trim()) ? '' : 'Enter a valid email address'
  errors.phone = form.phone.trim().length >= 7 ? '' : 'Enter a valid phone number'
  errors.dob = form.dob ? '' : 'Date of birth is required'
  errors.citizenship = form.citizenship ? '' : 'Select your citizenship'
  errors.consent = form.consent ? '' : 'Please consent to continue'
  return (
    !errors.name &&
    !errors.email &&
    !errors.phone &&
    !errors.dob &&
    !errors.citizenship &&
    !errors.consent
  )
}

async function submitForm() {
  submitError.value = ''
  if (!validateForm()) return

  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL
  if (!scriptUrl) {
    submitError.value = 'Submission endpoint is not configured. Set VITE_GOOGLE_SCRIPT_URL.'
    return
  }

  submitting.value = true
  try {
    const payload = new FormData()
    payload.append('name', form.name)
    payload.append('email', form.email)
    payload.append('phone', form.phone)
    payload.append('dob', form.dob)
    payload.append('citizenship', form.citizenship)
    payload.append('consent', form.consent ? 'yes' : 'no')

    const personaPrediction = quiz.predictPersona()
    if (personaPrediction.persona) {
      payload.append('personaId', personaPrediction.persona.id)
      payload.append('personaName', personaPrediction.persona.name)
      payload.append('personaHeadline', personaPrediction.persona.headline)
    }
    payload.append('personaQualified', personaPrediction.personaQualified ? 'yes' : 'no')

    const responses = selectedChoices.value.map((choiceIdx, questionIdx) => {
      const question = questions[questionIdx]
      const choice = choiceIdx >= 0 ? question.choices[choiceIdx] : ''
      return {
        question: question.question,
        choiceIndex: choiceIdx,
        choiceLabel: choice
      }
    })
    payload.append('responses', JSON.stringify(responses))

    const response = await fetch(scriptUrl, {
      method: 'POST',
      body: payload
    })

    if (!response.ok) {
      throw new Error(`Submission failed with status ${response.status}`)
    }

    quiz.revealResult()
    router.push({ name: 'results' })
  } catch (error) {
    console.error('Form submission failed', error)
    submitError.value = 'Unable to submit the form right now. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div v-if="!quizCompleted" class="quiz-container">
    <div class="quiz-nav">
      <button class="quiz-back-button" :disabled="!canGoBack" type="button" @click="goBack">
        ← Back
      </button>
      <div class="question-number">Q{{ questionIndex + 1 }}/{{ totalQuestions }}</div>
    </div>
    <div class="question-container">
      <div class="question">{{ currentQuestion.question }}</div>
      <img :src="currentImage" alt="Question Scene" class="question-image" />
    </div>
    <div class="choices-container">
      <button
        v-for="(choice, idx) in currentQuestion.choices"
        :key="idx"
        :class="['btn', 'choice', { 'choice-selected': selectedChoices[questionIndex] === idx }]"
        @click="answerQuestion(idx)"
      >
        {{ choice }}
      </button>
    </div>
  </div>

  <div v-else class="quiz-container quiz-container--form">
    <form class="form-card" @submit.prevent="submitForm">
      <img :src="endingImage" alt="Quiz wrap-up" class="form-card__image" />
      <h2 class="form-card__title">Share your details to learn about your kuih-nomics!</h2>
      <div class="form-group">
        <label class="form-label" for="quiz-name">Name</label>
        <input
          id="quiz-name"
          v-model="form.name"
          type="text"
          name="name"
          class="form-input"
          :class="{ 'has-error': errors.name }"
          autocomplete="name"
          placeholder="Your name"
        />
        <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
      </div>

      <div class="form-group">
        <label class="form-label" for="quiz-email">Email address</label>
        <input
          id="quiz-email"
          v-model="form.email"
          type="email"
          name="email"
          class="form-input"
          :class="{ 'has-error': errors.email }"
          autocomplete="email"
          placeholder="you@example.com"
        />
        <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <label class="form-label" for="quiz-phone">Phone number</label>
        <input
          id="quiz-phone"
          v-model="form.phone"
          type="tel"
          name="phone"
          class="form-input"
          :class="{ 'has-error': errors.phone }"
          autocomplete="tel"
          placeholder="e.g. +65 9123 4567"
        />
        <p v-if="errors.phone" class="form-error">{{ errors.phone }}</p>
      </div>

      <div class="form-group">
        <label class="form-label" for="quiz-dob">Date of birth</label>
        <input
          id="quiz-dob"
          v-model="form.dob"
          type="date"
          name="dob"
          class="form-input"
          :class="{ 'has-error': errors.dob }"
        />
        <p v-if="errors.dob" class="form-error">{{ errors.dob }}</p>
      </div>

      <div class="form-group">
        <label class="form-label" for="quiz-citizenship">Citizenship</label>
        <select
          id="quiz-citizenship"
          v-model="form.citizenship"
          name="citizenship"
          class="form-input"
          :class="{ 'has-error': errors.citizenship }"
        >
          <option value="" disabled>Select an option</option>
          <option value="Singaporean">Singaporean</option>
          <option value="Singapore Permanent Resident">Singapore Permanent Resident</option>
          <option value="Others">Others</option>
        </select>
        <p v-if="errors.citizenship" class="form-error">{{ errors.citizenship }}</p>
      </div>

      <div class="form-group consent-group">
        <label class="form-consent">
          <input v-model="form.consent" type="checkbox" class="consent-checkbox" />
          <span>I agree to share my details for the Kuih-nomics experience.</span>
        </label>
        <p v-if="errors.consent" class="form-error">{{ errors.consent }}</p>
      </div>

      <p class="form-disclaimer">
        By submitting this form, you consent to be contacted for financial advisory purposes, including updates,
        events and relevant information. Your data will be kept confidential and used solely for purposes related to
        our initiatives.
      </p>

      <div class="submit-container">
        <button class="btn whoosh-button submit-button" type="submit" :disabled="submitting">
          {{ submitting ? 'Cooking…' : "Let's masak our kuih!" }}
        </button>
      </div>

      <p v-if="submitError" class="form-error form-error--inline">{{ submitError }}</p>
    </form>
  </div>
</template>
