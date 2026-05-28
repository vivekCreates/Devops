import express from "express";

const app = express();

app.use(express.json());

app.post("/sum", (req, res) => {
  const { a, b } = req.body;

  if (a>100000 || b > 100000){
    return res.status(422).json({
      message:"Sorry we dont process big numbers"
    })
  }

  res.json({
    answer: a + b,
  });
});


export default app;