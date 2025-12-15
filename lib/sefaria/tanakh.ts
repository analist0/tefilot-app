// Tanakh specific helpers

export const TANAKH_BOOKS = {
  torah: [
    { en: "Genesis", he: "בראשית", chapters: 50 },
    { en: "Exodus", he: "שמות", chapters: 40 },
    { en: "Leviticus", he: "ויקרא", chapters: 27 },
    { en: "Numbers", he: "במדבר", chapters: 36 },
    { en: "Deuteronomy", he: "דברים", chapters: 34 },
  ],
  neviim: [
    { en: "Joshua", he: "יהושע", chapters: 24 },
    { en: "Judges", he: "שופטים", chapters: 21 },
    { en: "I Samuel", he: "שמואל א", chapters: 31 },
    { en: "II Samuel", he: "שמואל ב", chapters: 24 },
    { en: "I Kings", he: "מלכים א", chapters: 22 },
    { en: "II Kings", he: "מלכים ב", chapters: 25 },
    { en: "Isaiah", he: "ישעיהו", chapters: 66 },
    { en: "Jeremiah", he: "ירמיהו", chapters: 52 },
    { en: "Ezekiel", he: "יחזקאל", chapters: 48 },
    { en: "Hosea", he: "הושע", chapters: 14 },
    { en: "Joel", he: "יואל", chapters: 4 },
    { en: "Amos", he: "עמוס", chapters: 9 },
    { en: "Obadiah", he: "עובדיה", chapters: 1 },
    { en: "Jonah", he: "יונה", chapters: 4 },
    { en: "Micah", he: "מיכה", chapters: 7 },
    { en: "Nahum", he: "נחום", chapters: 3 },
    { en: "Habakkuk", he: "חבקוק", chapters: 3 },
    { en: "Zephaniah", he: "צפניה", chapters: 3 },
    { en: "Haggai", he: "חגי", chapters: 2 },
    { en: "Zechariah", he: "זכריה", chapters: 14 },
    { en: "Malachi", he: "מלאכי", chapters: 3 },
  ],
  ketuvim: [
    { en: "Psalms", he: "תהילים", chapters: 150 },
    { en: "Proverbs", he: "משלי", chapters: 31 },
    { en: "Job", he: "איוב", chapters: 42 },
    { en: "Song of Songs", he: "שיר השירים", chapters: 8 },
    { en: "Ruth", he: "רות", chapters: 4 },
    { en: "Lamentations", he: "איכה", chapters: 5 },
    { en: "Ecclesiastes", he: "קהלת", chapters: 12 },
    { en: "Esther", he: "אסתר", chapters: 10 },
    { en: "Daniel", he: "דניאל", chapters: 12 },
    { en: "Ezra", he: "עזרא", chapters: 10 },
    { en: "Nehemiah", he: "נחמיה", chapters: 13 },
    { en: "I Chronicles", he: "דברי הימים א", chapters: 29 },
    { en: "II Chronicles", he: "דברי הימים ב", chapters: 36 },
  ],
}

export function getAllBooks() {
  return [
    ...TANAKH_BOOKS.torah,
    ...TANAKH_BOOKS.neviim,
    ...TANAKH_BOOKS.ketuvim,
  ]
}

export function findBook(search: string) {
  const all = getAllBooks()
  return all.find(
    (book) =>
      book.en.toLowerCase() === search.toLowerCase() ||
      book.he === search
  )
}

export function getBookByEnglishName(name: string) {
  return getAllBooks().find((book) => book.en === name)
}
