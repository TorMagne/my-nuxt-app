import mongoose from 'mongoose';

export default defineNitroPlugin(async () => {
  mongoose.connect(useRuntimeConfig().MONGO_URI);
  console.log('Connected to MongoDB');
});
