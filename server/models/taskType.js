import mongoose from 'mongoose';

const taskTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.TaskType || mongoose.model('TaskType', taskTypeSchema);
