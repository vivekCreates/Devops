import mongoose from "mongoose"

export default async function connectToDatabase(){
    try{
        const connectedInstance = await mongoose.connect("mongodb://127.0.0.1:27017/unit-test")
        console.log("mongodb connected successfully")
        console.log("Host at",connectedInstance.connection.host)
    }catch(error:any){
        console.log("Mongodb connection failed: ",error?.message)
        process.exit(0);
    }
};

