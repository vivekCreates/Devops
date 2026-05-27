import { describe, expect, test } from 'vitest'
import { sum } from '../index.js'


describe('return sum of the numbers ', () => {
  test('Should return positive number if add two postive numbers', () => {
    expect(sum(2,3)).toBe(5)
  })

  test('Should return negative numbers if add two negative numbers', () => {
    expect(sum(-2,-3)).toBe(-5)
  })

  test('returns 0  if add two zeros', () => {
    expect(sum(0,0)).toBe(0)
  })
})