import User from '~/server/models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event);
      const { userNumber, password } = body;

      // Find the user by userNumber
      const user = await User.findOne({ userNumber });

      // Check if the user exists
      if (!user) {
        return {
          status: 404,
          body: { message: 'User not found' },
        };
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Get the JWT secret from the config
      const config = useRuntimeConfig();

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, config.JWT_SECRET);

      await user.save();

      const userData = JSON.parse(JSON.stringify(user));
      userData.token = token;
      delete userData.__v;
      delete userData.password;

      return {
        status: 200,
        body: { message: 'Password set successfully', user: userData },
      };
    } catch (error) {
      console.error('Error processing user number:', error);
      return {
        status: 500,
        body: { message: 'Error processing user number', error },
      };
    }
  }

  return {
    status: 405,
    body: { message: 'Method Not Allowed' },
  };
});
