import express from "express";

const app = express();

app.use(express.json());

app.post("/sum", (req, res) => {
  const { a, b } = req.body;

  res.json({
    answer: a + b,
  });
});


export default app;