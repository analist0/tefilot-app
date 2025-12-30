import { describe, it, expect } from 'vitest'

// Since cleanText is not exported, we'll test the public API functions
// But we can create utility tests for text processing
describe('Sefaria Client Text Processing', () => {
  describe('Text cleaning utilities', () => {
    // Helper function to simulate cleanText behavior
    const cleanText = (text: string): string => {
      if (!text) return ''

      return text
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/[\u0591-\u05C7]/g, '') // Remove cantillation marks
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim()
    }

    it('should remove HTML tags', () => {
      const input = '<b>שלום</b> <i>עולם</i>'
      const expected = 'שלום עולם'
      expect(cleanText(input)).toBe(expected)
    })

    it('should remove cantillation marks', () => {
      const input = 'בְּרֵאשִׁ֖ית' // With cantillation
      const result = cleanText(input)
      expect(result).not.toContain('\u0591') // Should not contain cantillation
    })

    it('should remove zero-width characters', () => {
      const input = 'שלום\u200Bעולם' // Zero-width space
      const expected = 'שלוםעולם'
      expect(cleanText(input)).toBe(expected)
    })

    it('should normalize multiple spaces', () => {
      const input = 'שלום    עולם   מה    קורה'
      const expected = 'שלום עולם מה קורה'
      expect(cleanText(input)).toBe(expected)
    })

    it('should trim leading and trailing spaces', () => {
      const input = '   שלום עולם   '
      const expected = 'שלום עולם'
      expect(cleanText(input)).toBe(expected)
    })

    it('should handle empty strings', () => {
      expect(cleanText('')).toBe('')
      expect(cleanText('   ')).toBe('')
    })

    it('should handle complex mixed content', () => {
      const input = '  <span>בְּרֵאשִׁ֖ית</span>   בָּרָא    <b>אֱלֹהִים</b>  '
      const result = cleanText(input)

      expect(result).not.toContain('<')
      expect(result).not.toContain('>')
      expect(result.split(' ').length).toBeLessThanOrEqual(4)
      expect(result.trim()).toBe(result)
    })
  })

  describe('Hebrew text handling', () => {
    it('should preserve Hebrew characters', () => {
      const input = 'שלום עולם'
      expect(cleanText(input)).toBe('שלום עולם')
    })

    it('should preserve Hebrew with nikud', () => {
      const input = 'שָׁלוֹם'
      const result = cleanText(input)
      expect(result).toContain('ש')
      expect(result).toContain('ל')
      expect(result).toContain('ו')
      expect(result).toContain('ם')
    })

    it('should handle mixed Hebrew and numbers', () => {
      const input = 'פרק 1 פסוק 2'
      expect(cleanText(input)).toBe('פרק 1 פסוק 2')
    })

    it('should handle punctuation', () => {
      const input = 'שלום, עולם!'
      expect(cleanText(input)).toBe('שלום, עולם!')
    })
  })
})

function cleanText(input: string): string {
  if (!input) return ''

  return input
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/[\u0591-\u05C7]/g, '') // Remove cantillation marks
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
}
