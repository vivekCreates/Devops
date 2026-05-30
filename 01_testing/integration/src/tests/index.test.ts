
import request from "supertest"
import { beforeAll, describe, expect, it, test } from "vitest"
import app from ".."
import { resetDb } from "./helpers/reset-db"



describe("Integration tests", () => {

    beforeAll(async () => {
        console.log("Reseting db"
        )
        await resetDb()
    }
    )



    test("should return 200 OK", async () => {
        const res = await request(app).post("/calculate").send({
            a: 1,
            b: 2
        })
        expect(res.status).toBe(200)
        expect(res.body).toEqual({
            message: "Operation successful",
            result: 3
        })
    })

}) 