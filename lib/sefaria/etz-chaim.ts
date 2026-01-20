// Etz Chaim (עץ חיים) Structure - Arizal's Kabbalistic Teachings

export interface EtzChaimGate {
  number: number
  title: string
  heTitle: string
  sefariaRef: string
  chapters: number
  description?: string
}

// The 50 Gates (Shaarim) of Etz Chaim
export const ETZ_CHAIM_GATES: EtzChaimGate[] = [
  {
    number: 1,
    title: "Sha'ar HaKlalim",
    heTitle: "שער הכללים",
    sefariaRef: "Etz Chaim 1",
    chapters: 1,
    description: "שער הכללים - יסודות כלליים בתורת הקבלה"
  },
  {
    number: 2,
    title: "Sha'ar Adam Kadmon",
    heTitle: "שער אדם קדמון",
    sefariaRef: "Etz Chaim 2",
    chapters: 5,
    description: "סוד אדם קדמון והעולמות העליונים"
  },
  {
    number: 3,
    title: "Sha'ar Akudim",
    heTitle: "שער עקודים",
    sefariaRef: "Etz Chaim 3",
    chapters: 7,
    description: "סוד העקודים ונקודים"
  },
  {
    number: 4,
    title: "Sha'ar Nekudim",
    heTitle: "שער נקודים",
    sefariaRef: "Etz Chaim 4",
    chapters: 12,
    description: "שער הנקודים ושבירת הכלים"
  },
  {
    number: 5,
    title: "Sha'ar Ha'Atik",
    heTitle: "שער העתיק",
    sefariaRef: "Etz Chaim 5",
    chapters: 8,
    description: "סוד עתיק יומין"
  },
  {
    number: 6,
    title: "Sha'ar Arikh Anpin",
    heTitle: "שער אריך אנפין",
    sefariaRef: "Etz Chaim 6",
    chapters: 10,
    description: "סוד אריך אנפין - פרצוף אבא"
  },
  {
    number: 7,
    title: "Sha'ar Abba v'Imma",
    heTitle: "שער אבא ואמא",
    sefariaRef: "Etz Chaim 7",
    chapters: 15,
    description: "סוד הפרצופים אבא ואימא"
  },
  {
    number: 8,
    title: "Sha'ar Ze'eir Anpin",
    heTitle: "שער זעיר אנפין",
    sefariaRef: "Etz Chaim 8",
    chapters: 20,
    description: "סוד זעיר אנפין והתיקונים"
  }
]

export const TOTAL_ETZ_CHAIM_GATES = ETZ_CHAIM_GATES.length
export const TOTAL_ETZ_CHAIM_CHAPTERS = ETZ_CHAIM_GATES.reduce((sum, gate) => sum + gate.chapters, 0)

// Daily learning recommendations
export interface EtzChaimDailyRecommendation {
  chapters: number
  completionDays: number
  description: string
}

export const ETZ_CHAIM_DAILY_RECOMMENDATIONS: Record<string, EtzChaimDailyRecommendation> = {
  beginner: {
    chapters: 1,
    completionDays: TOTAL_ETZ_CHAIM_CHAPTERS,
    description: "פרק אחד ליום - מתאים למתחילים"
  },
  intermediate: {
    chapters: 2,
    completionDays: Math.ceil(TOTAL_ETZ_CHAIM_CHAPTERS / 2),
    description: "שני פרקים ליום - רמה בינונית"
  },
  advanced: {
    chapters: 3,
    completionDays: Math.ceil(TOTAL_ETZ_CHAIM_CHAPTERS / 3),
    description: "שלושה פרקים ליום - רמה מתקדמת"
  }
}

// Special sections for focused study
export const ETZ_CHAIM_SPECIAL_TOPICS = [
  {
    name: "Adam Kadmon",
    heName: "אדם קדמון",
    gates: [2],
    description: "לימוד מעמיק בסוד אדם קדמון והעולמות הראשונים"
  },
  {
    name: "Partzufim",
    heName: "הפרצופים",
    gates: [6, 7, 8],
    description: "לימוד מקיף של כל הפרצופים: אריך, אבא ואימא, זעיר"
  },
  {
    name: "Shvirat HaKelim",
    heName: "שבירת הכלים",
    gates: [4],
    description: "הבנת סוד שבירת הכלים ותיקון העולמות"
  },
  {
    name: "Foundations",
    heName: "יסודות",
    gates: [1, 3],
    description: "יסודות הקבלה האריז\"לית"
  }
]

/**
 * Calculate current position in Etz Chaim based on daily learning cycle
 * @param startDate - Optional start date (defaults to a known cycle start)
 * @param chaptersPerDay - Number of chapters to learn daily (default: 1)
 */
export function calculateEtzChaimDailyPosition(
  startDate: Date = new Date('2024-01-01'),
  chaptersPerDay: number = 1
): {
  dayInCycle: number
  currentGate: EtzChaimGate
  currentChapter: number
  gateProgress: number
  totalProgress: number
} {
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - startDate.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  const totalChaptersRead = (diffDays * chaptersPerDay) % TOTAL_ETZ_CHAIM_CHAPTERS

  let chaptersCount = 0
  let currentGate = ETZ_CHAIM_GATES[0]
  let currentChapter = 1

  for (const gate of ETZ_CHAIM_GATES) {
    if (chaptersCount + gate.chapters > totalChaptersRead) {
      currentGate = gate
      currentChapter = totalChaptersRead - chaptersCount + 1
      break
    }
    chaptersCount += gate.chapters
  }

  const gateProgress = Math.round((currentChapter / currentGate.chapters) * 100)
  const totalProgress = Math.round((totalChaptersRead / TOTAL_ETZ_CHAIM_CHAPTERS) * 100)

  return {
    dayInCycle: diffDays % Math.ceil(TOTAL_ETZ_CHAIM_CHAPTERS / chaptersPerDay) + 1,
    currentGate,
    currentChapter,
    gateProgress,
    totalProgress
  }
}

/**
 * Get gate by number
 */
export function getGateByNumber(gateNumber: number): EtzChaimGate | undefined {
  return ETZ_CHAIM_GATES.find(gate => gate.number === gateNumber)
}

/**
 * Get next gate
 */
export function getNextGate(currentGateNumber: number): EtzChaimGate | null {
  const currentIndex = ETZ_CHAIM_GATES.findIndex(gate => gate.number === currentGateNumber)
  if (currentIndex === -1 || currentIndex === ETZ_CHAIM_GATES.length - 1) {
    return null
  }
  return ETZ_CHAIM_GATES[currentIndex + 1]
}

/**
 * Get previous gate
 */
export function getPreviousGate(currentGateNumber: number): EtzChaimGate | null {
  const currentIndex = ETZ_CHAIM_GATES.findIndex(gate => gate.number === currentGateNumber)
  if (currentIndex <= 0) {
    return null
  }
  return ETZ_CHAIM_GATES[currentIndex - 1]
}
