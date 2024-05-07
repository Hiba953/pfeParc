import mongoose from "mongoose";


const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },

  token: {
    type: String,
    required: true,
    unique: true,
  },

  validUntil: {
    type: Date,
    required: true,
  },
});

sessionSchema.methods.toJSON= function(){
    const session = this.toObject()
    delete session._id;
    delete session.__v;
    delete session.user;
    return session;
}
export const sessionModel = mongoose.model("session", sessionSchema);
