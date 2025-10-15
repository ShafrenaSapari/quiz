<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from './composables/useQuizStore'

const router = useRouter()
const route = useRoute()
const quiz = useQuizStore()

const rootClasses = computed(() => {
  const classes = ['quiz-app'] as string[]
  switch (route.name) {
    case 'home':
      classes.push('home-page')
      break
    case 'secret-home':
      classes.push('home-page', 'secret-home-page')
      break
    case 'results':
    case 'drink-detail':
      classes.push('results-page')
      break
    case 'all-drinks':
      classes.push('all-drinks-page')
      break
    case 'secret-quiz':
    case 'secret-result':
      classes.push('results-page', 'secret-home-page')
      break
  }
  return classes
})

const showStarField = computed(() => rootClasses.value.includes('home-page'))

onBeforeUnmount(() => {
  quiz.clearToastTimer()
})
</script>

<template>
  <div :class="rootClasses">
    <div v-if="showStarField" class="star-field"></div>

    <div class="wrapper">
      <router-view />
    </div>

    <footer class="app-footer">© Savviya SG</footer>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Nunito, sans-serif;
  background: #4c2b6b;
  color: #5a4a6b;
  min-height: 100vh;
  overflow-x: hidden;
}

#app {
  height: 100vh;
  width: 100vw;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.quiz-app {
  height: 100svh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #cdeb53;
  font-family: Nunito, sans-serif;
  overflow-x: hidden;
}

.app-footer {
  position: absolute;
  bottom: 16px;
  left: 16px;
  font-size: 0.9rem;
  color: #000;
  letter-spacing: 0.02em;
}

.quiz-app.home-page {
  background-image: url("/landing-kuih.jpeg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.quiz-app.home-page.secret-home-page {
  background-image: url("landing-kuih-2.jpeg");
}

.star-field {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  display: none;
}

.quiz-app.home-page .star-field {
  display: block;
}

.star-field::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 20% 15%, rgba(255, 223, 0, 0.6) 1px, transparent 1px),
    radial-gradient(circle at 85% 25%, rgba(255, 182, 193, 0.4) 1px, transparent 1px),
    radial-gradient(circle at 45% 80%, rgba(221, 160, 221, 0.5) 1px, transparent 1px),
    radial-gradient(circle at 75% 70%, rgba(255, 223, 0, 0.7) 1px, transparent 1px),
    radial-gradient(circle at 15% 85%, rgba(255, 182, 193, 0.3) 1px, transparent 1px);
  background-size: 250px 250px, 180px 180px, 300px 300px, 200px 200px, 220px 220px;
  animation: gentle-twinkle 4s ease-in-out infinite alternate;
}

.star-field::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 65% 30%, rgba(255, 223, 0, 0.3) 1px, transparent 1px),
    radial-gradient(circle at 25% 60%, rgba(221, 160, 221, 0.6) 1px, transparent 1px),
    radial-gradient(circle at 90% 85%, rgba(255, 182, 193, 0.4) 1px, transparent 1px);
  background-size: 160px 160px, 280px 280px, 190px 190px;
  animation: gentle-twinkle 3s ease-in-out infinite alternate reverse;
}

@keyframes gentle-twinkle {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.4;
  }
}

.wrapper {
  box-sizing: border-box;
  width: 100%;
  min-height: 100svh;
  text-align: center;
  padding: 35px 16px 36px;
  background: none;
  border: none;
  box-shadow: none;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}


.quiz-app.home-page .wrapper,
.quiz-app.secret-home-page .wrapper {
  justify-content: center;
}


.quiz-app.results-page .wrapper {
  padding-top: clamp(28px, 9vh, 76px);
  padding-bottom: clamp(24px, 6vh, 60px);
}


.intro-card {
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 28px 24px;
  max-width: 520px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  margin-top: 40px;
}

.header {
  margin-bottom: 30px;
  padding: 0;
}

.title {
  font-size: clamp(2rem, 7vw, 3.5rem);
  font-weight: 800;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
  background: none;
  -webkit-text-fill-color: white;
  letter-spacing: 1px;
}

.subtitle {
  font-size: clamp(1.1rem, 4vw, 1.6rem);
  color: #ffffffe6;
  margin-bottom: 15px;
  font-weight: 500;
}

.description {
  font-size: clamp(0.95rem, 3vw, 1.2rem);
  color: #fffffff2;
  margin-bottom: 60px;
  line-height: 1.6;
  padding: 0 15px;
  font-weight: 500;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
}

.main-button {
  font-size: clamp(1rem, 3vw, 1.4rem);
  padding: 15px 35px;
  max-width: 240px;
  min-height: 50px;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd93d, #f7dc6f);
  color: #2c3e50;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px #ffd93d66, 0 0 20px #ffffff4d;
  text-transform: none;
  letter-spacing: 1px;
  position: relative;
  z-index: 3;
  margin-top: auto;
  margin-bottom: 50px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  animation: button-float 6s ease-in-out infinite;
}

@keyframes button-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.main-button:hover {
  background: linear-gradient(135deg, #fff176, #f9e79f);
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 40px #ffd93d99, 0 0 30px #ffffff80;
}

.main-button:active {
  transform: translateY(-2px) scale(1.02);
}

.quiz-container {
  width: min(100%, 420px);
  display: flex;
  flex-direction: column;
  padding: 20px 0 30px;
  margin: 0 auto;
  align-items: center;
  flex-grow: 1;
  min-height: 0;
}


.quiz-container--form {
  width: 100%;
  max-width: 360px;
  gap: 14px;
  padding: 18px 18px 26px;
  align-items: center;
  justify-content: center;
}


.quiz-nav {
  width: 100%;
  max-width: 440px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-top: 18px;
  margin-bottom: 18px;
}

.quiz-back-button {
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  position: absolute;
  left: 0;
  top: 18px;
}

.quiz-back-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.quiz-back-button:disabled {
  cursor: default;
  opacity: 0.4;
}

.question-number {
  font-size: clamp(1.4rem, 4vw, 1.7rem);
  font-weight: 800;
  color: #2b173d;
  background: rgba(255, 217, 61, 0.95);
  padding: 10px 22px;
  border-radius: 999px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  margin: 0;
}

.question-image {
  width: min(100%, 340px);
  height: auto;
  object-fit: contain;
  margin: 0 auto 18px;
  display: block;
  border-radius: 8px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.25);
}

.question {
  font-size: clamp(1.2rem, 4vw, 1.45rem);
  font-weight: 700;
  color: #000;
  line-height: 1.3;
  text-align: center;
  margin: 10px 0 8px;
}

.choices-container {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 440px;
  margin-bottom: 24px;
}

@media (min-width: 600px) {
  .choices-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.choice {
  font-size: clamp(0.95rem, 2.5vw, 1.05rem);
  font-weight: 600;
  padding: 18px 8px;
  background: #fff;
  color: #333;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  text-align: center;
  line-height: 1.3;
  min-height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.choice.choice-selected {
  background: linear-gradient(135deg, #ffd93d, #f7dc6f);
  color: #2c3e50;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

.choice:hover {
  background: #f5f5f5;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.form-card {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffffee;
  border-radius: 20px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.22);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-card__title {
  font-size: 1.3rem;
  font-weight: 800;
  text-align: center;
  color: #2b173d;
  line-height: 1.3;
}


.form-card__image {
  width: 220px;
  max-width: 100%;
  height: auto;
  align-self: center;
  border-radius: 16px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.22);
  margin-bottom: 12px;
}


.form-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2c3e50;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 2px solid transparent;
  background: #f5f7fa;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #ffd93d;
  box-shadow: 0 0 0 4px rgba(255, 217, 61, 0.25);
}

.form-input.has-error {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
}

.form-error {
  font-size: 0.85rem;
  color: #c0392b;
}

.form-error--inline {
  text-align: center;
  margin-top: -6px;
}

.consent-group {
  align-items: flex-start;
  gap: 10px;
}

.form-consent {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: #2c3e50;
  cursor: pointer;
}

.consent-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #ffd93d;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.submit-button {
  width: 100%;
  max-width: 320px;
  font-size: 1.1rem;
  padding: 16px 24px;
}

@media (max-width: 400px) {
  .wrapper {
    padding: 30px 12px 28px;
  }

  .quiz-container {
    width: 100%;
    padding: 20px 0 24px;
    margin-top: 6px;
  }

  .quiz-nav {
    max-width: 100%;
    padding-top: 20px;
    margin-bottom: 14px;
  }

  .quiz-back-button {
    padding: 6px 14px;
    font-size: 0.9rem;
    top: 20px;
  }

  .question-number {
    font-size: 1.15rem;
    padding: 8px 16px;
  }

  .question {
    font-size: 1.1rem;
    margin: 16px 0 8px;
  }

  .question-image {
    width: 100%;
    max-width: 280px;
  }

  .choice {
    font-size: 0.95rem;
    padding: 14px 10px;
  }

  .quiz-container--form {
    max-width: 92%;
    padding: 18px 14px 24px;
    gap: 12px;
  }

  .form-card {
    max-width: 320px;
    padding: 16px;
  }

  .form-card__image {
    width: 160px;
  }

  .form-label,
  .form-consent {
    font-size: 0.9rem;
  }

  .form-input {
    font-size: 0.95rem;
  }

  .submit-button {
    max-width: 100%;
    font-size: 1rem;
    padding: 14px 20px;
  }
}

.results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100svh;
  padding: 0 10px 10px;
  box-sizing: border-box;
}

/* share header removed */

.result-card {
  background: transparent;
  border-radius: 0;
  padding: 5px 20px 10px;
  text-align: center;
  max-width: 450px;
  position: relative;
}

.persona-header {
  text-align: center;
  color: #2b173d;
  margin-bottom: 18px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(61, 44, 94, 0.18);
}

.persona-name {
  font-size: clamp(2.2rem, 6vw, 3rem);
  font-weight: 800;
  margin-bottom: 6px;
}

.persona-headline {
  font-size: clamp(1.15rem, 3.5vw, 1.75rem);
  font-weight: 700;
  color: #654a9b;
  margin-bottom: 10px;
}

.persona-note {
  font-size: 0.95rem;
  color: #4a4d66;
  margin-top: 6px;
}

.persona-body {
  max-width: 560px;
  text-align: left;
  color: #2b173d;
  padding: 0 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.persona-section {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 18px;
  padding: 18px 22px;
  box-shadow: 0 12px 28px rgba(61, 44, 94, 0.12);
}

.persona-section__title {
  font-size: clamp(1.05rem, 3vw, 1.35rem);
  font-weight: 700;
  margin-bottom: 12px;
  color: #654a9b;
}

.persona-traits {
  list-style: disc;
  padding-left: 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: clamp(0.9rem, 2.4vw, 1.05rem);
  color: #2f2446;
}

.persona-traits li::marker {
  color: #d28eff;
}

.persona-financial p {
  font-size: clamp(0.9rem, 2.4vw, 1.05rem);
  line-height: 1.6;
  color: #2f2446;
}

.persona-story {
  font-size: clamp(0.95rem, 2.6vw, 1.15rem);
  line-height: 1.7;
  color: #312548;
}

.persona-cta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: clamp(0.95rem, 2.4vw, 1.1rem);
  color: #312548;
}

.persona-cta__label {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.9rem;
  color: #ba7bff;
  font-weight: 800;
}

.drink-result-image {
  max-width: 320px;
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

.button-container {
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
  max-width: 320px;
  margin-bottom: 15px;
  justify-content: center;
}

.btn {
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
  border: none;
  outline: none;
  text-transform: none;
  touch-action: manipulation;
}

.small-button {
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  font-weight: 700;
  padding: 12px 18px;
  background: linear-gradient(135deg, #ffd93d, #f7dc6f);
  color: #2c3e50;
  border-radius: 25px;
  cursor: pointer;
  min-height: 45px;
}

.small-button:hover {
  background: linear-gradient(135deg, #fff176, #f9e79f);
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25);
}

.quiz-app.all-drinks-page .wrapper {
  max-width: 800px;
  height: 100svh;
  overflow-y: auto;
  padding: 15px;
  box-sizing: border-box;
}

.all-drinks-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  width: 100%;
}

.page-title {
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 800;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
  text-align: center;
}

.page-subtitle {
  font-size: clamp(1rem, 3vw, 1.3rem);
  color: #fffffc;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 500;
}

.drinks-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 16px;
  width: 100%;
  margin-bottom: 30px;
}

@media (max-width: 767px) {
  .drinks-grid {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
  }
}

.drink-item {
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 16px;
  padding: 8px;
  background: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.drink-item:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.drink-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.drink-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
}

.bottom-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 20px;
  max-width: 320px;
}

.back-button,
.try-again-button {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  font-weight: 700;
  padding: 12px 25px;
  background: linear-gradient(135deg, #ffd93d, #f7dc6f);
  color: #2c3e50;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover,
.try-again-button:hover {
  background: linear-gradient(135deg, #fff176, #f9e79f);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 217, 61, 0.4);
}

.fun-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 4px;
  text-align: center;
  font-size: clamp(0.7rem, 1.8vw, 0.85rem);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  z-index: 1000;
  pointer-events: none;
}

.fun-footer a {
  pointer-events: auto;
  color: rgba(255, 255, 255, 0.75);
}

.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  z-index: 1200;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
}

.secret-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.secret-card {
  background: #ffffffee;
  padding: 24px 28px;
  border-radius: 18px;
  max-width: 360px;
  width: 90%;
  text-align: center;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
}

.secret-card h3 {
  margin-bottom: 12px;
  color: #351b52;
}

.secret-card p {
  margin-bottom: 18px;
  color: #4a2d6f;
  line-height: 1.4;
}

.secret-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (min-width: 768px) {
  .quiz-app.home-page {
    background-size: auto 100svh;
  }

  .quiz-app.all-drinks-page .wrapper {
    max-width: 600px;
  }

  .drinks-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .bottom-buttons {
    flex-direction: row;
    max-width: 440px;
  }

  .secret-actions {
    flex-direction: row;
    justify-content: center;
  }
}

@media (min-width: 1200px) {
  .quiz-app.home-page {
    background-size: auto 100svh;
  }

  .quiz-app.all-drinks-page .wrapper {
    max-width: 900px;
  }

  .drinks-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 25px;
  }
}
</style>
