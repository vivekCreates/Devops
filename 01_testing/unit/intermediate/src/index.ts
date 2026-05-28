import express from "express";
import { z } from "zod";

const app = express();

app.use(express.json());

const sumInputs = z.object({
  a: z.number(),
  b: z.number(),
});

app.post("/sum", (req, res) => {
  const validateResult = sumInputs.safeParse(req.body);

  if (!validateResult.success) {
    return res.status(400).json({
      message: "Invalid inputs",
      errors: validateResult.error?.issues,
    });
  }

  const { a, b } = validateResult.data;

  if (a > 100000 || b > 100000) {
    return res.status(422).json({
      message: "Sorry we dont process big numbers",
    });
  }

  res.json({
    answer: a + b,
  });
});

export default app;