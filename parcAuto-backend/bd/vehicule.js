

import mongoose from "mongoose"
import { CARB_TYPE } from "../constants.js"

const vehiculeSchema = new mongoose.Schema({
  service: {
    type: String,
    unique: true,
    required: true
  },
  marque: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  matricule: {
    type: String,
    unique: true,
    required: true
  },
  carburant: {
    type: String,
    uppercase: true,
    enum: Object.values(CARB_TYPE),
    required: true
  },
  km: {
    type: Number,
    required: true
  },
  etat: {
    type: String,
    required: true
  },
  quota: {
    type: Number,
    required: true
  },

});

export const vehiculeModel = mongoose.model("vehicules", vehiculeSchema)

