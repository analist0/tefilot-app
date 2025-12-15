// Zohar Structure and Daily Learning System

export interface ZoharSection {
  title: string
  heTitle: string
  sefariaRef: string
  dafim: number // Total pages/sections
  description?: string
  subsections?: ZoharSection[]
}

// Zohar structure on Sefaria
export const ZOHAR_STRUCTURE: ZoharSection[] = [
  {
    title: "Zohar on Genesis",
    heTitle: "זוהר בראשית",
    sefariaRef: "Zohar",
    dafim: 245,
    description: "זוהר על חומש בראשית - הספר הראשון של הזוהר",
    subsections: [
      { title: "Bereshit", heTitle: "בראשית", sefariaRef: "Zohar 1.1a-1.47b", dafim: 47 },
      { title: "Noach", heTitle: "נח", sefariaRef: "Zohar 1.47b-1.73b", dafim: 26 },
      { title: "Lech Lecha", heTitle: "לך לך", sefariaRef: "Zohar 1.73b-1.93a", dafim: 20 },
      { title: "Vayera", heTitle: "וירא", sefariaRef: "Zohar 1.93a-1.120a", dafim: 27 },
      { title: "Chayei Sarah", heTitle: "חיי שרה", sefariaRef: "Zohar 1.120a-1.133b", dafim: 14 },
      { title: "Toldot", heTitle: "תולדות", sefariaRef: "Zohar 1.133b-1.154b", dafim: 21 },
      { title: "Vayetzei", heTitle: "ויצא", sefariaRef: "Zohar 1.154b-1.170a", dafim: 16 },
      { title: "Vayishlach", heTitle: "וישלח", sefariaRef: "Zohar 1.170a-1.188a", dafim: 18 },
      { title: "Vayeshev", heTitle: "וישב", sefariaRef: "Zohar 1.188a-1.200b", dafim: 13 },
      { title: "Miketz", heTitle: "מקץ", sefariaRef: "Zohar 1.200b-1.206a", dafim: 6 },
      { title: "Vayigash", heTitle: "ויגש", sefariaRef: "Zohar 1.206a-1.220a", dafim: 14 },
      { title: "Vayechi", heTitle: "ויחי", sefariaRef: "Zohar 1.220a-1.245b", dafim: 26 }
    ]
  },
  {
    title: "Zohar on Exodus",
    heTitle: "זוהר שמות",
    sefariaRef: "Zohar",
    dafim: 266,
    description: "זוהר על חומש שמות",
    subsections: [
      { title: "Shemot", heTitle: "שמות", sefariaRef: "Zohar 2.1a-2.23a", dafim: 23 },
      { title: "Vaera", heTitle: "וארא", sefariaRef: "Zohar 2.23a-2.35b", dafim: 13 },
      { title: "Bo", heTitle: "בא", sefariaRef: "Zohar 2.35b-2.45a", dafim: 10 },
      { title: "Beshalach", heTitle: "בשלח", sefariaRef: "Zohar 2.45a-2.72a", dafim: 27 },
      { title: "Yitro", heTitle: "יתרו", sefariaRef: "Zohar 2.72a-2.93b", dafim: 22 },
      { title: "Mishpatim", heTitle: "משפטים", sefariaRef: "Zohar 2.93b-2.123a", dafim: 30 },
      { title: "Terumah", heTitle: "תרומה", sefariaRef: "Zohar 2.123a-2.180a", dafim: 57 },
      { title: "Tetzaveh", heTitle: "תצוה", sefariaRef: "Zohar 2.180a-2.197a", dafim: 17 },
      { title: "Ki Tisa", heTitle: "כי תשא", sefariaRef: "Zohar 2.197a-2.223a", dafim: 26 },
      { title: "Vayakhel", heTitle: "ויקהל", sefariaRef: "Zohar 2.223a-2.229a", dafim: 6 },
      { title: "Pekudei", heTitle: "פקודי", sefariaRef: "Zohar 2.229a-2.266b", dafim: 38 }
    ]
  },
  {
    title: "Zohar on Leviticus",
    heTitle: "זוהר ויקרא",
    sefariaRef: "Zohar",
    dafim: 124,
    description: "זוהר על חומש ויקרא"
  },
  {
    title: "Zohar on Numbers",
    heTitle: "זוהר במדבר",
    sefariaRef: "Zohar",
    dafim: 239,
    description: "זוהר על חומש במדבר"
  },
  {
    title: "Zohar on Deuteronomy",
    heTitle: "זוהר דברים",
    sefariaRef: "Zohar",
    dafim: 296,
    description: "זוהר על חומש דברים"
  }
]

// Total Zohar pages
export const TOTAL_ZOHAR_DAPIM = 1170

// Zohar daily learning cycle
// Based on 5 pages per day = 234 days (approximately 7.8 months)
export const ZOHAR_DAILY_PAGES = 5
export const ZOHAR_CYCLE_DAYS = Math.ceil(TOTAL_ZOHAR_DAPIM / ZOHAR_DAILY_PAGES)

// Etz Chaim structure
export const ETZ_CHAIM_STRUCTURE = {
  title: "Etz Chaim",
  heTitle: "עץ חיים",
  sefariaRef: "Etz Chaim",
  description: "ספר עץ חיים - כתבי האר\"י הקדוש",
  totalSections: 50, // Approximate number of gates/shaarim
  gates: [
    { title: "Shaar HaKlalim", heTitle: "שער הכללים", sefariaRef: "Etz Chaim, Shaar 1" },
    { title: "Shaar Adam Kadmon", heTitle: "שער אדם קדמון", sefariaRef: "Etz Chaim, Shaar 2" },
    { title: "Shaar Akudim", heTitle: "שער עקודים", sefariaRef: "Etz Chaim, Shaar 3" },
    // Add more gates as needed
  ]
}

/**
 * Calculate today's Zohar daily pages
 * @param startDate - The start date of the cycle (default: Jan 1, 2020)
 * @returns Object with current position in Zohar
 */
export function calculateZoharDailyPages(startDate: Date = new Date(2020, 0, 1)): {
  dayInCycle: number
  startPage: number
  endPage: number
  currentSection: string
  hebrewSection: string
} {
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - startDate.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  const dayInCycle = (diffDays % ZOHAR_CYCLE_DAYS) + 1
  const startPage = ((dayInCycle - 1) * ZOHAR_DAILY_PAGES) + 1
  const endPage = Math.min(startPage + ZOHAR_DAILY_PAGES - 1, TOTAL_ZOHAR_DAPIM)

  // Determine which section we're in
  let currentSection = "Zohar on Genesis"
  let hebrewSection = "זוהר בראשית"
  let cumulativeDapim = 0

  for (const section of ZOHAR_STRUCTURE) {
    cumulativeDapim += section.dafim
    if (startPage <= cumulativeDapim) {
      currentSection = section.title
      hebrewSection = section.heTitle
      break
    }
  }

  return {
    dayInCycle,
    startPage,
    endPage,
    currentSection,
    hebrewSection
  }
}

/**
 * Get recommended daily Zohar learning based on kabbalistic sources
 * This includes recommendations from various kabbalistic works
 */
export const ZOHAR_DAILY_RECOMMENDATIONS = {
  everyDay: {
    title: "Daily Essential",
    heTitle: "לימוד יומי חובה",
    sections: [
      {
        name: "Zohar on Parashat HaShavua",
        heName: "זוהר על פרשת השבוע",
        description: "The Zohar on this week's Torah portion"
      },
      {
        name: "5 Pages of Zohar",
        heName: "5 דפי זוהר",
        description: "Following the daily Zohar cycle"
      }
    ]
  },
  special: {
    title: "Special Segments",
    heTitle: "קטעים מיוחדים",
    sections: [
      {
        name: "Parashat Balak - Story of Rabbi Hamnuna Saba",
        heName: "פרשת בלק - מעשה דרבי חמנונא סבא",
        sefariaRef: "Zohar 3.186a-3.192a",
        description: "Segulah for protection and salvation"
      },
      {
        name: "Idra Rabba",
        heName: "אדרא רבא",
        sefariaRef: "Zohar 3.127b-3.145a",
        description: "The Great Assembly - secrets of the Divine structure"
      },
      {
        name: "Idra Zuta",
        heName: "אדרא זוטא",
        sefariaRef: "Zohar 3.287b-3.296b",
        description: "The Small Assembly - Rabbi Shimon's final teachings"
      },
      {
        name: "Shiur Komah",
        heName: "שיעור קומה",
        sefariaRef: "Zohar 2.42b-2.43b",
        description: "The Divine measurements"
      }
    ]
  },
  bySefira: {
    title: "By Sefirot",
    heTitle: "לפי הספירות",
    description: "Different Zohar sections correspond to different Sefirot"
  }
}
