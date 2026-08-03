import mongoose from "mongoose"

export const connectDB = async ()=>{
    
    try{
        await mongoose.connect()
    }
}


