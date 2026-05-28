import { describe, expect, test } from "vitest";
import request from "supertest";
import app from "../index.js";

describe("POST /sum", () => {

  test("Should return positive number if add two positive numbers", async () => {
    const res = await request(app)
      .post("/sum")
      .send({ a: 5, b: 2 });

    expect(res.status).toBe(200);
    expect(res.body.answer).toBe(7);
  });

  test("Should return negative number if add two negative numbers", async () => {
    const res = await request(app)
      .post("/sum")
      .send({ a: -5, b: -3 });

    expect(res.status).toBe(200);
    expect(res.body.answer).toBe(-8);
  });

  test("Should return message if number is too big", async () => {
    const res = await request(app)
      .post("/sum")
      .send({ a: 1000000, b: -3 });

    expect(res.status).toBe(422);
    expect(res.body.message).toBe(
      "Sorry we dont process big numbers"
    );
  });

  test("Should return 400 if a is missing", async () => {
    const res = await request(app)
      .post("/sum")
      .send({ b: 5 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid inputs");
  });

  test("Should return 400 if b is missing", async () => {
    const res = await request(app)
      .post("/sum")
      .send({ a: 5 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid inputs");
  });

  test("Should return 400 if a is string", async () => {
    const res = await request(app)
      .post("/sum")
      .send({ a: "5", b: 2 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid inputs");
  });

  test("Should return 400 if body is empty", async () => {
    const res = await request(app)
      .post("/sum")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid inputs");
  });

});