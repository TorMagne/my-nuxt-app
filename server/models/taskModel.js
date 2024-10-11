import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    level: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
    },
    taskType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaskType',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
