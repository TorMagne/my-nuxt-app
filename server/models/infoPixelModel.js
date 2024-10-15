import mongoose from 'mongoose';

const infopixelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    medicalname: {
      type: String,
    },
    description: {
      type: String,
    },
    hint: {
      type: String,
    },
    level: {
      type: Number,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Infopixel || mongoose.model('Infopixel', infopixelSchema);
