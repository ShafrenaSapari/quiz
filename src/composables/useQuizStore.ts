import { computed, reactive, ref } from 'vue'

export interface Question {
  question: string
  choices: string[]
}

export interface Persona {
  id: PersonaId
  name: string
  image: string
  thumbnail: string
  headline: string
  traits: string[]
  financialPersonality: string
  story: string
  cta: string
}

export type PersonaId =
  | 'kuih-lapis'
  | 'ondeh-ondeh'
  | 'putri-salat'
  | 'putri-ayu'
  | 'kuih-dadar'
  | 'apam-balik'

export const PLACEHOLDER_IMAGE = '/copyright-placeholder.svg'

export const personas: Persona[] = [
  {
    id: 'kuih-lapis',
    name: 'Kuih Lapis',
    image: '/personas/kuih-lapis.svg',
    thumbnail: '/personas/kuih-lapis.svg',
    headline: 'The Layered Planner',
    traits: [
      'Just like kuih lapis is built layer by layer, you build your finances slowly but surely.',
      'You believe in consistency—small savings, steady investments, disciplined planning.',
      'Others may call you “boring,” but you know stability is your superpower.'
    ],
    financialPersonality: 'Conservative investor, prefers safe options like savings, insurance, and bonds.',
    story:
      'Like kuih lapis, you stack your money layer by layer. Patient, steady, and never in a rush. Wah, power lah, your consistency is solid! But hor, if just keep stacking without flavour, inflation will slowly makan your layers. Don’t let your hard work go bland—let’s add some safe “pandan custard” to sweeten your plan.',
    cta: 'Book your free consult now and keep your kuih (and your wallet) nice and shiok for years to come!'
  },
  {
    id: 'ondeh-ondeh',
    name: 'Ondeh-Ondeh',
    image: '/personas/ondeh-ondeh.svg',
    thumbnail: '/personas/ondeh-ondeh.svg',
    headline: 'The Surprise Spender',
    traits: [
      'Like biting into ondeh-ondeh, people never know what surprise you’ll bring next.',
      'You enjoy the sweetness of life today rather than waiting for tomorrow.',
      'While this makes you the life of the party, sometimes your wallet feels the “sugar rush” crash too.'
    ],
    financialPersonality: 'Spontaneous spender, could benefit from budgeting tools and automatic savings.',
    story:
      'Wah, life with you is always sweet until your wallet kena sugar crash! Like ondeh-ondeh, you’re full of surprises, but sometimes that burst of spending leaves you kosong inside. Don’t worry lah, you don’t have to give up your fun. Let me show you how to still enjoy your gula melaka moments and keep your wallet happy.',
    cta: 'Book your free consult now before your next impulse buy makan up your savings!'
  },
  {
    id: 'putri-salat',
    name: 'Putri Salat',
    image: '/personas/putri-salat.svg',
    thumbnail: '/personas/putri-salat.svg',
    headline: 'The Balanced Investor',
    traits: [
      'With glutinous rice below (stable base) and pandan custard above (sweet reward), you’re all about balance.',
      'You know when to play it safe and when to take calculated risks.',
      'Friends see you as someone who can enjoy today and plan for tomorrow.'
    ],
    financialPersonality: 'Moderate investor, balances savings with investments like REITs or ETFs.',
    story:
      'Steady lah, you’re like putri salat! Strong base below, sweet on top. You know how to enjoy your pandan custard today while keeping the rice foundation solid for tomorrow. But hor, balance is not just about taste—it’s about strategy.',
    cta: 'Want to make sure your money grows nicely without toppling over? Let’s fine-tune your financial recipe together. Book your free consult—confirm more shiok than your favourite kuih!'
  },
  {
    id: 'putri-ayu',
    name: 'Putri Ayu',
    image: '/personas/putri-ayu.svg',
    thumbnail: '/personas/putri-ayu.svg',
    headline: 'The Aspirational Dreamer',
    traits: [
      'Pretty and eye-catching like putri ayu, you dream big and believe in levelling up your lifestyle.',
      'You are future-focused: dream home, children’s education, comfortable retirement.',
      'Sometimes you need structure to turn those dreams into action.'
    ],
    financialPersonality: 'Growth-seeker, leans toward higher-risk investments but needs proper planning.',
    story:
      'Wah, like putri ayu, you’re sweet, pretty, and always dreaming big—from dream home to dream lifestyle. But hor, dreams need more than gula melaka vibes… they need a solid game plan. Don’t just daydream about the future; let’s build the steps to get you there without the stress.',
    cta: 'Book your free consult now and turn your ayu dreams into shiok reality!'
  },
  {
    id: 'kuih-dadar',
    name: 'Kuih Dadar',
    image: '/personas/kuih-dadar.svg',
    thumbnail: '/personas/kuih-dadar.svg',
    headline: 'The Hidden Saver',
    traits: [
      'Just like lepat pisang wrapped in banana leaf, your financial habits are hidden from the world.',
      'You don’t flaunt your money, but inside you’ve got a solid core of discipline and savings.',
      'People might underestimate you, but you’re quietly building wealth in the background.'
    ],
    financialPersonality: 'Frugal, prefers to save diligently; could explore investments to grow wealth beyond savings.',
    story:
      'Like kuih dadar, you look simple on the outside but inside got gula melaka—solid discipline and savings. Wah, power lah, you quietly build wealth without showing off. But hor, hiding too much means your money may not grow fast enough. Don’t let your gula melaka just sit there; let’s spread it properly so it multiplies.',
    cta: 'Book your free consult now and make sure your hidden savings become your sweetest asset!'
  },
  {
    id: 'apam-balik',
    name: 'Apam Balik',
    image: '/personas/apam-balik.svg',
    thumbnail: '/personas/apam-balik.svg',
    headline: 'The Opportunistic Hustler',
    traits: [
      'Like apam balik that’s crispy on the outside and filled with surprises inside, you thrive on spotting opportunities.',
      'Side hustles? Extra income streams? You’re always on the lookout.',
      'You’re not afraid of risks if it means doubling your “filling” of wealth.'
    ],
    financialPersonality: 'Entrepreneurial, enjoys higher-risk, higher-return ventures; needs to watch out for burnout or spreading too thin.',
    story:
      'Like apam balik, you’re crispy on the outside and packed with surprises inside—always on the hunt for the next big hustle. Side gigs, quick wins, extra “filling”… you chase them all! But hor, too many hustles and you might burn your apam before it’s cooked. Don’t just flip opportunities; let’s fold them into a proper plan so your money grows shiok and steady.',
    cta: 'Book your free consult now—confirm more satisfying than extra kacang inside your apam balik!'
  }
]

export const questions: Question[] = [
  {
    question: 'When you receive your monthly pay, what’s the FIRST thing you usually do?',
    choices: [
      'Set aside savings immediately.',
      'Treat yourself to something nice.',
      'Split it between savings and investments.',
      'Dream about the big goals it’ll help you achieve.',
      'Quietly stash some away without telling anyone.',
      'Think of ways to grow it with side hustles.'
    ]
  },
  {
    question: 'If you suddenly received a $1,000 windfall, how would you use it?',
    choices: [
      'Deposit it straight into your savings.',
      'Splurge on something fun you’ve been eyeing.',
      'Save part, invest part.',
      'Put it towards your dream (home, trip, education).',
      'Keep it tucked away quietly for a rainy day.',
      'Use it as capital for a small project or hustle.'
    ]
  },
  {
    question: 'How do you usually feel about taking financial risks?',
    choices: [
      'Avoid them — safety first.',
      'Excited — why not try?',
      'Open, but only with balance.',
      'Necessary if it gets me closer to my goals.',
      'Prefer quiet, safe growth.',
      'Love risks — they mean opportunities.'
    ]
  },
  {
    question: 'What does budgeting mean to you?',
    choices: [
      'An essential routine — I follow my budget closely.',
      'Restrictive — I prefer flexibility.',
      'A guide, but not too strict.',
      'A tool to track how close I am to my dreams.',
      'A quiet discipline I keep to myself.',
      'A flexible map — I budget, but always leave room for new opportunities.'
    ]
  },
  {
    question: 'When friends describe your money habits, they say you’re…',
    choices: [
      'Steady and disciplined.',
      'Fun and generous.',
      'Balanced and sensible.',
      'Ambitious and forward-looking.',
      'Low-key but dependable.',
      'Hustling and creative.'
    ]
  },
  {
    question: 'Your ideal investment style is...',
    choices: [
      'Low-risk, steady returns.',
      'High-risk, instant thrill.',
      'Balanced portfolio.',
      'Growth-focused, long-term.',
      'Conservative, hidden savings with small steps into investing.',
      'Business ventures, side hustles, quick growth.'
    ]
  },
  {
    question: 'When it comes to shopping, your approach is...',
    choices: [
      'Buy only what I need.',
      'If I like it, I buy it.',
      'Mix of needs and wants.',
      'Buy things that remind me of my dreams.',
      'Prefer not to shop much, I keep it simple.',
      'Always compare prices and see if I can resell/flip.'
    ]
  },
  {
    question: 'What motivates you most in money matters?',
    choices: [
      'Stability and security.',
      'Enjoying life today.',
      'Having balance and peace of mind.',
      'Building towards a bigger dream.',
      'Quiet assurance of safety.',
      'Freedom to chase opportunities.'
    ]
  },
  {
    question: 'If a financial challenge hits you, how do you respond?',
    choices: [
      'Stick to my savings buffer.',
      'Panic a bit but figure it out later.',
      'Re-adjust between savings and investments.',
      'Think of how it affects my long-term goals.',
      'Quietly rely on the reserves I’ve built.',
      'Try to create a quick side income to cover it.'
    ]
  },
  {
    question: 'Which local kuih would you reach for at a pasar malam?',
    choices: [
      'Kuih Lapis — comforting, layered, classic',
      'Ondeh-Ondeh — sweet, surprising, playful.',
      'Putri Salat — balanced, two flavours in one.',
      'Putri Ayu — eye-catching, aspirational',
      'Kuih Dadar — humble, wrapped, underrated.',
      'Apam Balik — crispy, filled with surprises.'
    ]
  }
]

export const questionImages = [
  '/questions/q1.jpg',
  '/questions/q2.jpg',
  '/questions/q3.jpg',
  '/questions/q4.jpg',
  '/questions/q5.jpg',
  '/questions/q6.jpg',
  '/questions/q7.jpg',
  '/questions/q8.jpg',
  '/questions/q9.jpg',
  '/questions/q10.jpg'
]

export const endingImage = PLACEHOLDER_IMAGE
export const secretImage = PLACEHOLDER_IMAGE

export interface SecretDrink {
  name: string
  image: string
}

export const secretResults: SecretDrink[] = [
  {
    name: 'Strawberry Matcha Latte',
    image: PLACEHOLDER_IMAGE
  },
  {
    name: 'Butterfly Pea Passionfruit Tea',
    image: PLACEHOLDER_IMAGE
  }
]

export const secretScenario = {
  question:
    'At midnight, you find a hidden door behind a library bookshelf. Inside sits a Timekeeper who offers you one of two clocks.',
  choices: [
    'One clock slows down moments of comfort, allowing you to savour every peaceful pause.',
    'The other speeds up decision-making, helping you act on instinct and ride emotional waves confidently.'
  ]
}

const SCORING_QUESTION_COUNT = 5

type QuizStore = ReturnType<typeof createQuizStore>
let quizStore: QuizStore | null = null

function createQuizStore() {
  const questionIndex = ref(0)
  const choiceCounts = reactive<number[]>(Array(personas.length).fill(0))
  const currentPersonaIndex = ref<number | null>(null)
  const personaQualified = ref(false)

  const toastMessage = ref('')
  let toastTimer: number | null = null

  const secretUnlocked = ref(false)
  const secretClicks = ref(0)
  const secretChoice = ref<number | null>(null)

  const quizCompleted = ref(false)

  const currentPersona = computed(() => {
    if (currentPersonaIndex.value == null) return null
    return personas[currentPersonaIndex.value] ?? null
  })

  const allPersonas = computed(() => personas.map(persona => persona))

  const secretResult = computed(() => {
    if (secretChoice.value == null) return null
    return secretResults[secretChoice.value] ?? null
  })

  function resetChoiceCounts() {
    choiceCounts.forEach((_, index) => {
      choiceCounts[index] = 0
    })
  }

  function startQuiz() {
    resetChoiceCounts()
    questionIndex.value = 0
    currentPersonaIndex.value = null
    personaQualified.value = false
    quizCompleted.value = false
  }

  function answerQuestion(choiceIdx: number) {
    if (questionIndex.value < SCORING_QUESTION_COUNT) {
      if (choiceIdx >= 0 && choiceIdx < choiceCounts.length) {
        choiceCounts[choiceIdx] += 1
      }
    }

    if (questionIndex.value < questions.length - 1) {
      questionIndex.value += 1
    } else {
      quizCompleted.value = true
    }
  }

  function determinePersonaIndex() {
    let winningIndex = 0
    let winningCount = -1

    choiceCounts.forEach((count, index) => {
      if (count > winningCount) {
        winningCount = count
        winningIndex = index
      }
    })

    personaQualified.value = winningCount > 3

    return winningCount > 0 ? winningIndex : 0
  }

  function revealResult() {
    const personaIndex = determinePersonaIndex()
    currentPersonaIndex.value = personaIndex
  }

  function tryAgain() {
    startQuiz()
  }

  function setCurrentPersonaById(id: PersonaId) {
    const index = personas.findIndex(persona => persona.id === id)
    if (index === -1) return false
    currentPersonaIndex.value = index
    return true
  }

  function showToast(message: string) {
    toastMessage.value = message
    if (toastTimer) window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => {
      toastMessage.value = ''
    }, 2200)
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      showToast('Message copied! ✨')
    } catch (error) {
      console.error('Clipboard copy failed', error)
    }
  }

  async function shareQuest(isSecret = false) {
    const personaName = isSecret && secretResult.value ? secretResult.value.name : currentPersona.value?.name
    const shareText = isSecret
      ? `🤫 I unlocked this secret drink in LimSimi! Try to find the secret entrance from the first page! 🥤🔒\n${window.location.href}`
      : `✨ Wah! I'm ${personaName ?? 'my kuih'} in the LimSimi Quiz! 🥮 Come and find out your financial kuih match! 🇸🇬\n${window.location.href}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: '🍵 LimSimi Quiz - My Kuih Persona!',
          text: shareText
        })
        return
      }
    } catch (error) {
      console.warn('Share failed, falling back to clipboard', error)
    }

    await copyText(shareText)
  }

  async function copyResultLink() {
    await copyText(window.location.href)
  }

  function handleTitleClick() {
    if (secretUnlocked.value) return
    secretClicks.value += 1
    if (secretClicks.value >= 5) {
      secretUnlocked.value = true
      secretClicks.value = 0
    }
  }

  function startSecretJourney() {
    secretChoice.value = null
  }

  function answerSecret(choiceIdx: number) {
    secretChoice.value = choiceIdx
  }

  function resetSecret() {
    secretUnlocked.value = false
    secretChoice.value = null
  }

  function clearToastTimer() {
    if (toastTimer) {
      window.clearTimeout(toastTimer)
      toastTimer = null
    }
  }

  return {
    questionIndex,
    quizCompleted,
    currentPersona,
    allPersonas,
    personaQualified,
    secretUnlocked,
    secretClicks,
    secretChoice,
    secretResult,
    toastMessage,
    startQuiz,
    answerQuestion,
    revealResult,
    tryAgain,
    setCurrentPersonaById,
    shareQuest,
    copyResultLink,
    handleTitleClick,
    startSecretJourney,
    answerSecret,
    resetSecret,
    clearToastTimer,
    showToast
  }
}

export function useQuizStore() {
  if (!quizStore) {
    quizStore = createQuizStore()
  }
  return quizStore
}
