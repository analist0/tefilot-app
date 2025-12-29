import { Flame, Trophy, Star, Target, Zap, Heart, BookOpen, Award, Crown, Sparkles } from "lucide-react"

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  color: string
  requirement: number
  category: "streak" | "chapters" | "verses" | "speed" | "special"
  unlocked?: boolean
  progress?: number
  unlockedAt?: Date
}

export const achievements: Achievement[] = [
  // Streak Achievements
  {
    id: "streak_3",
    title: "התחלה טובה",
    description: "קרא 3 ימים ברצף",
    icon: "Flame",
    color: "from-orange-500 to-red-500",
    requirement: 3,
    category: "streak",
  },
  {
    id: "streak_7",
    title: "שבוע של קריאה",
    description: "קרא 7 ימים ברצף",
    icon: "Flame",
    color: "from-red-500 to-pink-500",
    requirement: 7,
    category: "streak",
  },
  {
    id: "streak_30",
    title: "חודש מלא!",
    description: "קרא 30 ימים ברצף",
    icon: "Flame",
    color: "from-purple-500 to-pink-500",
    requirement: 30,
    category: "streak",
  },
  {
    id: "streak_100",
    title: "מאה ימים!",
    description: "קרא 100 ימים ברצף",
    icon: "Crown",
    color: "from-yellow-500 to-amber-500",
    requirement: 100,
    category: "streak",
  },

  // Chapter Achievements
  {
    id: "chapters_10",
    title: "קורא מתחיל",
    description: "השלם 10 פרקים",
    icon: "BookOpen",
    color: "from-blue-500 to-cyan-500",
    requirement: 10,
    category: "chapters",
  },
  {
    id: "chapters_50",
    title: "קורא מתמיד",
    description: "השלם 50 פרקים",
    icon: "BookOpen",
    color: "from-cyan-500 to-teal-500",
    requirement: 50,
    category: "chapters",
  },
  {
    id: "chapters_150",
    title: "סיום תהילים!",
    description: "השלם את כל ספר תהילים (150 פרקים)",
    icon: "Trophy",
    color: "from-yellow-500 to-amber-500",
    requirement: 150,
    category: "chapters",
  },

  // Verse Achievements
  {
    id: "verses_100",
    title: "מאה פסוקים",
    description: "קרא 100 פסוקים",
    icon: "Star",
    color: "from-indigo-500 to-purple-500",
    requirement: 100,
    category: "verses",
  },
  {
    id: "verses_1000",
    title: "אלף פסוקים!",
    description: "קרא 1,000 פסוקים",
    icon: "Sparkles",
    color: "from-purple-500 to-pink-500",
    requirement: 1000,
    category: "verses",
  },

  // Speed Achievements
  {
    id: "speed_master",
    title: "קורא מהיר",
    description: "קרא במהירות של 120+ מילים לדקה",
    icon: "Zap",
    color: "from-yellow-500 to-orange-500",
    requirement: 120,
    category: "speed",
  },

  // Special Achievements
  {
    id: "first_chapter",
    title: "הצעד הראשון",
    description: "השלם את הפרק הראשון",
    icon: "Target",
    color: "from-green-500 to-emerald-500",
    requirement: 1,
    category: "special",
  },
  {
    id: "night_reader",
    title: "קורא לילה",
    description: "קרא אחרי חצות",
    icon: "Moon",
    color: "from-indigo-500 to-blue-500",
    requirement: 1,
    category: "special",
  },
  {
    id: "early_bird",
    title: "ציפור מוקדמת",
    description: "קרא לפני 6 בבוקר",
    icon: "Sun",
    color: "from-amber-500 to-yellow-500",
    requirement: 1,
    category: "special",
  },
]

export function checkAchievements(stats: {
  currentStreak: number
  chaptersCompleted: number
  versesRead: number
  averageSpeed: number
  unlockedAchievements: string[]
}): Achievement[] {
  const newAchievements: Achievement[] = []
  const currentHour = new Date().getHours()

  for (const achievement of achievements) {
    // Skip if already unlocked
    if (stats.unlockedAchievements.includes(achievement.id)) {
      continue
    }

    let shouldUnlock = false

    switch (achievement.category) {
      case "streak":
        shouldUnlock = stats.currentStreak >= achievement.requirement
        break
      case "chapters":
        shouldUnlock = stats.chaptersCompleted >= achievement.requirement
        break
      case "verses":
        shouldUnlock = stats.versesRead >= achievement.requirement
        break
      case "speed":
        shouldUnlock = stats.averageSpeed >= achievement.requirement
        break
      case "special":
        if (achievement.id === "first_chapter") {
          shouldUnlock = stats.chaptersCompleted >= 1
        } else if (achievement.id === "night_reader") {
          shouldUnlock = currentHour >= 0 && currentHour < 6
        } else if (achievement.id === "early_bird") {
          shouldUnlock = currentHour >= 4 && currentHour < 6
        }
        break
    }

    if (shouldUnlock) {
      newAchievements.push({
        ...achievement,
        unlocked: true,
        unlockedAt: new Date(),
      })
    }
  }

  return newAchievements
}

export function getAchievementProgress(achievement: Achievement, stats: {
  currentStreak: number
  chaptersCompleted: number
  versesRead: number
  averageSpeed: number
}): number {
  switch (achievement.category) {
    case "streak":
      return Math.min((stats.currentStreak / achievement.requirement) * 100, 100)
    case "chapters":
      return Math.min((stats.chaptersCompleted / achievement.requirement) * 100, 100)
    case "verses":
      return Math.min((stats.versesRead / achievement.requirement) * 100, 100)
    case "speed":
      return Math.min((stats.averageSpeed / achievement.requirement) * 100, 100)
    default:
      return 0
  }
}
