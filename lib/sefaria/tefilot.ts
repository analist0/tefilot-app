// Tefilot (Prayers) Structure and Sefaria References

export interface TefilaSection {
  title: string
  heTitle: string
  sefariaRef?: string
  description?: string
  subsections?: TefilaSection[]
}

export const SHACHARIT_STRUCTURE: TefilaSection[] = [
  {
    title: "Morning Blessings",
    heTitle: "ברכות השחר",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Morning Blessings",
    description: "הכנה לתפילת השחר עם ברכות הבוקר",
    subsections: [
      { title: "Mode Ani", heTitle: "מודה אני", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Morning Blessings, Modeh Ani" },
      { title: "Netilat Yadayim", heTitle: "נטילת ידיים", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Morning Blessings, Al Netilat Yadayim" },
      { title: "Asher Yatzar", heTitle: "אשר יצר", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Morning Blessings, Asher Yatzar" },
      { title: "Elohai Neshama", heTitle: "אלהי נשמה", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Morning Blessings, Elohai Neshamah" }
    ]
  },
  {
    title: "Torah Study",
    heTitle: "ברכת התורה ולימוד",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Torah Study",
    description: "ברכות התורה ופסוקים ללימוד",
    subsections: [
      { title: "Blessings on Torah", heTitle: "ברכות התורה", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Torah Study, Blessings on the Torah" },
      { title: "Birkat Kohanim", heTitle: "ברכת כהנים", sefariaRef: "Numbers.6.24-26" },
      { title: "Mishna Study", heTitle: "משנה פאה", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Torah Study, Mishnah" }
    ]
  },
  {
    title: "Pesukei DeZimra",
    heTitle: "פסוקי דזמרה",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Pesukei Dezimra",
    description: "פסוקי תהילה והודיה",
    subsections: [
      { title: "Barukh SheAmar", heTitle: "ברוך שאמר", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Pesukei Dezimra, Barukh She'amar" },
      { title: "Ashrei", heTitle: "אשרי", sefariaRef: "Psalms.145" },
      { title: "Hallelujah Psalms", heTitle: "פסוקי הלל", sefariaRef: "Psalms.146-150" },
      { title: "Yishtabach", heTitle: "ישתבח", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Pesukei Dezimra, Yishtabach" }
    ]
  },
  {
    title: "Shema and Blessings",
    heTitle: "קריאת שמע וברכותיה",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Shema",
    description: "קריאת שמע עם ברכות",
    subsections: [
      { title: "Yotzer Or", heTitle: "יוצר אור", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Shema, First Blessing Before Shema" },
      { title: "Shema", heTitle: "שמע ישראל", sefariaRef: "Deuteronomy.6.4-9" },
      { title: "VeAhavta", heTitle: "ואהבת", sefariaRef: "Deuteronomy.6.5-9" },
      { title: "Second Paragraph", heTitle: "והיה אם שמוע", sefariaRef: "Deuteronomy.11.13-21" },
      { title: "Third Paragraph", heTitle: "ויאמר", sefariaRef: "Numbers.15.37-41" },
      { title: "Emet VeYatziv", heTitle: "אמת ויציב", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Shema, First Blessing After Shema" }
    ]
  },
  {
    title: "Amidah",
    heTitle: "עמידה (שמונה עשרה)",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Amidah",
    description: "תפילת העמידה - תפילה בלחש",
    subsections: [
      { title: "Avot", heTitle: "אבות", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Amidah, Patriarchs" },
      { title: "Gevurot", heTitle: "גבורות", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Amidah, Divine Might" },
      { title: "Kedushah", heTitle: "קדושה", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Amidah, Holiness of God" }
    ]
  },
  {
    title: "Tachanun",
    heTitle: "תחנון",
    sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Tachanun",
    description: "תפילת תחנונים (לא בימי שמחה)"
  },
  {
    title: "Concluding Prayers",
    heTitle: "סיום התפילה",
    description: "אשרי, ובא לציון, עלינו",
    subsections: [
      { title: "Ashrei", heTitle: "אשרי", sefariaRef: "Psalms.145" },
      { title: "UVa LeTzion", heTitle: "ובא לציון", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Concluding Prayers, UVa LeTzion" },
      { title: "Aleinu", heTitle: "עלינו לשבח", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Concluding Prayers, Aleinu" }
    ]
  }
]

export const MINCHA_STRUCTURE: TefilaSection[] = [
  {
    title: "Ashrei",
    heTitle: "אשרי",
    sefariaRef: "Psalms.145",
    description: "פתיחת תפילת המנחה"
  },
  {
    title: "Amidah",
    heTitle: "עמידה (שמונה עשרה)",
    sefariaRef: "Siddur Ashkenaz, Weekday, Mincha, Amidah",
    description: "תפילת העמידה - תפילה בלחש"
  },
  {
    title: "Tachanun",
    heTitle: "תחנון",
    sefariaRef: "Siddur Ashkenaz, Weekday, Mincha, Tachanun",
    description: "תפילת תחנונים (בימי חול מסוימים)"
  },
  {
    title: "Aleinu",
    heTitle: "עלינו לשבח",
    sefariaRef: "Siddur Ashkenaz, Weekday, Mincha, Concluding Prayers, Aleinu",
    description: "סיום התפילה"
  }
]

export const MAARIV_STRUCTURE: TefilaSection[] = [
  {
    title: "Shema and Blessings",
    heTitle: "קריאת שמע וברכותיה",
    sefariaRef: "Siddur Ashkenaz, Weekday, Maariv, Shema",
    description: "קריאת שמע עם ברכות",
    subsections: [
      { title: "Maariv Aravim", heTitle: "מעריב ערבים", sefariaRef: "Siddur Ashkenaz, Weekday, Maariv, Shema, First Blessing Before Shema" },
      { title: "Shema", heTitle: "שמע ישראל", sefariaRef: "Deuteronomy.6.4-9" },
      { title: "VeAhavta", heTitle: "ואהבת", sefariaRef: "Deuteronomy.6.5-9" },
      { title: "Second Paragraph", heTitle: "והיה אם שמוע", sefariaRef: "Deuteronomy.11.13-21" },
      { title: "Third Paragraph", heTitle: "ויאמר", sefariaRef: "Numbers.15.37-41" },
      { title: "Emet VeEmunah", heTitle: "אמת ואמונה", sefariaRef: "Siddur Ashkenaz, Weekday, Maariv, Shema, First Blessing After Shema" }
    ]
  },
  {
    title: "Amidah",
    heTitle: "עמידה (שמונה עשרה)",
    sefariaRef: "Siddur Ashkenaz, Weekday, Maariv, Amidah",
    description: "תפילת העמידה - תפילה בלחש"
  },
  {
    title: "Aleinu",
    heTitle: "עלינו לשבח",
    sefariaRef: "Siddur Ashkenaz, Weekday, Maariv, Concluding Prayers, Aleinu",
    description: "סיום התפילה"
  }
]

export const BRACHOT_STRUCTURE: TefilaSection[] = [
  {
    title: "Morning Blessings",
    heTitle: "ברכות השחר",
    description: "ברכות הבוקר היומיות",
    subsections: [
      { title: "Al Netilat Yadayim", heTitle: "על נטילת ידיים", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Morning Blessings, Al Netilat Yadayim" },
      { title: "Asher Yatzar", heTitle: "אשר יצר", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Morning Blessings, Asher Yatzar" },
      { title: "Elohai Neshama", heTitle: "אלהי נשמה", sefariaRef: "Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Morning Blessings, Elohai Neshamah" }
    ]
  },
  {
    title: "Blessings on Food",
    heTitle: "ברכות הנהנין",
    description: "ברכות לפני ואחרי אכילה",
    subsections: [
      { title: "HaMotzi", heTitle: "המוציא לחם מן הארץ" },
      { title: "Mezonot", heTitle: "בורא מיני מזונות" },
      { title: "HaGafen", heTitle: "בורא פרי הגפן" },
      { title: "HaEtz", heTitle: "בורא פרי העץ" },
      { title: "HaAdama", heTitle: "בורא פרי האדמה" },
      { title: "SheHakol", heTitle: "שהכל נהיה בדברו" }
    ]
  },
  {
    title: "Birkat HaMazon",
    heTitle: "ברכת המזון",
    sefariaRef: "Siddur Ashkenaz, Grace after Meals",
    description: "ברכה מלאה אחרי אכילת לחם"
  },
  {
    title: "Blessings on Mitzvot",
    heTitle: "ברכות המצוות",
    description: "ברכות על קיום מצוות",
    subsections: [
      { title: "Tefillin", heTitle: "להניח תפילין" },
      { title: "Tzitzit", heTitle: "על מצות ציצית" },
      { title: "Mezuzah", heTitle: "לקבוע מזוזה" },
      { title: "Candle Lighting", heTitle: "להדליק נר (שבת/חג)" }
    ]
  }
]

// Helper function to get prayer structure
export function getTefilaStructure(tefilaType: "shacharit" | "mincha" | "maariv" | "brachot"): TefilaSection[] {
  switch (tefilaType) {
    case "shacharit":
      return SHACHARIT_STRUCTURE
    case "mincha":
      return MINCHA_STRUCTURE
    case "maariv":
      return MAARIV_STRUCTURE
    case "brachot":
      return BRACHOT_STRUCTURE
    default:
      return []
  }
}

// Helper to get a flattened list of all sections with Sefaria refs
export function getTefilaSefariaRefs(tefilaType: "shacharit" | "mincha" | "maariv" | "brachot"): Array<{ title: string; heTitle: string; ref: string }> {
  const structure = getTefilaStructure(tefilaType)
  const refs: Array<{ title: string; heTitle: string; ref: string }> = []

  function extractRefs(sections: TefilaSection[]) {
    for (const section of sections) {
      if (section.sefariaRef) {
        refs.push({
          title: section.title,
          heTitle: section.heTitle,
          ref: section.sefariaRef
        })
      }
      if (section.subsections) {
        extractRefs(section.subsections)
      }
    }
  }

  extractRefs(structure)
  return refs
}
