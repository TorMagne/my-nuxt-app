const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
