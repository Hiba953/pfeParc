import mongoose from "mongoose"

export function connectDB(){
    return mongoose.connect(process.env.MONGO_URL)

}