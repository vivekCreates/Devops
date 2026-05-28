import connectToDatabase from "./db.js"
import app from "./index.js"
connectToDatabase()
.then(()=>{
    app.listen(3000,()=>console.log("Server is running on http://localhost:3000"))
})
.catch(error=>console.log(error))