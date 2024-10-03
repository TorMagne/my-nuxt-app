import User from '~/server/models/userModel';
import bcrypt from 'bcryptjs';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const { req } = event.node;

  if (req.method === 'POST') {
    try {
      const body = await readBody(event);
      const { userNumber, password } = body;

      // Find the user by userNumber
      const user = await User.findOne({ userNumber });

      if (!user) {
        throw createError({
          statusCode: 404,
          statusMessage: 'User not found',
        });
      }

      // Compare the provided password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Invalid password',
        });
      }

      // If the password is valid, return a success response
      const userData = user.toObject();
      delete userData.password; // Remove sensitive fields

      return {
        status: 200,
        body: {
          success: true,
          message: 'Login successful',
          user: userData,
        },
      };
    } catch (error) {
      console.error('Error processing login:', error);
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || 'Internal Server Error',
      });
    }
  }

  // Method not allowed
  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed',
  });
});
