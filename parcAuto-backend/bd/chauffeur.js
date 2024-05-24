import mongoose from "mongoose";


const chauffeurSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  fonction: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
});


export const ChauffeurModel = mongoose.model("chauffeur", chauffeurSchema);
