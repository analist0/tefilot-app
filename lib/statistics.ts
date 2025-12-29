import { createClient } from '@/lib/supabase/server'
import type {
  UserStatistics,
  TehilimStats,
  TalmudStats,
  TanakhStats,
  TefilotStats,
  OverallStats,
  DailyActivity,
  MonthlyReport,
} from '@/types/statistics'
import { calculateLevel, getRankTitle, XP_PER_CHAPTER, XP_PER_DAF, XP_PER_MINUTE, XP_PER_ACHIEVEMENT } from '@/types/statistics'

/**
 * Get comprehensive user statistics from all systems
 */
export async function getUserStatistics(userId: string): Promise<UserStatistics | null> {
  const supabase = await createClient()

  try {
    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_url, created_at')
      .eq('id', userId)
      .single()

    if (!profile) return null

    // Fetch all reading progress data
    const { data: progressData } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', userId)

    if (!progressData) return null

    // Calculate Tehilim stats
    const tehilimProgress = progressData.filter(p => p.text_type === 'tehilim')
    const tehilimStats = calculateTehilimStats(tehilimProgress)

    // Calculate Talmud stats
    const talmudProgress = progressData.filter(p => p.text_type === 'talmud')
    const talmudStats = calculateTalmudStats(talmudProgress)

    // Calculate Tanakh stats
    const tanakhProgress = progressData.filter(p => p.text_type === 'tanakh')
    const tanakhStats = calculateTanakhStats(tanakhProgress)

    // Calculate Tefilot stats
    const tefilotProgress = progressData.filter(p => p.text_type === 'tefilot')
    const tefilotStats = calculateTefilotStats(tefilotProgress)

    // Calculate overall stats
    const overallStats = calculateOverallStats(
      tehilimStats,
      talmudStats,
      tanakhStats,
      tefilotStats,
      progressData
    )

    // Get unlocked achievements
    const { data: achievementsData } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId)

    const unlockedAchievements = achievementsData?.map(a => a.achievement_id) || []

    // Calculate goals
    const goals = await calculateUserGoals(userId, progressData)

    return {
      userId,
      displayName: profile.display_name || 'משתמש',
      avatarUrl: profile.avatar_url,
      joinDate: new Date(profile.created_at),
      lastActiveDate: new Date(),
      tehilim: tehilimStats,
      talmud: talmudStats,
      tanakh: tanakhStats,
      tefilot: tefilotStats,
      overall: overallStats,
      unlockedAchievements,
      goals,
    }
  } catch (error) {
    console.error('Error fetching user statistics:', error)
    return null
  }
}

function calculateTehilimStats(progress: any[]): TehilimStats {
  const completed = progress.filter(p => p.completed).length
  const total = 150

  const totalVersesRead = progress.reduce((sum, p) => sum + (p.verses_read || 0), 0)
  const totalTimeMinutes = progress.reduce((sum, p) => sum + Math.floor((p.total_time_seconds || 0) / 60), 0)
  const averageSpeed = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + (p.reading_speed_wpm || 0), 0) / progress.length)
    : 0

  const currentStreak = calculateStreak(progress)
  const longestStreak = Math.max(currentStreak, ...progress.map(p => p.longest_streak_days || 0))

  const lastRead = progress.length > 0
    ? new Date(Math.max(...progress.map(p => new Date(p.updated_at).getTime())))
    : null

  return {
    totalChaptersCompleted: completed,
    totalChaptersRemaining: total - completed,
    completionPercentage: Math.round((completed / total) * 100),
    currentChapter: getLastReadChapter(progress) || 1,
    totalVersesRead,
    totalTimeMinutes,
    averageReadingSpeed: averageSpeed,
    currentStreak,
    longestStreak,
    lastReadDate: lastRead,
    favoriteChapters: getMostReadChapters(progress),
  }
}

function calculateTalmudStats(progress: any[]): TalmudStats {
  const completed = progress.filter(p => p.completed).length
  const total = 2711 // Total dapim in Shas

  const masechtot = new Set(progress.map(p => p.text_id?.split('.')[0]).filter(Boolean))
  const completedMasechtot = Array.from(masechtot).filter(masechet =>
    progress.filter(p => p.text_id?.startsWith(masechet) && p.completed).length >= 63
  )

  const totalTimeMinutes = progress.reduce((sum, p) => sum + Math.floor((p.total_time_seconds || 0) / 60), 0)
  const currentStreak = calculateStreak(progress)
  const longestStreak = Math.max(currentStreak, ...progress.map(p => p.longest_streak_days || 0))

  const lastStudy = progress.length > 0
    ? new Date(Math.max(...progress.map(p => new Date(p.updated_at).getTime())))
    : null

  const currentDaf = getLastReadDaf(progress)

  return {
    totalDapimCompleted: completed,
    totalDapimRemaining: total - completed,
    completionPercentage: Math.round((completed / total) * 100),
    currentMasechet: currentDaf?.masechet || '',
    currentDaf: currentDaf?.daf || '',
    masechtotCompleted: completedMasechtot,
    totalTimeMinutes,
    currentStreak,
    longestStreak,
    lastStudyDate: lastStudy,
    dafYomiProgress: {
      isFollowing: false, // TODO: implement Daf Yomi tracking
      daysBehind: 0,
      daysAhead: 0,
    },
  }
}

function calculateTanakhStats(progress: any[]): TanakhStats {
  const completed = progress.filter(p => p.completed).length
  const total = 929 // Total chapters in Tanakh

  const booksCompleted = getCompletedBooks(progress)

  // Torah: 187 chapters, Neviim: 186, Ketuvim: 556
  const torahChapters = progress.filter(p => isTorah(p.text_id))
  const neviimChapters = progress.filter(p => isNeviim(p.text_id))
  const ketuvimChapters = progress.filter(p => isKetuvim(p.text_id))

  const totalVersesRead = progress.reduce((sum, p) => sum + (p.verses_read || 0), 0)
  const totalTimeMinutes = progress.reduce((sum, p) => sum + Math.floor((p.total_time_seconds || 0) / 60), 0)
  const currentStreak = calculateStreak(progress)
  const longestStreak = Math.max(currentStreak, ...progress.map(p => p.longest_streak_days || 0))

  const lastRead = progress.length > 0
    ? new Date(Math.max(...progress.map(p => new Date(p.updated_at).getTime())))
    : null

  const currentBook = getLastReadBook(progress)

  return {
    totalChaptersCompleted: completed,
    totalChaptersRemaining: total - completed,
    completionPercentage: Math.round((completed / total) * 100),
    booksCompleted,
    currentBook: currentBook?.book || '',
    currentChapter: currentBook?.chapter || 1,
    sections: {
      torah: {
        completed: torahChapters.filter(p => p.completed).length,
        total: 187,
        percentage: Math.round((torahChapters.filter(p => p.completed).length / 187) * 100),
      },
      neviim: {
        completed: neviimChapters.filter(p => p.completed).length,
        total: 186,
        percentage: Math.round((neviimChapters.filter(p => p.completed).length / 186) * 100),
      },
      ketuvim: {
        completed: ketuvimChapters.filter(p => p.completed).length,
        total: 556,
        percentage: Math.round((ketuvimChapters.filter(p => p.completed).length / 556) * 100),
      },
    },
    totalVersesRead,
    totalTimeMinutes,
    currentStreak,
    longestStreak,
    lastReadDate: lastRead,
  }
}

function calculateTefilotStats(progress: any[]): TefilotStats {
  const totalCompleted = progress.filter(p => p.completed).length
  const dailyStreak = calculateStreak(progress)

  const shacharit = progress.filter(p => p.text_id?.includes('shacharit')).length
  const mincha = progress.filter(p => p.text_id?.includes('mincha')).length
  const arvit = progress.filter(p => p.text_id?.includes('arvit')).length

  const totalTimeMinutes = progress.reduce((sum, p) => sum + Math.floor((p.total_time_seconds || 0) / 60), 0)

  const lastPrayer = progress.length > 0
    ? new Date(Math.max(...progress.map(p => new Date(p.updated_at).getTime())))
    : null

  return {
    totalPrayersCompleted: totalCompleted,
    dailyPrayerStreak: dailyStreak,
    shacharitCount: shacharit,
    minchaCount: mincha,
    arvitCount: arvit,
    totalTimeMinutes,
    favoriteTefilot: getMostReadTefilot(progress),
    lastPrayerDate: lastPrayer,
  }
}

function calculateOverallStats(
  tehilim: TehilimStats,
  talmud: TalmudStats,
  tanakh: TanakhStats,
  tefilot: TefilotStats,
  allProgress: any[]
): OverallStats {
  const totalTimeMinutes =
    tehilim.totalTimeMinutes +
    talmud.totalTimeMinutes +
    tanakh.totalTimeMinutes +
    tefilot.totalTimeMinutes

  const totalContentCompleted =
    tehilim.totalChaptersCompleted +
    talmud.totalDapimCompleted +
    tanakh.totalChaptersCompleted +
    tefilot.totalPrayersCompleted

  const currentOverallStreak = Math.max(
    tehilim.currentStreak,
    talmud.currentStreak,
    tanakh.currentStreak,
    tefilot.dailyPrayerStreak
  )

  const longestOverallStreak = Math.max(
    tehilim.longestStreak,
    talmud.longestStreak,
    tanakh.longestStreak
  )

  // Calculate XP
  const xp =
    (tehilim.totalChaptersCompleted * XP_PER_CHAPTER) +
    (talmud.totalDapimCompleted * XP_PER_DAF) +
    (tanakh.totalChaptersCompleted * XP_PER_CHAPTER) +
    (totalTimeMinutes * XP_PER_MINUTE)

  const { level, nextLevelXP } = calculateLevel(xp)

  // Get unique active days
  const uniqueDays = new Set(
    allProgress
      .map(p => new Date(p.updated_at).toDateString())
  ).size

  return {
    totalReadingTimeMinutes: totalTimeMinutes,
    totalReadingTimeHours: Math.round(totalTimeMinutes / 60),
    totalDaysActive: uniqueDays,
    currentOverallStreak,
    longestOverallStreak,
    totalContentCompleted,
    achievementsUnlocked: 0, // Will be filled from achievements table
    level,
    experiencePoints: xp,
    nextLevelXP,
    rank: getRankTitle(level),
  }
}

async function calculateUserGoals(userId: string, progress: any[]) {
  // TODO: Fetch user goals from database
  // For now, return empty goals
  return {}
}

// Helper functions
function calculateStreak(progress: any[]): number {
  if (progress.length === 0) return 0

  const dates = progress
    .map(p => new Date(p.updated_at).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  let streak = 0
  const today = new Date().toDateString()
  let currentDate = new Date()

  for (let i = 0; i < dates.length; i++) {
    const dateStr = new Date(currentDate).toDateString()
    if (dates.includes(dateStr)) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

function getLastReadChapter(progress: any[]): number {
  const sorted = progress.sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )
  return sorted[0]?.section || 1
}

function getLastReadDaf(progress: any[]): { masechet: string; daf: string } | null {
  const sorted = progress.sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )
  const last = sorted[0]
  if (!last) return null

  const [masechet, daf] = last.text_id.split('.')
  return { masechet, daf }
}

function getLastReadBook(progress: any[]): { book: string; chapter: number } | null {
  const sorted = progress.sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )
  const last = sorted[0]
  if (!last) return null

  const [book, chapter] = last.text_id.split('.')
  return { book, chapter: parseInt(chapter) }
}

function getMostReadChapters(progress: any[], limit = 5): number[] {
  const counts = progress.reduce((acc, p) => {
    const chapter = p.section
    acc[chapter] = (acc[chapter] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  return Object.entries(counts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, limit)
    .map(([chapter]) => parseInt(chapter))
}

function getMostReadTefilot(progress: any[], limit = 5): string[] {
  const counts = progress.reduce((acc, p) => {
    const tefila = p.text_id
    acc[tefila] = (acc[tefila] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(counts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, limit)
    .map(([tefila]) => tefila)
}

function getCompletedBooks(progress: any[]): string[] {
  // TODO: Implement book completion detection
  return []
}

function isTorah(textId: string): boolean {
  const torahBooks = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy']
  return torahBooks.some(book => textId.startsWith(book))
}

function isNeviim(textId: string): boolean {
  const neviimBooks = ['Joshua', 'Judges', 'Samuel', 'Kings', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi']
  return neviimBooks.some(book => textId.startsWith(book))
}

function isKetuvim(textId: string): boolean {
  const ketuvimBooks = ['Psalms', 'Proverbs', 'Job', 'Song of Songs', 'Ruth', 'Lamentations', 'Ecclesiastes', 'Esther', 'Daniel', 'Ezra', 'Nehemiah', 'Chronicles']
  return ketuvimBooks.some(book => textId.startsWith(book))
}

/**
 * Get daily activity for a user
 */
export async function getDailyActivity(userId: string, days = 30): Promise<DailyActivity[]> {
  const supabase = await createClient()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data } = await supabase
    .from('reading_progress')
    .select('*')
    .eq('user_id', userId)
    .gte('updated_at', startDate.toISOString())

  if (!data) return []

  interface DayData {
    date: Date
    chaptersRead: number
    dapimLearned: number
    prayersCompleted: number
    minutesSpent: number
    systemsUsed: Set<string>
  }

  // Group by date
  const byDate = data.reduce((acc, item) => {
    const date = new Date(item.updated_at).toDateString()
    if (!acc[date]) {
      acc[date] = {
        date: new Date(date),
        chaptersRead: 0,
        dapimLearned: 0,
        prayersCompleted: 0,
        minutesSpent: 0,
        systemsUsed: new Set<string>(),
      }
    }

    if (item.text_type === 'tehilim' || item.text_type === 'tanakh') {
      acc[date].chaptersRead++
    } else if (item.text_type === 'talmud') {
      acc[date].dapimLearned++
    } else if (item.text_type === 'tefilot') {
      acc[date].prayersCompleted++
    }

    acc[date].minutesSpent += Math.floor((item.total_time_seconds || 0) / 60)
    acc[date].systemsUsed.add(item.text_type)

    return acc
  }, {} as Record<string, DayData>)

  return Object.values(byDate).map(day => ({
    ...day,
    systemsUsed: Array.from(day.systemsUsed) as ('tehilim' | 'talmud' | 'tanakh' | 'tefilot')[],
  }))
}

/**
 * Get monthly report
 */
export async function getMonthlyReport(userId: string, month: string): Promise<MonthlyReport | null> {
  const activity = await getDailyActivity(userId, 30)

  if (activity.length === 0) return null

  const totalChapters = activity.reduce((sum, day) => sum + day.chaptersRead, 0)
  const totalDapim = activity.reduce((sum, day) => sum + day.dapimLearned, 0)
  const totalPrayers = activity.reduce((sum, day) => sum + day.prayersCompleted, 0)
  const totalMinutes = activity.reduce((sum, day) => sum + day.minutesSpent, 0)
  const daysActive = activity.length

  // Determine top system
  const systemCounts = {
    tehilim: activity.filter(d => d.systemsUsed.includes('tehilim')).length,
    talmud: activity.filter(d => d.systemsUsed.includes('talmud')).length,
    tanakh: activity.filter(d => d.systemsUsed.includes('tanakh')).length,
    tefilot: activity.filter(d => d.systemsUsed.includes('tefilot')).length,
  }

  const topSystem = (Object.entries(systemCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'tehilim') as any

  return {
    month,
    totalChapters,
    totalDapim,
    totalPrayers,
    totalMinutes,
    daysActive,
    averagePerDay: Math.round((totalChapters + totalDapim + totalPrayers) / daysActive),
    topSystem,
    achievementsThisMonth: 0, // TODO: implement
  }
}
