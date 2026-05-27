import { describe, expect, test } from 'vitest'
import axios from 'axios'


describe('return sum of the numbers ', () => {
  test('Should return positive number if add two postive numbers', async() => {
    const res = await axios.post("http://localhost:3000/sum",{
      a:3,b:5
    })
    console.log(res)
    expect(res.data.answer).toBe(8);
    
  })

  // test('Should return negative numbers if add two negative numbers', () => {
    
  // })

  // test('returns 0  if add two zeros', () => {
    
  // })
})