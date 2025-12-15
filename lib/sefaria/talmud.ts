// Talmud Bavli structure

export const TALMUD_TRACTATES = [
  // Seder Zeraim
  { en: "Berakhot", he: "ברכות", pages: 64, seder: "Zeraim" },

  // Seder Moed
  { en: "Shabbat", he: "שבת", pages: 157, seder: "Moed" },
  { en: "Eruvin", he: "עירובין", pages: 105, seder: "Moed" },
  { en: "Pesachim", he: "פסחים", pages: 121, seder: "Moed" },
  { en: "Shekalim", he: "שקלים", pages: 22, seder: "Moed" },
  { en: "Yoma", he: "יומא", pages: 88, seder: "Moed" },
  { en: "Sukkah", he: "סוכה", pages: 56, seder: "Moed" },
  { en: "Beitzah", he: "ביצה", pages: 40, seder: "Moed" },
  { en: "Rosh Hashanah", he: "ראש השנה", pages: 35, seder: "Moed" },
  { en: "Taanit", he: "תענית", pages: 31, seder: "Moed" },
  { en: "Megillah", he: "מגילה", pages: 32, seder: "Moed" },
  { en: "Moed Katan", he: "מועד קטן", pages: 29, seder: "Moed" },
  { en: "Chagigah", he: "חגיגה", pages: 27, seder: "Moed" },

  // Seder Nashim
  { en: "Yevamot", he: "יבמות", pages: 122, seder: "Nashim" },
  { en: "Ketubot", he: "כתובות", pages: 112, seder: "Nashim" },
  { en: "Nedarim", he: "נדרים", pages: 91, seder: "Nashim" },
  { en: "Nazir", he: "נזיר", pages: 66, seder: "Nashim" },
  { en: "Sotah", he: "סוטה", pages: 49, seder: "Nashim" },
  { en: "Gittin", he: "גיטין", pages: 90, seder: "Nashim" },
  { en: "Kiddushin", he: "קידושין", pages: 82, seder: "Nashim" },

  // Seder Nezikin
  { en: "Bava Kamma", he: "בבא קמא", pages: 119, seder: "Nezikin" },
  { en: "Bava Metzia", he: "בבא מציעא", pages: 119, seder: "Nezikin" },
  { en: "Bava Batra", he: "בבא בתרא", pages: 176, seder: "Nezikin" },
  { en: "Sanhedrin", he: "סנהדרין", pages: 113, seder: "Nezikin" },
  { en: "Makkot", he: "מכות", pages: 24, seder: "Nezikin" },
  { en: "Shevuot", he: "שבועות", pages: 49, seder: "Nezikin" },
  { en: "Avodah Zarah", he: "עבודה זרה", pages: 76, seder: "Nezikin" },
  { en: "Horayot", he: "הוריות", pages: 14, seder: "Nezikin" },

  // Seder Kodashim
  { en: "Zevachim", he: "זבחים", pages: 120, seder: "Kodashim" },
  { en: "Menachot", he: "מנחות", pages: 110, seder: "Kodashim" },
  { en: "Chullin", he: "חולין", pages: 142, seder: "Kodashim" },
  { en: "Bekhorot", he: "בכורות", pages: 61, seder: "Kodashim" },
  { en: "Arakhin", he: "ערכין", pages: 34, seder: "Kodashim" },
  { en: "Temurah", he: "תמורה", pages: 34, seder: "Kodashim" },
  { en: "Keritot", he: "כריתות", pages: 28, seder: "Kodashim" },
  { en: "Meilah", he: "מעילה", pages: 22, seder: "Kodashim" },

  // Seder Tahorot
  { en: "Niddah", he: "נידה", pages: 73, seder: "Tahorot" },
]

export function getTractateByName(name: string) {
  return TALMUD_TRACTATES.find(
    (t) => t.en.toLowerCase() === name.toLowerCase() || t.he === name
  )
}

export function getDafReference(tractate: string, daf: number, amud: "a" | "b" = "a") {
  return `${tractate}.${daf}${amud}`
}

// Calculate Daf Yomi for a given date
export function calculateDafYomi(date: Date = new Date()): { tractate: string; daf: number; amud: "a" | "b" } {
  // Starting date of current Daf Yomi cycle: January 5, 2020
  const cycleStart = new Date(2020, 0, 5)
  const diffTime = date.getTime() - cycleStart.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  let totalDafs = 0
  let currentDaf = diffDays % 2711 // Total dapim in Shas

  for (const tractate of TALMUD_TRACTATES) {
    const tractatePages = tractate.pages * 2 // Each page has 2 sides (a & b)
    if (currentDaf < tractatePages) {
      const dafInTractate = Math.floor(currentDaf / 2) + 2 // Start from daf 2
      const amud = currentDaf % 2 === 0 ? "a" : "b"
      return {
        tractate: tractate.en,
        daf: dafInTractate,
        amud,
      }
    }
    currentDaf -= tractatePages
    totalDafs += tractatePages
  }

  // Fallback
  return { tractate: "Berakhot", daf: 2, amud: "a" }
}
