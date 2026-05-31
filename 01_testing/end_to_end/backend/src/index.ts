import express from "express";
import cors from "cors";


const app = express();

app.use(express.json());
app.use(cors({
	origin:"http://localhost:5173",
	credentials:true}
));

app.get("/",async(req,res)=>{

return res.json({message:"Health is ok"})
})


app.listen(3000,()=>{
	console.log("Server is running on http://localhost:3000");
})
