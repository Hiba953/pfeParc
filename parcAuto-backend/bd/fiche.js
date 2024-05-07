
// import mongoose from "mongoose" 
// import { CARB_TYPE } from "../constants"

// const ficheSchema = new mongoose.Schema({
//     service:{
//         type: String,
//         unique: true,
//         required: true
//       },
//   marque: {
//     type: String,
//     required: true
//   },
//   model: {
//     type: String,
//     required: true
//   },
//   matricule: {
//     type: String,
//     unique: true,
//     required: true
//   },
//   carburant: {
//     type: String,
//     uppercase: true,
//     enum: Object.values(CARB_TYPE),
//     required: true
//   },
//   service: {
//     type: String,
//     required: true
//   },
//   km: {
//     type: Number,
//     required: true
//   },
//   etat: {
//     type: String
//     // You can add validation rules for etat if needed
//   },
//   quota: {
//     type: Number
//     // You can add validation rules for quota if needed
//   }
// ,fuel:{
//     type: String,
//     unique: true,
//     required: true
//   }
// });

// export const ficheModel = mongoose.model("fiche",ficheSchema )

// import mongoose from "mongoose";
// import { CARB_TYPE } from "../constants"

// const ficheSchema = new mongoose.Schema({
//   vehicule: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "vehicules"
//   },
//   carburant: {
//     type: String,
//     uppercase: true,
//     enum: Object.values(CARB_TYPE),
//     required: true
//   },
//   km: {
//     type: Number,
//     required: true
//   },
//   etat: {
//     type: String,
//     required: true
//   },
//   quota: {
//     type: Number,
//     required: true
//   },


// });

// export const ficheModel = mongoose.model("fiche", ficheSchema);


import mongoose from "mongoose";
import { CARB_TYPE } from "../constants"

const ficheSchema = new mongoose.Schema({
  vehicule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicules"
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

export const ficheModel = mongoose.model("fiche", ficheSchema);
