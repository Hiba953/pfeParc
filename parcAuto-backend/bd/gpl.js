import mongoose from 'mongoose';

// Define schema for GPL form submissions
const gplSchema = new mongoose.Schema({
  dateRenouvellement: {
    type: Date,
    required: true
  },
  kilometrage: {
    type: Number,
    required: true
  },
  etatBouteille: {
    type: String,
    enum: ['Bon', 'Endommagé', 'Vide'],
    required: true
  },
  observations: {
    type: String
  }
});

// Create and export model based on schema
export const gplModel = mongoose.model('GPL', gplSchema);

