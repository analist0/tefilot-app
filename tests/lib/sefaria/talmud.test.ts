import { describe, it, expect } from 'vitest'
import { calculateDafYomi, getTractateByName, getDafReference } from '@/lib/sefaria/talmud'

describe('Daf Yomi Calculator', () => {
  describe('calculateDafYomi', () => {
    it('should return a valid daf for today', () => {
      const daf = calculateDafYomi()

      expect(daf).toBeDefined()
      expect(daf.tractate).toBeTruthy()
      expect(daf.daf).toBeGreaterThan(0)
      expect(['a', 'b']).toContain(daf.amud)
    })

    it('should return a daf number between 2 and 155', () => {
      const daf = calculateDafYomi()
      expect(daf.daf).toBeGreaterThanOrEqual(2)
      expect(daf.daf).toBeLessThanOrEqual(155) // Max daf in largest tractate (Bava Batra)
    })

    it('should return correct daf for cycle start date', () => {
      // January 5, 2020 - Cycle 14 start
      const daf = calculateDafYomi(new Date(2020, 0, 5))

      expect(daf.tractate).toBe('Berakhot')
      expect(daf.daf).toBe(2)
      expect(daf.amud).toBe('a')
    })

    it('should return correct daf for a known date', () => {
      // January 6, 2020 - Second day of cycle
      const daf = calculateDafYomi(new Date(2020, 0, 6))

      expect(daf.tractate).toBe('Berakhot')
      expect(daf.daf).toBe(2)
      expect(daf.amud).toBe('b')
    })

    it('should handle dates before cycle start', () => {
      // January 1, 2020 - Before cycle start
      const daf = calculateDafYomi(new Date(2020, 0, 1))

      expect(daf).toBeDefined()
      expect(daf.tractate).toBeTruthy()
      expect(daf.daf).toBeGreaterThan(0)
    })

    it('should progress through tractates correctly', () => {
      const date1 = new Date(2020, 0, 5) // Start
      const date2 = new Date(2020, 0, 6) // Day 2

      const daf1 = calculateDafYomi(date1)
      const daf2 = calculateDafYomi(date2)

      expect(daf1.tractate).toBe(daf2.tractate)
      expect(daf1.daf).toBe(daf2.daf)
      expect(daf1.amud).toBe('a')
      expect(daf2.amud).toBe('b')
    })

    it('should switch amud before switching daf', () => {
      const date1 = new Date(2020, 0, 5) // 2a
      const date2 = new Date(2020, 0, 6) // 2b
      const date3 = new Date(2020, 0, 7) // 3a

      const daf1 = calculateDafYomi(date1)
      const daf2 = calculateDafYomi(date2)
      const daf3 = calculateDafYomi(date3)

      expect(daf1.amud).toBe('a')
      expect(daf2.amud).toBe('b')
      expect(daf3.amud).toBe('a')
      expect(daf3.daf).toBe(daf1.daf + 1)
    })

    it('should have correct cycle length', () => {
      // A complete Daf Yomi cycle is 2,711 dapim (about 7.5 years)
      const cycleStart = new Date(2020, 0, 5)
      const cycleEnd = new Date(cycleStart)
      cycleEnd.setDate(cycleEnd.getDate() + 2711) // 2711 days

      const startDaf = calculateDafYomi(cycleStart)
      const endDaf = calculateDafYomi(cycleEnd)

      // After one complete cycle, should be back to Berakhot 2a
      expect(endDaf.tractate).toBe('Berakhot')
      expect(endDaf.daf).toBe(2)
      expect(endDaf.amud).toBe('a')
    })
  })

  describe('getTractateByName', () => {
    it('should find tractate by English name', () => {
      const tractate = getTractateByName('Berakhot')
      expect(tractate).toBeDefined()
      expect(tractate?.en).toBe('Berakhot')
    })

    it('should find tractate by Hebrew name', () => {
      const tractate = getTractateByName('ברכות')
      expect(tractate).toBeDefined()
      expect(tractate?.he).toBe('ברכות')
    })

    it('should return undefined for non-existent tractate', () => {
      const tractate = getTractateByName('NonExistent')
      expect(tractate).toBeUndefined()
    })
  })

  describe('getDafReference', () => {
    it('should format daf reference correctly', () => {
      const ref = getDafReference('Berakhot', 5, 'a')
      expect(ref).toBe('Berakhot.5a')
    })

    it('should default to amud a', () => {
      const ref = getDafReference('Berakhot', 5)
      expect(ref).toBe('Berakhot.5a')
    })

    it('should handle amud b', () => {
      const ref = getDafReference('Shabbat', 10, 'b')
      expect(ref).toBe('Shabbat.10b')
    })
  })
})
