import mongoose from 'mongoose';
import User from '../models/userModel.js'; // Adjust the path as necessary
import dotenv from 'dotenv';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});

    // Clear existing users
    await User.deleteMany({});

    const users = [];

    for (let i = 1; i <= 105; i++) {
      users.push({
        userNumber: `user${i}`,
        group: i <= 50 ? 'A' : 'B',
        role: i > 100 ? 'admin' : 'student',
      });
    }

    await User.insertMany(users);
    console.log('Users seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding users:', error);
    mongoose.connection.close();
  }
};

seedUsers();
