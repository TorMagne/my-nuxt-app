import User from '~/server/models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(); // Access runtime configuration

  if (event.node.req.method === 'POST') {
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

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, config.JWT_SECRET);

      console.log('TOKEN:', token);

      // If the password is valid, return a success response with the token
      const userData = JSON.parse(JSON.stringify(user));
      userData.token = token;
      delete userData.__v;
      delete userData.password;

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
