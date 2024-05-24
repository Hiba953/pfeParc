import mongoose from 'mongoose';

const totalMontantSchema = new mongoose.Schema({
  totalMontant: {
    type: Number,
    required: true,
    default: 0
  }
});

const TotalMontantModel = mongoose.model('TotalMontant', totalMontantSchema);

export default TotalMontantModel;
