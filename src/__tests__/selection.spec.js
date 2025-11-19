import { describe, it, expect } from 'vitest'
import { toNumericId, isValidId } from '../utils/selection.js'

describe('selection utils', () => {
  it('toNumericId extracts numeric id', () => {
    expect(toNumericId('123')).toBe(123)
    expect(toNumericId('id-45a')).toBe(45)
    expect(toNumericId('abc')).toBe(null)
    expect(toNumericId(null)).toBe(null)
  })

  it('isValidId validates id', () => {
    expect(isValidId(1)).toBe(true)
    expect(isValidId(0)).toBe(false)
    expect(isValidId(-5)).toBe(false)
    expect(isValidId(1.2)).toBe(false)
    expect(isValidId('3')).toBe(false)
  })
})