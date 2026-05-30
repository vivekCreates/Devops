import express from "express"
import {prisma} from "./db.js";


const app = express();

app.use(express.json());


app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Welcome to our calculator app"
    })
} );

app.post("/calculate",async(req,res)=>{
    const {a,b} = req.body;

    if(a>100000 || b > 100000){
        return res.status(400).json({
            message:"Our app dont support too big numbers"
        })
    }

    const result = await prisma.calculation.create({
        data:{
            a,
            b,
            result:a+b,
            type:"ADD"
        }
    })
    res.status(200).json({
        message:"Operation successful",
        result:result.result
    })
})


export default app;