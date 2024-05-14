import mongoose from "mongoose"
import { CARB_TYPE } from "../constants.js"

const rechargeCarburantSchema = new mongoose.Schema({
chauffeur:{
    type:String,
 //  type: mongoose.Schema.Types.ObjectId,
 //  ref:"chauffeurs",
 required: true
},
vehicule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicules",
    required: true
},
type: {
    type: String,
    uppercase: true,
    enum: Object.values(CARB_TYPE),
    required: true
},
dateRecharge :{
    type : Date,
    required : true,
    
},
km :{
    type : Number,
    required : true,

},
montant:{
    type: Number,
    required : true,

},
});

export const RechargeCarburantModel = mongoose.model("rechargeCarburant",rechargeCarburantSchema)