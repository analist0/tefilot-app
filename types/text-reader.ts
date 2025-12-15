// Generic Text Reader Types - תומך בכל סוגי הטקסטים

export type TextType = "tehilim" | "tanakh" | "talmud" | "tefilot" | "halacha" | "sefarim"

export interface TextContent {
  id: string
  type: TextType
  title: string
  heTitle: string
  sections: TextSection[]
  metadata?: {
    author?: string
    category?: string
    book?: string
    chapter?: number | string
    page?: string
  }
}

export interface TextSection {
  ref: string
  heRef: string
  text: string[]
  he: string[]
  sectionNumber: number
}

export interface ReadingProgress {
  id?: string
  session_id: string
  user_id?: string
  text_type: TextType
  text_id: string // e.g., "Psalms.1", "Genesis.1", "Berakhot.2a"
  section: number // chapter/page number
  verse: number // verse/line number
  letter_index: number
  completed: boolean
  reading_speed_wpm?: number
  total_time_seconds: number
  sections_completed: number
  verses_read: number
  current_streak_days: number
  longest_streak_days: number
  last_read_at: string
  total_sessions: number
  created_at?: string
  updated_at?: string
}

export interface TextReaderSettings {
  enabled_types: TextType[]
  default_font_size: number
  default_reading_speed: number
  show_holy_names_kavana: boolean
  enable_auto_advance: boolean
  enable_statistics: boolean
}

// Sefaria API response interface
export interface SefariaTextResponse {
  text: string[] | string[][]
  he: string[] | string[][]
  ref: string
  heRef: string
  sectionRef: string
  heSectionRef: string
  firstAvailableSectionRef: string
  isSpanning: boolean
  spanningRefs: string[]
  next: string | null
  prev: string | null
  title: string
  heTitle: string
  primary_category: string
  book: string
  categories: string[]
  type: string
  sectionNames: string[]
  addressTypes: string[]
  length: number
  indexTitle: string
  heIndexTitle: string
}

// Configuration for each text type
export interface TextTypeConfig {
  type: TextType
  title: string
  heTitle: string
  icon: string
  color: string
  sefariaEndpoint: string
  defaultBook: string
  totalSections: number // total chapters/pages
  enabled: boolean
  description: string
  heDescription: string
  features: {
    dailyReading: boolean
    wordByWord: boolean
    statistics: boolean
    audioSupport: boolean
  }
}

export const TEXT_TYPES_CONFIG: Record<TextType, TextTypeConfig> = {
  tehilim: {
    type: "tehilim",
    title: "Psalms",
    heTitle: "תהילים",
    icon: "🙏",
    color: "blue",
    sefariaEndpoint: "Psalms",
    defaultBook: "Psalms",
    totalSections: 150,
    enabled: true,
    description: "Book of Psalms with word-by-word reading",
    heDescription: "ספר תהילים עם קריאה מילה-מילה",
    features: {
      dailyReading: true,
      wordByWord: true,
      statistics: true,
      audioSupport: false,
    },
  },
  tanakh: {
    type: "tanakh",
    title: "Tanakh",
    heTitle: "תנ\"ך",
    icon: "📖",
    color: "green",
    sefariaEndpoint: "", // Dynamic based on book
    defaultBook: "Genesis",
    totalSections: 929, // chapters in Tanakh
    enabled: true,
    description: "Complete Hebrew Bible with commentary",
    heDescription: "תנ\"ך מלא עם פירושים",
    features: {
      dailyReading: true,
      wordByWord: true,
      statistics: true,
      audioSupport: false,
    },
  },
  talmud: {
    type: "talmud",
    title: "Talmud",
    heTitle: "תלמוד",
    icon: "📚",
    color: "purple",
    sefariaEndpoint: "", // e.g., "Berakhot"
    defaultBook: "Berakhot",
    totalSections: 2711, // dapim in Bavli
    enabled: true,
    description: "Talmud Bavli with Daf Yomi tracking",
    heDescription: "תלמוד בבלי עם מעקב דף יומי",
    features: {
      dailyReading: true,
      wordByWord: true,
      statistics: true,
      audioSupport: false,
    },
  },
  tefilot: {
    type: "tefilot",
    title: "Prayers",
    heTitle: "תפילות",
    icon: "🕯️",
    color: "yellow",
    sefariaEndpoint: "Siddur Ashkenaz",
    defaultBook: "Siddur Ashkenaz",
    totalSections: 100, // estimated
    enabled: true,
    description: "Daily prayers and blessings",
    heDescription: "תפילות יומיות וברכות",
    features: {
      dailyReading: false,
      wordByWord: true,
      statistics: false,
      audioSupport: false,
    },
  },
  halacha: {
    type: "halacha",
    title: "Halacha",
    heTitle: "הלכה",
    icon: "⚖️",
    color: "red",
    sefariaEndpoint: "", // Multiple sources
    defaultBook: "Mishnah Berurah",
    totalSections: 0, // varies
    enabled: true,
    description: "Daily Halacha and Jewish law",
    heDescription: "הלכה יומית ודיני ישראל",
    features: {
      dailyReading: true,
      wordByWord: false,
      statistics: false,
      audioSupport: false,
    },
  },
  sefarim: {
    type: "sefarim",
    title: "Books",
    heTitle: "ספרים",
    icon: "📕",
    color: "orange",
    sefariaEndpoint: "", // Search-based
    defaultBook: "",
    totalSections: 0, // varies
    enabled: true,
    description: "Jewish books library with search",
    heDescription: "ספריית ספרים יהודיים עם חיפוש",
    features: {
      dailyReading: false,
      wordByWord: false,
      statistics: false,
      audioSupport: false,
    },
  },
}
