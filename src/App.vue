<script setup>
import { ref, computed } from "vue";

/* If you imported local images, keep your imports here and
   assign them to the img fields below. The URLs here are just placeholders. */

const step = ref(0);
const answers = ref([]); // store the picked option object at each index

const questions = [
  {
    text: "Pick a drink to start your day:",
    options: [
      { text: "Teh Tarik", tag: "teh",  img: "https://picsum.photos/seed/teh/600/400" },
      { text: "Kopi",      tag: "kopi", img: "https://picsum.photos/seed/kopi/600/400" },
      { text: "Milo",      tag: "milo", img: "https://picsum.photos/seed/milo/600/400" }
    ]
  },
  {
    text: "How do you like it?",
    options: [
      { text: "Kaw kaw (strong!)", tag: "kopi", img: "https://picsum.photos/seed/strong/600/400" },
      { text: "Just nice (balanced)", tag: "teh", img: "https://picsum.photos/seed/balanced/600/400" },
      { text: "Gao but sweet", tag: "milo", img: "https://picsum.photos/seed/sweet/600/400" }
    ]
  },
  {
    text: "Hot or iced?",
    options: [
      { text: "Hot",         tag: "kopi", img: "https://picsum.photos/seed/hot/600/400" },
      { text: "Iced",        tag: "milo", img: "https://picsum.photos/seed/iced/600/400" },
      { text: "Warm & creamy", tag: "teh", img: "https://picsum.photos/seed/warm/600/400" }
    ]
  }
];

const resultMap = {
  kopi: {
    title: "You’re Kopi ☕",
    desc: "Bold, classic, and straight to the point.",
    img: "https://picsum.photos/seed/kopi-result/800/450"
  },
  teh: {
    title: "You’re Teh Tarik 🫖",
    desc: "Smooth, warm, and social.",
    img: "https://picsum.photos/seed/teh-result/800/450"
  },
  milo: {
    title: "You’re Milo 🥤",
    desc: "Playful, nostalgic, and full of energy.",
    img: "https://picsum.photos/seed/milo-result/800/450"
  }
};

// --- interaction ---
function chooseOption(opt) {
  // record the answer for the current step
  answers.value[step.value] = opt;
  // advance to next question if any
  if (step.value < questions.length - 1) {
    step.value++;
  } else {
    // we're done; trigger computed quizComplete to flip to result view
    step.value = questions.length;
  }
}

function back() {
  if (step.value > 0) step.value--;
}

function restart() {
  step.value = 0;
  answers.value = [];
}

// --- derived state ---
const quizComplete = computed(() => step.value >= questions.length);

// Counts tags safely and picks a winner; returns null if anything missing
const finalTag = computed(() => {
  if (!quizComplete.value) return null;
  const counts = { kopi: 0, teh: 0, milo: 0 };
  for (const a of answers.value) {
    if (a && a.tag && counts.hasOwnProperty(a.tag)) counts[a.tag] += 1;
  }
  // find the tag with max count
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [winner, score] = sorted[0];
  // if all zero (shouldn’t happen, but guard anyway), return a default
  return score > 0 ? winner : "kopi";
});

// Safe final result object with a fallback
const finalResult = computed(() => {
  const tag = finalTag.value;
  return (tag && resultMap[tag]) || {
    title: "You’re… a Surprise Mix 🥤",
    desc: "Tastes change — and that’s fun! Try again for a clearer vibe.",
    img: "https://picsum.photos/seed/fallback/800/450"
  };
});

// progress bar (0..100)
const progressPct = computed(() => {
  const answered = Math.min(step.value, questions.length);
  return Math.round((answered / questions.length) * 100);
});
</script>

<template>
  <main class="wrap">
    <header class="header">
      <h1>LimSimi Mini Quiz</h1>
      <div class="progress">
        <div class="bar" :style="{ width: (quizComplete ? 100 : progressPct) + '%' }"></div>
      </div>
      <p class="muted" v-if="!quizComplete">Question {{ step + 1 }} of {{ questions.length }}</p>
      <p class="muted" v-else>All done — here’s your vibe!</p>
    </header>

    <!-- Questions -->
    <section v-if="!quizComplete" class="card">
      <h2 class="q">{{ questions[step].text }}</h2>
      <div class="grid">
        <button
          v-for="(opt, idx) in questions[step].options"
          :key="idx"
          class="option"
          @click="chooseOption(opt)"
        >
          <img class="thumb" :src="opt.img" :alt="opt.text" />
          <span class="label">{{ opt.text }}</span>
        </button>
      </div>
      <div class="actions">
        <button class="btn ghost" @click="back" :disabled="step === 0">Back</button>
      </div>
    </section>

    <!-- Result (SAFE: only uses finalResult which always exists) -->
    <section v-else class="card result">
      <img class="hero" :src="finalResult.img" :alt="finalResult.title" />
      <h2>{{ finalResult.title }}</h2>
      <p class="desc">{{ finalResult.desc }}</p>

      <div class="chosen">
        <h3>Your picks</h3>
        <ul>
          <li v-for="(a, i) in answers" :key="i">Q{{ i + 1 }}: {{ a?.text || '—' }}</li>
        </ul>
      </div>

      <div class="actions">
        <button class="btn" @click="restart">Restart</button>
      </div>
    </section>

    <footer class="footer">
      <span class="muted">Built with Vue + Vite</span>
    </footer>
  </main>
</template>

<style scoped>
:root {
  --bg: #0b0c10;
  --card: #111218;
  --muted: #a0a3ad;
  --fg: #e9e9f0;
  --accent: #6ce2cf;
  --accent-2: #9b7df5;
}
* { box-sizing: border-box; }
body, html, #app { height: 100%; }
.wrap {
  max-width: 920px;
  margin: 0 auto;
  padding: 24px;
  color: var(--fg);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
}
.header h1 { margin: 0 0 8px; font-size: 28px; }
.progress {
  width: 100%;
  height: 8px;
  background: #22242d;
  border-radius: 999px;
  overflow: hidden;
  margin: 8px 0 6px;
}
.bar { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); transition: width 240ms ease; }
.muted { color: var(--muted); font-size: 14px; }
.card {
  margin-top: 16px;
  background: var(--card);
  border: 1px solid #1b1e27;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
}
.q { margin: 0 0 12px; font-size: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
.option {
  display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center;
  background: #141722; border: 1px solid #262a37; border-radius: 14px; padding: 14px; cursor: pointer;
  transition: transform 120ms ease, border-color 120ms ease, background 120ms ease;
}
.option:hover { transform: translateY(-2px); border-color: #353b4f; }
.thumb { width: 100%; height: 140px; object-fit: cover; border-radius: 10px; }
.label { font-weight: 600; }
.actions { display: flex; justify-content: space-between; margin-top: 14px; }
.btn {
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  color: #0a0b0f; border: none; border-radius: 10px; padding: 10px 14px; font-weight: 700; cursor: pointer;
}
.btn.ghost { background: transparent; color: var(--fg); border: 1px solid #2a2f3f; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.result { display: grid; gap: 12px; align-items: start; }
.hero {
  width: 100%; max-height: 260px; object-fit: cover; border-radius: 12px; border: 1px solid #262a37;
}
.desc { color: var(--fg); margin: 4px 0 12px; }
.chosen ul { margin: 6px 0 0 18px; padding: 0; }
.footer { margin-top: 16px; text-align: center; color: var(--muted); font-size: 13px; }
</style>
