import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    group: {
      type: String,
      enum: ['A', 'B'],
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
