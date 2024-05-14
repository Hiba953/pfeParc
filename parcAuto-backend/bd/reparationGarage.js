import mongoose from "mongoose";
import { EXPIRY_TYPE } from "../constants.js";
const reparationGarageSchema = new mongoose.Schema({
    vehicule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicules",
    },
    pieces: {
        type: [Object],
    },
  
    entryDate: {
        type: Date,
        required: true,
    },

    exitDate: {
        type: Date,
        required: true,
    },
    panneDeclaree: {
        type: String,
    },
    panneReparee: {
        type: String,
    },
    montantTotale: {
        type: Number,
        required: true,
    },
    repairDate: {
        type: Date,
        required: true,
    },
});

export const reparationGarageModel = mongoose.model(
    "reparation garage",
    reparationGarageSchema
);
