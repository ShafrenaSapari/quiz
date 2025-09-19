<script setup lang="ts">
import { ref, computed } from "vue";

// ----- Types -----
type Tag = "kopi" | "teh" | "milo";
type Option = { text: string; tag: Tag; img: string };
type Question = { text: string; options: Option[] };

const step = ref(0);
const answers = ref<Option[]>([]);

// ----- Quiz Data (swap images if you like) -----
const questions: Question[] = [
  {
    text: "Pick a drink to start your day:",
    options: [
      { text: "Teh Tarik", tag: "teh",  img: "https://images.unsplash.com/photo-1642488682688-0a2aaed7aaf3?q=80&w=800&auto=format&fit=crop" },
      { text: "Kopi",      tag: "kopi", img: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop" },
      { text: "Milo",      tag: "milo", img: "https://images.unsplash.com/photo-1561214078-f3247647fc5b?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  {
    text: "How do you like it?",
    options: [
      { text: "Kaw kaw (strong!)",   tag: "kopi", img: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=800&auto=format&fit=crop" },
      { text: "Just nice (balanced)", tag: "teh",  img: "https://images.unsplash.com/photo-1487029413235-e3f7d7b17e16?q=80&w=800&auto=format&fit=crop" },
      { text: "Gao but sweet",        tag: "milo", img: "https://images.unsplash.com/photo-1489084917528-a57e68a79a1e?q=80&w=800&auto=format&fit=crop" }
    ]
  },
  {
    text: "Hot or iced?",
    options: [
      { text: "Hot",           tag: "kopi", img: "https://images.unsplash.com/photo-1494314671902-399b18174975?q=80&w=800&auto=format&fit=crop" },
      { text: "Iced",          tag: "milo", img: "https://images.unsplash.com/photo-1600627225432-82de69ae1676?q=80&w=800&auto=format&fit=crop" },
      { text: "Warm & creamy", tag: "teh",  img: "https://images.unsplash.com/photo-1532768641073-503a250f9754?q=80&w=800&auto=format&fit=crop" }
    ]
  }
];

// ----- Result Map -----
const resultMap: Record<Tag, { title: string; desc: string; img: string }> = {
  kopi: {
    title: "You’re Kopi ☕",
    desc: "Bold, classic, and straight to the point. People count on you to deliver.",
    img: "https://images.unsplash.com/photo-1523942839745-7848d4a0b3b7?q=80&w=800&auto=format&fit=crop"
  },
  teh: {
    title: "You’re Teh Tarik 🫖",
    desc: "Smooth, warm, and social. You bring people together effortlessly.",
    img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=800&auto=format&fit=crop"
  },
  milo: {
    title: "You’re Milo 🥤",
    desc: "Playful, nostalgic, and full of energy. You keep the vibes fun.",
    img: "https://images.unsplash.com/photo-1598512753217-98b2f2fb3f55?q=80&w=800&auto=format&fit=crop"
  }
};

// ----- Logic -----
function chooseOption(opt: Option) {
  answers.value[step.value] = opt;
  if (step.value < questions.length - 1) {
    step.value++;
  } else {
    step.value = questions.length; // mark complete
  }
}

function back() {
  if (step.value > 0) step.value--;
}

function restart() {
  step.value = 0;
  answers.value = [];
}

const quizComplete = computed(() => step.value >= questions.length);

const finalTag = computed<Tag>(() => {
  // Count selected tags
  const counts: Record<Tag, number> = { kopi: 0, teh: 0, milo: 0 };
  answers.value.forEach(a => counts[a.tag]++);
  // Winner by max count (ties resolved by order)
  const [winner] = (Object.entries(counts) as [Tag, number][])
    .sort((a, b) => b[1] - a[1])[0];
  return winner;
});

const finalResult = computed(() => resultMap[finalTag.value]);

const progressPct = computed(() => {
  const answered = Math.min(step.value, questions.length);
  return Math.round((answered / questions.length) * 100);
});
</script>

<template>
  <main class="wrap">
    <header class="header">
      <h1>LimSimi Mini Quiz</h1>
      <div class="progress"><div class="bar" :style="{ width: (quizComplete ? 100 : progressPct) + '%' }"></div></div>
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

    <!-- Result -->
    <section v-else class="card result">
      <img class="hero" :src="finalResult.img" :alt="finalResult.title" />
      <h2>{{ finalResult.title }}</h2>
      <p class="desc">{{ finalResult.desc }}</p>

      <div class="chosen">
        <h3>Your picks</h3>
        <ul>
          <li v-for="(a, i) in answers" :key="i">Q{{ i + 1 }}: {{ a.text }}</li>
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
  --card: #111218;
  --muted: #a0a3ad;
  --fg: #e9e9f0;
  --accent: #6ce2cf;
  --accent-2: #9b7df5;
}
* { box-sizing: border-box; }
.wrap {
  max-width: 920px;
  margin: 0 auto;
  padding: 24px;
  color: var(--fg);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  background: #0b0c10;
  min-height: 100vh;
}
.header h1 { margin: 0 0 8px; font-size: 28px; }
.progress { width: 100%; height: 8px; background: #22242d; border-radius: 999px; overflow: hidden; margin: 8px 0 6px; }
.bar { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); transition: width 240ms ease; }
.muted { color: var(--muted); font-size: 14px; }
.card { margin-top: 16px; background: var(--card); border: 1px solid #1b1e27; border-radius: 16px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,.25); }
.q { margin: 0 0 12px; font-size: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
.option { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; background: #141722; border: 1px solid #262a37; border-radius: 14px; padding: 14px; cursor: pointer; transition: transform 120ms ease, border-color 120ms ease, background 120ms ease; }
.option:hover { transform: translateY(-2px); border-color: #353b4f; }
.thumb { width: 100%; height: 140px; object-fit: cover; border-radius: 10px; }
.label { font-weight: 600; }
.actions { display: flex; justify-content: space-between; margin-top: 14px; }
.btn { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color: #0a0b0f; border: none; border-radius: 10px; padding: 10px 14px; font-weight: 700; cursor: pointer; }
.btn.ghost { background: transparent; color: var(--fg); border: 1px solid #2a2f3f; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.result { display: grid; gap: 12px; align-items: start; }
.hero { width: 100%; max-height: 260px; object-fit: cover; border-radius: 12px; border: 1px solid #262a37; }
.desc { color: var(--fg); margin: 4px 0 12px; }
.chosen ul { margin: 6px 0 0 18px; padding: 0; }
.footer { margin-top: 16px; text-align: center; color: var(--muted); font-size: 13px; }
</style>
