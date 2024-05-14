import mongoose from "mongoose";
import { PIECE } from "../constants";
const pieceSchema= new mongoose.Schema({

name :{
    type:String
},



})
export const pieceModel=mongoose.model("piece",pieceSchema)