import { describe, expect, it } from 'vitest'
import { add, capitalize, formatCurrency, multiply } from './index'

describe('package1 utilities', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('')
    })

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })

    it('should handle mixed case', () => {
      expect(capitalize('hELLo WoRLd')).toBe('Hello world')
    })
  })

  describe('add', () => {
    it('should add two numbers', () => {
      expect(add(2, 3)).toBe(5)
    })

    it('should handle negative numbers', () => {
      expect(add(-5, 10)).toBe(5)
    })

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5)
    })
  })

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(3, 4)).toBe(12)
    })

    it('should handle zero', () => {
      expect(multiply(5, 0)).toBe(0)
    })

    it('should handle negative numbers', () => {
      expect(multiply(-2, 3)).toBe(-6)
    })
  })

  describe('formatCurrency', () => {
    it('should format USD currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })

    it('should format with custom currency', () => {
      const result = formatCurrency(100, 'EUR')
      expect(result).toContain('100')
    })

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })
  })
})
