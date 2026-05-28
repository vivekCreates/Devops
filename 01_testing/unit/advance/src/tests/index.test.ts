import { describe, expect, it, vi } from "vitest";
import request from "supertest";

import app from "../index.js";
import Todo from "../schema.js";

// MOCK MONGOOSE MODEL
vi.mock("../schema.js", () => ({
    default: {
        create: vi.fn(),
        find: vi.fn(),
    },
}));

describe("POST /todos", () => {

    it("should create todo successfully", async () => {

        vi.mocked(Todo.create).mockResolvedValue({
            _id: "123",
            title: "Learn Agentic AI",
            description: "Agentic AI description",
            completed: false,
        } as any);

        const response = await request(app)
            .post("/todos")
            .send({
                title: "Learn Agentic AI",
                description: "Agentic AI description",
                completed: false,
            });

        expect(response.status).toBe(200);

        expect(response.body.message).toBe(
            "Todo create successfully"
        );

        expect(Todo.create).toHaveBeenCalledWith({
            title: "Learn Agentic AI",
            description: "Agentic AI description",
            completed: false,
        });

    });

    it("should return 400 if title is empty", async () => {

        const response = await request(app)
            .post("/todos")
            .send({
                title: "",
                description: "Agentic AI description",
                completed: false,
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            "All fields are required"
        );

    });

    it("should return 400 if description is empty", async () => {

        const response = await request(app)
            .post("/todos")
            .send({
                title: "Learn Agentic AI",
                description: "",
                completed: false,
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            "All fields are required"
        );

    });

    it("should return 400 if all fields are empty", async () => {

        const response = await request(app)
            .post("/todos")
            .send({
                title: "",
                description: "",
                completed: false,
            });

        expect(response.status).toBe(400);

        expect(response.body.message).toBe(
            "All fields are required"
        );

    });

});