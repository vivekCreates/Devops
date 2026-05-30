
import request from "supertest"
import { describe, expect, it, test } from "vitest"
import app from ".."



describe("Integration tests", () => {
    test("should return 200 OK", async () => {
        const res = await request(app).post("/calculate").send({
            a: 1,
            b: 2    
        })
        expect(res.status).toBe(200)
        expect(res.body).toEqual({
           message:"Operation successful",
            result:3
        })
    })

}) 