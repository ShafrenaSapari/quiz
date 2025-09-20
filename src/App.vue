<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from "vue";

type ScoreKey =
  | "introvertScore"
  | "extrovertScore"
  | "judgingScore"
  | "perceivingScore"
  | "sensingScore"
  | "intuitionScore"
  | "thinkingScore"
  | "feelingScore";

type ScoreDelta = Partial<Record<ScoreKey, number>>;

type ScoreState = Record<ScoreKey, number>;

type View =
  | "home"
  | "quiz"
  | "ending"
  | "results"
  | "allDrinks"
  | "drinkDetail"
  | "secretHome"
  | "secretQuiz"
  | "secretResult";

interface Question {
  question: string;
  choices: string[];
  weights: ScoreDelta[];
}

interface Drink {
  name: string;
  image: string;
  thumbnail: string;
}

interface SecretDrink {
  name: string;
  image: string;
}

const PLACEHOLDER_IMAGE = "/copyright-placeholder.svg";

const questions: Question[] = [
  {
    question: "When you receive your monthly pay, what’s the FIRST thing you usually do?",
    choices: [
      "Set aside savings immediately.",
      "Treat yourself to something nice.",
      "Split it between savings and investments.",
      "Dream about the big goals it’ll help you achieve.",
      "Quietly stash some away without telling anyone.",
      "Think of ways to grow it with side hustles."
    ],
    weights: [
      { judgingScore: 2, sensingScore: 1 },
      { extrovertScore: 2, feelingScore: 1 },
      { judgingScore: 1, thinkingScore: 1, perceivingScore: 1 },
      { intuitionScore: 2, feelingScore: 1 },
      { introvertScore: 2, sensingScore: 1 },
      { extrovertScore: 1, intuitionScore: 1, perceivingScore: 1 }
    ]
  },
  {
    question:
      "If you suddenly received a $1,000 windfall, how would you use it?",
    choices: [
      "Deposit it straight into your savings.",
      "Splurge on something fun you’ve been eyeing.",
      "Save part, invest part.",
      "Put it towards your dream (home, trip, education).",
      "Keep it tucked away quietly for a rainy day.",
      "Use it as capital for a small project or hustle."
    ],
    weights: [
      { sensingScore: 2, judgingScore: 1 },
      { extrovertScore: 2, perceivingScore: 1 },
      { thinkingScore: 2, judgingScore: 1 },
      { intuitionScore: 2, feelingScore: 1 },
      { introvertScore: 2, sensingScore: 1 },
      { extrovertScore: 1, thinkingScore: 1, perceivingScore: 1 }
    ]
  },
  {
    question:
      "How do you usually feel about taking financial risks?\"",
    choices: [
      "Avoid them — safety first.",
      "Excited — why not try?",
      "Open, but only with balance.",
      "Necessary if it gets me closer to my goals.",
      "Prefer quiet, safe growth.",
      "Love risks — they mean opportunities.",
    ],
    weights: [
      { thinkingScore: 2, judgingScore: 1 },
      { feelingScore: 2, perceivingScore: 1 }
    ]
  },
  {
    question:
      'What does “budgeting” mean to you?',
    choices: [
      "An essential routine — I follow my budget closely.",
      "Restrictive — I prefer flexibility.",
      "A guide, but not too strict.",
      "A tool to track how close I am to my dreams.",
      "A quiet discipline I keep to myself.",
      "A flexible map — I budget, but always leave room for new opportunities."
    ],
    weights: [
      { judgingScore: 2, intuitionScore: 1 },
      { perceivingScore: 2, sensingScore: 1 }
    ]
  },
  {
    question:
      'When friends describe your money habits, they say you’re…"',
    choices: [
      "Steady and disciplined.",
      "Fun and generous",
      "Balanced and sensible.",
      "Ambitious and forward-looking.",
      "Low-key but dependable.",
      "Hustling and creative."
    ],
    weights: [
      { extrovertScore: 2, feelingScore: 1 },
      { introvertScore: 2, thinkingScore: 1 }
    ]
  },
  {
    question:
      "Your ideal investment style is...",
    choices: [
      "Low-risk, steady returns.",
      "High-risk, instant thrill.",
      "Balanced portfolio.",
      "Growth-focused, long-term.",
      "Conservative, hidden savings with small steps into investing.",
      "Business ventures, side hustles, quick growth."
    ],
    weights: [
      { perceivingScore: 2, intuitionScore: 1 },
      { judgingScore: 2, sensingScore: 1 }
    ]
  },
  {
    question:
      'When it comes to shopping, your approach is:"',
    choices: [
      "Buy only what I need.",
      "If I like it, I buy it",
      "Mix of needs and wants.",
      "Buy things that remind me of my dreams.",
      "Prefer not to shop much, I keep it simple.",
      "Always compare prices and see if I can resell/flip."
    ],
    weights: [
      { sensingScore: 2, judgingScore: 1 },
      { intuitionScore: 2, perceivingScore: 1 }
    ]
  },
  {
    question:
      'What motivates you most in money matters?"',
    choices: [
      "Stability and security.",
      "Enjoying life today.",
      "Having balance and peace of mind.",
      "Building towards a bigger dream.",
      "Quiet assurance of safety.",
      "Freedom to chase opportunities."
    ],
    weights: [
      { thinkingScore: 2, judgingScore: 1 },
      { feelingScore: 2, perceivingScore: 1 }
    ]
  },
  {
   question:
      'If a financial challenge hits you, how do you respond?"',
    choices: [
      "Stick to my savings buffer.",
      "Panic a bit but figure it out later.",
      "Re-adjust between savings and investments.",
      "Think of how it affects my long-term goals.",
      "Quietly rely on the reserves I’ve built",
      "Try to create a quick side income to cover it."
    ],
    weights: [
      { perceivingScore: 2, intuitionScore: 1 },
      { judgingScore: 2, sensingScore: 1 }
    ]
  },
  {
    question:
      'Which local kuih would you reach for at a pasar malam?"',
    choices: [
      "Kuih Lapis — comforting, layered, classic",
      "Ondeh-Ondeh — sweet, surprising, playful.",
      "Putri Salat — balanced, two flavours in one.",
      "Putri Ayu — eye-catching, aspirational",
      "Kuih Dadar — humble, wrapped, underrated.",
      "Apam Balik — crispy, filled with surprises."
    ],
    weights: [
      { sensingScore: 2, judgingScore: 1 },
      { intuitionScore: 2, perceivingScore: 1 }
    ]
  }
];

const questionImages = questions.map(() => PLACEHOLDER_IMAGE);
const endingImage = PLACEHOLDER_IMAGE;
const secretImage = PLACEHOLDER_IMAGE;

const resultMap = {
  ENTJ: {
    name: "Teh C Kosong",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  INTJ: {
    name: "Kopi Gao",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  ENTP: {
    name: "Soursop Juice",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  INTP: {
    name: "Black & White",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  ENFJ: {
    name: "Barley Water",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  INFJ: {
    name: "Chrysanthemum Tea",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  ENFP: {
    name: "Milo Dinosaur",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  INFP: {
    name: "Bandung",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  ESFJ: {
    name: "Honey Lemon",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  ISFJ: {
    name: "Soya Milk",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  ESTJ: {
    name: "Lime Juice",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  ISTJ: {
    name: "Kopi O Kosong",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  ESTP: {
    name: "Coconut Shake",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  ISTP: {
    name: "Sugarcane Juice",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  ESFP: {
    name: "Bubble Tea",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  },
  ISFP: {
    name: "Avocado Shake",
    image: PLACEHOLDER_IMAGE,
    thumbnail: PLACEHOLDER_IMAGE
  }
} as const satisfies Record<string, Drink>;

type MbtiCode = keyof typeof resultMap;

const secretResults: SecretDrink[] = [
  {
    name: "Strawberry Matcha Latte",
    image: PLACEHOLDER_IMAGE
  },
  {
    name: "Butterfly Pea Passionfruit Tea",
    image: PLACEHOLDER_IMAGE
  }
];

const secretScenario = {
  question:
    "At midnight, you find a hidden door behind a library bookshelf. Inside sits a Timekeeper who offers you one of two clocks.",
  choices: [
    "One clock slows down moments of comfort, allowing you to savour every peaceful pause.",
    "The other speeds up decision-making, helping you act on instinct and ride emotional waves confidently."
  ]
};

const view = ref<View>("home");
const questionIndex = ref(0);
const scores = reactive<ScoreState>({
  introvertScore: 0,
  extrovertScore: 0,
  judgingScore: 0,
  perceivingScore: 0,
  sensingScore: 0,
  intuitionScore: 0,
  thinkingScore: 0,
  feelingScore: 0
});

const currentMbti = ref<MbtiCode | null>(null);
const toastMessage = ref("");
let toastTimer: number | null = null;

const secretUnlocked = ref(false);
const secretPromptOpen = ref(false);
const secretClicks = ref(0);
const secretChoice = ref<number | null>(null);

const rootClasses = computed(() => {
  const classes = ["quiz-app"] as string[];
  if (view.value === "home") classes.push("home-page");
  if (view.value === "secretHome") classes.push("home-page", "secret-home-page");
  if (view.value === "results" || view.value === "drinkDetail") classes.push("results-page");
  if (view.value === "allDrinks") classes.push("all-drinks-page");
  if (view.value === "secretQuiz" || view.value === "secretResult") {
    classes.push("results-page", "secret-home-page");
  }
  return classes;
});

const showStarField = computed(() => rootClasses.value.includes("home-page"));

const currentResult = computed(() => {
  if (!currentMbti.value) return null;
  return {
    code: currentMbti.value,
    drink: resultMap[currentMbti.value]
  };
});

const allDrinks = computed(() =>
  Object.entries(resultMap).map(([code, drink]) => ({ code: code as MbtiCode, drink }))
);

const secretResult = computed(() => {
  if (secretChoice.value == null) return null;
  return secretResults[secretChoice.value] ?? null;
});

function resetScores() {
  (Object.keys(scores) as ScoreKey[]).forEach(key => {
    scores[key] = 0;
  });
}

function startQuiz() {
  resetScores();
  questionIndex.value = 0;
  currentMbti.value = null;
  view.value = "quiz";
}

function applyWeights(weight?: ScoreDelta) {
  if (!weight) return;
  (Object.keys(weight) as ScoreKey[]).forEach(key => {
    scores[key] += weight[key] ?? 0;
  });
}

function answerQuestion(choiceIdx: number) {
  const question = questions[questionIndex.value];
  const weight = question.weights[choiceIdx];
  applyWeights(weight);
  if (questionIndex.value < questions.length - 1) {
    questionIndex.value += 1;
  } else {
    view.value = "ending";
  }
}

function computeMbti(): MbtiCode {
  const letters = [
    scores.extrovertScore > scores.introvertScore ? "E" : "I",
    scores.sensingScore > scores.intuitionScore ? "S" : "N",
    scores.thinkingScore > scores.feelingScore ? "T" : "F",
    scores.judgingScore > scores.perceivingScore ? "J" : "P"
  ].join("");
  return letters as MbtiCode;
}

function revealResult() {
  currentMbti.value = computeMbti();
  view.value = "results";
}

function viewAllDrinks() {
  view.value = "allDrinks";
}

function openDrinkDetail(code: MbtiCode) {
  currentMbti.value = code;
  view.value = "drinkDetail";
}

function goBackToResults() {
  view.value = "results";
}

function tryAgain() {
  resetScores();
  questionIndex.value = 0;
  currentMbti.value = null;
  view.value = "home";
}

function showToast(message: string) {
  toastMessage.value = message;
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastMessage.value = "";
  }, 2200);
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Message copied! ✨");
  } catch (error) {
    console.error("Clipboard copy failed", error);
  }
}

async function shareQuest(isSecret = false) {
  const result = currentResult.value;
  const drinkName = isSecret && secretResult.value ? secretResult.value.name : result?.drink.name;
  const shareText = isSecret
    ? `🤫 I unlocked this secret drink in LimSimi! Try to find the secret entrance from the first page! 🥤🔒\n${window.location.href}`
    : `✨ Wah! I'm ${drinkName ?? "my drink"} in the LimSimi Quiz! 🥤 Come and find out your Singapore drink match! 🇸🇬\n${window.location.href}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: "🍵 LimSimi Quiz - My Singapore Drink!",
        text: shareText
      });
      return;
    }
  } catch (error) {
    console.warn("Share failed, falling back to clipboard", error);
  }

  await copyText(shareText);
}

async function copyResultLink() {
  await copyText(window.location.href);
}

function handleTitleClick() {
  if (secretUnlocked.value) return;
  secretClicks.value += 1;
  if (secretClicks.value >= 5) {
    secretPromptOpen.value = true;
    secretClicks.value = 0;
  }
}

function confirmSecretMode() {
  secretPromptOpen.value = false;
  secretUnlocked.value = true;
  view.value = "secretHome";
}

function cancelSecretMode() {
  secretPromptOpen.value = false;
}

function startSecretJourney() {
  secretChoice.value = null;
  view.value = "secretQuiz";
}

function answerSecret(choiceIdx: number) {
  secretChoice.value = choiceIdx;
  view.value = "secretResult";
}

function resetSecret() {
  secretUnlocked.value = false;
  secretChoice.value = null;
  view.value = "home";
}

onBeforeUnmount(() => {
  if (toastTimer) {
    window.clearTimeout(toastTimer);
    toastTimer = null;
  }
});
</script>

<template>
  <div :class="rootClasses">
    <div v-if="showStarField" class="star-field"></div>

    <div class="wrapper">
      <!-- Home -->
      <template v-if="view === 'home'">
        <header class="header">
          <h1 class="title" @click="handleTitleClick">Kuih-nomics</h1>
        </header>
        <h2 class="subtitle">What’s Your Financial Flavour?</h2>
        <h3 class="description">
          Let's masuk dapur and find out which kuih matches<br/> your financial personality!
        </h3>
        <button class="btn main-button" @click="startQuiz">Take the quiz</button>
      </template>

      <!-- Secret landing -->
      <template v-else-if="view === 'secretHome'">
        <header class="header">
          <h1 class="title" @click="handleTitleClick">Kuih-nomics</h1>
        </header>
        <h2 class="subtitle">
          Discover your Singaporean Drink!<br />
          (Secret Mode)
        </h2>
        <h3 class="description">You have unlocked a secret journey. Ready?</h3>
        <button class="btn main-button" @click="startSecretJourney">Start Secret Journey</button>
      </template>

      <!-- Quiz -->
      <template v-else-if="view === 'quiz'">
        <div class="quiz-container">
          <div class="question-number">Q{{ questionIndex + 1 }}/{{ questions.length }}</div>
          <div class="question-container">
            <div class="question">{{ questions[questionIndex].question }}</div>
            <img
              :src="questionImages[questionIndex]"
              alt="Question Scene"
              class="question-image"
            />
          </div>
          <div class="choices-container">
            <button
              v-for="(choice, idx) in questions[questionIndex].choices"
              :key="idx"
              class="btn choice"
              @click="answerQuestion(idx)"
            >
              {{ choice }}
            </button>
          </div>
        </div>
      </template>

      <!-- Ending scene -->
      <template v-else-if="view === 'ending'">
        <div class="quiz-container">
          <div class="question">
            You find yourself back at the original hawker stall, but now the mysterious uncle is holding a steaming cup of your perfectly crafted drink. "Wah, you completed the whole quest! Your journey through magical Singapore has revealed exactly which drink matches your personality."
          </div>
          <img :src="endingImage" alt="Uncle preparing your destined drink" class="question-image" />
          <div class="choices-container">
            <button class="btn whoosh-button" @click="revealResult">Reveal My Drink!</button>
          </div>
        </div>
      </template>

      <!-- Results -->
      <template v-else-if="view === 'results' && currentResult">
        <div class="results-container">
          <div class="share-header">
            <div class="share-text">Feel free to share your result at</div>
            <div class="share-hashtag">#LimSimiQuiz</div>
            <div class="share-tip">psst... long press to save your drink card!</div>
          </div>
          <div class="result-card">
            <img
              :src="currentResult.drink.image"
              :alt="currentResult.drink.name"
              class="drink-result-image"
            />
          </div>
          <div class="button-container">
            <button class="btn small-button" @click="shareQuest()">Share Quest</button>
            <button class="btn small-button" @click="viewAllDrinks">All Drinks</button>
          </div>
          <div class="button-container">
            <button class="btn small-button" @click="copyResultLink">Copy Link</button>
            <button class="btn small-button" @click="tryAgain">Try Again</button>
          </div>
        </div>
      </template>

      <!-- All drinks overview -->
      <template v-else-if="view === 'allDrinks'">
        <div class="all-drinks-container">
          <h1 class="page-title">Kopitiam Menu</h1>
          <p class="page-subtitle">Discover every personality drink match!</p>
          <div class="drinks-grid">
            <button
              v-for="item in allDrinks"
              :key="item.code"
              class="drink-item"
              @click="openDrinkDetail(item.code)"
            >
              <img :src="item.drink.thumbnail" :alt="item.drink.name" class="drink-thumbnail" />
            </button>
          </div>
          <div class="bottom-buttons">
            <button class="btn back-button" @click="goBackToResults">← Back to Results</button>
            <button class="btn try-again-button" @click="tryAgain">Try Again</button>
          </div>
        </div>
      </template>

      <!-- Drink detail -->
      <template v-else-if="view === 'drinkDetail' && currentResult">
        <div class="results-container">
          <div class="share-header">
            <div class="share-text">Drink Details</div>
            <div class="share-tip">Long press to save your drink card</div>
          </div>
          <div class="result-card">
            <img
              :src="currentResult.drink.image"
              :alt="currentResult.drink.name"
              class="drink-result-image"
            />
          </div>
          <div class="button-container">
            <button class="btn small-button" @click="viewAllDrinks">← All Drinks</button>
            <button class="btn small-button" @click="tryAgain">Take Quiz</button>
          </div>
        </div>
      </template>

      <!-- Secret quiz -->
      <template v-else-if="view === 'secretQuiz'">
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

      <!-- Secret result -->
      <template v-else-if="view === 'secretResult' && secretResult">
        <div class="results-container">
          <div class="share-header">
            <div class="share-text">Secret Result</div>
            <div class="share-text">wow... you found your way here!</div>
            <div class="share-tip">share this around but don't reveal the secret! ;)</div>
          </div>
          <div class="result-card">
            <img :src="secretResult.image" :alt="secretResult.name" class="drink-result-image" />
          </div>
          <div class="button-container">
            <button class="btn small-button" @click="shareQuest(true)">Share</button>
            <button class="btn small-button" @click="resetSecret">Back to Normal</button>
          </div>
        </div>
      </template>
    </div>
<!-----
    <footer class="fun-footer">
      <p>
        <a href="https://coff.ee/tyeckh" target="_blank" rel="noopener noreferrer">Support with a kopi</a>
        if you enjoyed the quiz!<br />
        <a href="https://forms.gle/Sd8VgC4Pvqy4YneL7" target="_blank" rel="noopener noreferrer">lmk your thoughts here!</a>
        © 2025 LimSimi.
      </p>
    </footer>
    --->

    <div v-if="secretPromptOpen" class="secret-modal">
      <div class="secret-card">
        <h3>You found a hidden portal!</h3>
        <p>Unlock secret mode and continue the LimSimi quest?</p>
        <div class="secret-actions">
          <button class="btn small-button" @click="confirmSecretMode">Unlock Secret Mode</button>
          <button class="btn small-button" @click="cancelSecretMode">Maybe later</button>
        </div>
      </div>
    </div>

    <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
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

.quiz-app.home-page {
  background-image: url("/copyright-placeholder.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.quiz-app.home-page.secret-home-page {
  background-image: url("/copyright-placeholder.svg");
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
  height: 100svh;
  text-align: center;
  padding: 10px 20px;
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
  width: 100%;
  max-width: 400px;
  height: 100svh;
  display: flex;
  flex-direction: column;
  padding: 20px 0 0;
  margin: 0 auto;
  align-items: center;
  flex-grow: 1;
}

.question-number {
  position: absolute;
  top: 0;
  left: 20px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffffe6;
}

.question-image {
  width: 100%;
  max-width: 320px;
  height: auto;
  object-fit: contain;
  margin: 0 auto 15px;
  display: block;
  border-radius: 5px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.3);
}

.question {
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
  text-align: center;
  margin: 20px 0 10px;
}

.choices-container {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 12px;
  width: 90%;
  max-width: 440px;
  margin-bottom: 20px;
}

@media (min-width: 600px) {
  .choices-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.choice {
  font-size: clamp(1rem, 3vw, 1.2rem);
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

.choice:hover {
  background: #f5f5f5;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
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

.share-header {
  text-align: center;
  margin-bottom: 0;
  color: #e5ecff;
}

.share-text {
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 600;
}

.share-hashtag {
  color: #fff;
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  text-decoration: none;
  font-weight: 700;
}

.share-tip {
  font-size: clamp(0.95rem, 1.8vw, 1.05rem);
  font-weight: 700;
}

.result-card {
  background: transparent;
  border-radius: 0;
  padding: 5px 20px 10px;
  text-align: center;
  max-width: 450px;
  position: relative;
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
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  width: 100%;
  margin-bottom: 30px;
}

.drink-item {
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
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
