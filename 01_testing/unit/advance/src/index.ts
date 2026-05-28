import express from "express"
import Todo from "./schema.js";


const app = express();
app.use(express.json());


app.post("/todos",async(req,res)=>{
    try {
        const {title,description,completed=false} = req.body;

        if(!title || !description){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

    const todo = await Todo.insertOne({
        title,
        completed,
        description
    })

    if (todo){
        return res.status(200).json({
            message:"Todo create successfully",
            data:todo
        })
    }

    } catch (error:any) {
        console.log("Failed to create todo: ",error?.message)
    }
})


export default app;