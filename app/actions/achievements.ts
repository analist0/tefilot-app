"use server"

import { createClient } from "@/lib/supabase/server"
import { getUserStatistics } from "@/lib/statistics"
import { checkAchievements, type Achievement } from "@/lib/achievements"

/**
 * Check and unlock new achievements for a user
 */
export async function checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
  const supabase = await createClient()

  try {
    // Get user statistics
    const stats = await getUserStatistics(userId)
    if (!stats) return []

    // Prepare stats for achievement checking
    const achievementStats = {
      currentStreak: stats.overall.currentOverallStreak,
      chaptersCompleted: stats.tehilim.totalChaptersCompleted + stats.tanakh.totalChaptersCompleted,
      versesRead: stats.tehilim.totalVersesRead + stats.tanakh.totalVersesRead,
      averageSpeed: stats.tehilim.averageReadingSpeed,
      unlockedAchievements: stats.unlockedAchievements,
    }

    // Check for new achievements
    const newAchievements = checkAchievements(achievementStats)

    if (newAchievements.length === 0) {
      return []
    }

    // Unlock new achievements in database
    const unlockPromises = newAchievements.map(achievement =>
      supabase.rpc('unlock_achievement', {
        p_user_id: userId,
        p_achievement_id: achievement.id,
      })
    )

    await Promise.all(unlockPromises)

    return newAchievements
  } catch (error) {
    console.error("Error checking achievements:", error)
    return []
  }
}

/**
 * Get all achievements for a user (both unlocked and locked)
 */
export async function getUserAchievements(userId: string) {
  const supabase = await createClient()

  try {
    const stats = await getUserStatistics(userId)
    if (!stats) return { unlocked: [], locked: [] }

    const { data: unlockedData } = await supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', userId)

    const unlockedIds = new Set(unlockedData?.map(a => a.achievement_id) || [])

    const allAchievements = await import('@/lib/achievements').then(m => m.achievements)

    const unlocked = allAchievements.filter(a => unlockedIds.has(a.id))
    const locked = allAchievements.filter(a => !unlockedIds.has(a.id))

    return { unlocked, locked }
  } catch (error) {
    console.error("Error getting user achievements:", error)
    return { unlocked: [], locked: [] }
  }
}

/**
 * Manually unlock an achievement (for testing or admin purposes)
 */
export async function unlockAchievement(userId: string, achievementId: string): Promise<boolean> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.rpc('unlock_achievement', {
      p_user_id: userId,
      p_achievement_id: achievementId,
    })

    return !error
  } catch (error) {
    console.error("Error unlocking achievement:", error)
    return false
  }
}
