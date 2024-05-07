import mongoose from "mongoose"
import { ROLES } from "../constants.js"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({

username :{
    type : String,
    required : true,
    unique:true
},
password :{
    type : String,
    required : true,
    minLength : 8
},
role :{
    type : String,
    lowerCase : true ,
    enum: Object.values(ROLES),
  
},
title:{
    type: String,
    lowerCase:true,
},
createdBy:{
    type: mongoose.Types.ObjectId,
    ref :"user"
}


})
userSchema.pre("save", async function(next){
    if (this.isModified("password")){
        //hash password
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)

    }
    next()
})

userSchema.methods.comparePassword = async function (passwordCondidate){
    const isMatch = await bcrypt.compare(passwordCondidate, this.password);
    return isMatch;
}
userSchema.methods.toJSON= function(){
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    user.id=user._id
    return user;
}


export const userModel = mongoose.model("user",userSchema)