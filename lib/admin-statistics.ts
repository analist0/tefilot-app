import { createClient } from '@/lib/supabase/server'
import type { UserStatistics } from '@/types/statistics'
import { getUserStatistics } from '@/lib/statistics'

/**
 * Get statistics for all users (Admin only)
 */
export async function getAllUsersStatistics() {
  const supabase = await createClient()

  try {
    // Get all users
    const { data: users } = await supabase
      .from('profiles')
      .select('id, display_name, email, created_at, role')
      .order('created_at', { ascending: false })

    if (!users) return { users: [], totalStats: null }

    // Get statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const stats = await getUserStatistics(user.id)
        return {
          ...user,
          stats,
        }
      })
    )

    // Calculate total statistics
    const totalStats = calculateTotalStatistics(usersWithStats)

    return {
      users: usersWithStats,
      totalStats,
    }
  } catch (error) {
    console.error('Error getting all users statistics:', error)
    return { users: [], totalStats: null }
  }
}

/**
 * Calculate combined statistics from all users
 */
function calculateTotalStatistics(usersWithStats: any[]) {
  const validStats = usersWithStats.filter(u => u.stats !== null)

  if (validStats.length === 0) {
    return null
  }

  const total = {
    totalUsers: validStats.length,
    activeUsers: validStats.filter(u => {
      const lastActive = new Date(u.stats.lastActiveDate)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return lastActive > weekAgo
    }).length,

    // Tehilim stats
    tehilim: {
      totalChaptersCompleted: validStats.reduce((sum, u) => sum + u.stats.tehilim.totalChaptersCompleted, 0),
      totalVersesRead: validStats.reduce((sum, u) => sum + u.stats.tehilim.totalVersesRead, 0),
      totalTimeMinutes: validStats.reduce((sum, u) => sum + u.stats.tehilim.totalTimeMinutes, 0),
      usersCompleted: validStats.filter(u => u.stats.tehilim.completionPercentage === 100).length,
      averageCompletion: Math.round(
        validStats.reduce((sum, u) => sum + u.stats.tehilim.completionPercentage, 0) / validStats.length
      ),
    },

    // Talmud stats
    talmud: {
      totalDapimCompleted: validStats.reduce((sum, u) => sum + u.stats.talmud.totalDapimCompleted, 0),
      totalMasechtotCompleted: validStats.reduce(
        (sum, u) => sum + u.stats.talmud.masechtotCompleted.length,
        0
      ),
      totalTimeMinutes: validStats.reduce((sum, u) => sum + u.stats.talmud.totalTimeMinutes, 0),
      averageCompletion: Math.round(
        validStats.reduce((sum, u) => sum + u.stats.talmud.completionPercentage, 0) / validStats.length
      ),
    },

    // Tanakh stats
    tanakh: {
      totalChaptersCompleted: validStats.reduce((sum, u) => sum + u.stats.tanakh.totalChaptersCompleted, 0),
      totalBooksCompleted: validStats.reduce((sum, u) => sum + u.stats.tanakh.booksCompleted.length, 0),
      totalVersesRead: validStats.reduce((sum, u) => sum + u.stats.tanakh.totalVersesRead, 0),
      usersCompletedTorah: validStats.filter(
        u => u.stats.tanakh.sections.torah.percentage === 100
      ).length,
      averageCompletion: Math.round(
        validStats.reduce((sum, u) => sum + u.stats.tanakh.completionPercentage, 0) / validStats.length
      ),
    },

    // Overall stats
    overall: {
      totalReadingTimeHours: Math.round(
        validStats.reduce((sum, u) => sum + u.stats.overall.totalReadingTimeHours, 0)
      ),
      totalContentCompleted: validStats.reduce((sum, u) => sum + u.stats.overall.totalContentCompleted, 0),
      totalAchievementsUnlocked: validStats.reduce(
        (sum, u) => sum + u.stats.unlockedAchievements.length,
        0
      ),
      averageLevel: Math.round(
        validStats.reduce((sum, u) => sum + u.stats.overall.level, 0) / validStats.length
      ),
      highestLevel: Math.max(...validStats.map(u => u.stats.overall.level)),
      longestStreak: Math.max(...validStats.map(u => u.stats.overall.longestOverallStreak)),
    },
  }

  return total
}

/**
 * Get recent user activity (Admin only)
 */
export async function getRecentUserActivity(days = 7) {
  const supabase = await createClient()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  try {
    const { data } = await supabase
      .from('reading_progress')
      .select(`
        *,
        profiles:user_id (
          display_name,
          email
        )
      `)
      .gte('updated_at', startDate.toISOString())
      .order('updated_at', { ascending: false })
      .limit(100)

    return data || []
  } catch (error) {
    console.error('Error getting recent activity:', error)
    return []
  }
}

/**
 * Get top users by metric (Admin only)
 */
export async function getTopUsers(metric: 'chapters' | 'dapim' | 'streak' | 'time' | 'level', limit = 10) {
  const { users } = await getAllUsersStatistics()

  const sorted = [...users].sort((a, b) => {
    if (!a.stats || !b.stats) return 0

    switch (metric) {
      case 'chapters':
        return (
          b.stats.tehilim.totalChaptersCompleted +
          b.stats.tanakh.totalChaptersCompleted -
          (a.stats.tehilim.totalChaptersCompleted + a.stats.tanakh.totalChaptersCompleted)
        )
      case 'dapim':
        return b.stats.talmud.totalDapimCompleted - a.stats.talmud.totalDapimCompleted
      case 'streak':
        return b.stats.overall.longestOverallStreak - a.stats.overall.longestOverallStreak
      case 'time':
        return b.stats.overall.totalReadingTimeHours - a.stats.overall.totalReadingTimeHours
      case 'level':
        return b.stats.overall.level - a.stats.overall.level
      default:
        return 0
    }
  })

  return sorted.slice(0, limit)
}
