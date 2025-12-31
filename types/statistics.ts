// Statistics Types for User Progress Tracking

export interface TehilimStats {
  totalChaptersCompleted: number // כמה פרקים סיים
  totalChaptersRemaining: number // כמה נשאר (מתוך 150)
  completionPercentage: number // אחוזי השלמה
  currentChapter: number // פרק נוכחי
  totalVersesRead: number // סה"כ פסוקים שנקראו
  totalTimeMinutes: number // זמן קריאה בדקות
  averageReadingSpeed: number // מהירות ממוצעת (WPM)
  currentStreak: number // רצף ימים נוכחי
  longestStreak: number // רצף הכי ארוך
  lastReadDate: Date | null
  favoriteChapters: number[] // פרקים אהובים
}

export interface TalmudStats {
  totalDapimCompleted: number // כמה דפים סיים
  totalDapimRemaining: number // כמה דפים נשאר (מתוך 2711)
  completionPercentage: number // אחוזי השלמה
  currentMasechet: string // מסכת נוכחית
  currentDaf: string // דף נוכחי (e.g., "23a")
  masechtotCompleted: string[] // מסכתות שהושלמו
  totalTimeMinutes: number
  currentStreak: number
  longestStreak: number
  lastStudyDate: Date | null
  dafYomiProgress: {
    isFollowing: boolean
    daysBehind: number
    daysAhead: number
  }
}

export interface TanakhStats {
  totalChaptersCompleted: number
  totalChaptersRemaining: number // מתוך 929 פרקים
  completionPercentage: number
  booksCompleted: string[] // ספרים שהושלמו
  currentBook: string
  currentChapter: number
  sections: {
    torah: { completed: number; total: 187; percentage: number }
    neviim: { completed: number; total: 186; percentage: number }
    ketuvim: { completed: number; total: 556; percentage: number }
  }
  totalVersesRead: number
  totalTimeMinutes: number
  currentStreak: number
  longestStreak: number
  lastReadDate: Date | null
}

export interface TefilotStats {
  totalPrayersCompleted: number
  dailyPrayerStreak: number
  shacharitCount: number
  minchaCount: number
  arvitCount: number
  totalTimeMinutes: number
  favoriteTefilot: string[]
  lastPrayerDate: Date | null
}

export interface OverallStats {
  totalReadingTimeMinutes: number
  totalReadingTimeHours: number
  totalDaysActive: number
  currentOverallStreak: number
  longestOverallStreak: number
  totalContentCompleted: number // סה"כ פרקים/דפים בכל המערכות
  achievementsUnlocked: number
  level: number // רמת משתמש
  experiencePoints: number
  nextLevelXP: number
  rank: string // "מתחיל", "קורא מתמיד", "חכם", "תלמיד חכם", "גאון"
}

export interface UserStatistics {
  userId: string
  displayName: string
  avatarUrl?: string
  joinDate: Date
  lastActiveDate: Date

  // Individual System Stats
  tehilim: TehilimStats
  talmud: TalmudStats
  tanakh: TanakhStats
  tefilot: TefilotStats

  // Overall Stats
  overall: OverallStats

  // Achievements
  unlockedAchievements: string[]

  // Goals
  goals: {
    daily?: {
      type: 'chapters' | 'dapim' | 'minutes'
      target: number
      current: number
    }
    weekly?: {
      type: 'chapters' | 'dapim' | 'minutes'
      target: number
      current: number
    }
    monthly?: {
      type: 'chapters' | 'dapim' | 'minutes'
      target: number
      current: number
    }
  }
}

export interface DailyActivity {
  date: Date
  chaptersRead: number
  dapimLearned: number
  prayersCompleted: number
  minutesSpent: number
  systemsUsed: ('tehilim' | 'talmud' | 'tanakh' | 'tefilot')[]
}

export interface MonthlyReport {
  month: string // "2025-01"
  totalChapters: number
  totalDapim: number
  totalPrayers: number
  totalMinutes: number
  daysActive: number
  averagePerDay: number
  topSystem: 'tehilim' | 'talmud' | 'tanakh' | 'tefilot'
  achievementsThisMonth: number
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number
  userId: string
  displayName: string
  avatarUrl?: string
  score: number
  metric: 'chapters' | 'dapim' | 'streak' | 'time' | 'achievements'
}

// XP and Leveling
export const XP_PER_CHAPTER = 10
export const XP_PER_DAF = 50
export const XP_PER_PRAYER = 5
export const XP_PER_MINUTE = 1
export const XP_PER_ACHIEVEMENT = 100

export function calculateLevel(xp: number): { level: number; nextLevelXP: number } {
  // Level formula: XP needed = level^2 * 100
  const level = Math.floor(Math.sqrt(xp / 100)) + 1
  const nextLevelXP = (level * level) * 100
  return { level, nextLevelXP }
}

export function getRankTitle(level: number): string {
  if (level >= 100) return "גאון עולם"
  if (level >= 50) return "תלמיד חכם"
  if (level >= 25) return "חכם"
  if (level >= 10) return "קורא מתמיד"
  if (level >= 5) return "לומד"
  return "מתחיל"
}

export function getNextMilestone(stats: UserStatistics): {
  type: string
  description: string
  current: number
  target: number
  percentage: number
} | null {
  const milestones = [
    {
      type: 'tehilim',
      description: 'סיום ספר תהילים',
      current: stats.tehilim.totalChaptersCompleted,
      target: 150,
    },
    {
      type: 'talmud',
      description: 'סיום מסכת ראשונה',
      current: stats.talmud.totalDapimCompleted,
      target: 64, // Masechet Berakhot
    },
    {
      type: 'tanakh',
      description: 'סיום תורה',
      current: stats.tanakh.sections.torah.completed,
      target: stats.tanakh.sections.torah.total,
    },
    {
      type: 'overall',
      description: 'רמה 10',
      current: stats.overall.level,
      target: 10,
    },
  ]

  const nextMilestone = milestones
    .filter(m => m.current < m.target)
    .sort((a, b) => (a.current / a.target) - (b.current / b.target))[0]

  if (!nextMilestone) return null

  return {
    ...nextMilestone,
    percentage: (nextMilestone.current / nextMilestone.target) * 100,
  }
}
