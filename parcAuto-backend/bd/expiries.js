import mongoose from "mongoose";
import { EXPIRY_TYPE } from "../constants.js";
const expiriesSchema = new mongoose.Schema({
    type: {
        type: String,
        uppercase: true,
        enum: Object.values(EXPIRY_TYPE),
        required: true
    },
    vehicule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicules"
    },
    entryDate: {
        type: Date,
        required: true
    },
    km: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
    },
    expiryKm: {
        type: Number,
    },
    montant:{
        type: Number,
        required:true
    },
    ref:{
        type: String,
        unique:true
    }

});

export const ExpiriesModel = mongoose.model("expiries", expiriesSchema);
