import { describe, expect, test } from 'vitest'
import request from "supertest"
import app from '../index.js';


describe('return sum of the numbers ', () => {
  test('Should return positive number if add two positive numbers', async () => {
  const res = await request(app)
    .post('/sum')
    .send({ a: 5, b: 2 });

  expect(res.status).toBe(200);
  expect(res.body.answer).toBe(7);
  })


  test('Should return negative number if add two negative numbers', async () => {
  const res = await request(app)
    .post('/sum')
    .send({ a: -5, b: -3 });

  expect(res.status).toBe(200);
  expect(res.body.answer).toBe(-8);
});

})