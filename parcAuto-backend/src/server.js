import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import { connectDB } from "../bd/bd.js";
import { setUpRoutes } from "../routes/rout.js";
import { userModel } from "../bd/model.js";
import { ROLES } from "../constants.js";


const app = express();
app.use(express.json())
app.use(cors())

connectDB().then(()=>{
    console.log("[INFO] connect to db")
} )
setUpRoutes(app)
app.listen(3000)


async function setUp (){
    const user = await userModel.create({
        username : "admin",
        password:"1234567890",
        role : ROLES.ADMIN
    }).catch(e=>{})
}
setUp()
