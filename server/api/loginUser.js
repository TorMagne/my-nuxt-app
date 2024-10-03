import User from '~/server/models/userModel';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const { req } = event.node;

  if (req.method === 'POST') {
    try {
      const body = await readBody(event);
      const { userNumber, password } = body;

      // Find the user by userNumber
      const user = await User.findOne({ userNumber });

      if (!user) {
        return {
          status: 404,
          body: { message: 'User not found' },
        };
      }

      // Compare the provided password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return {
          status: 401,
          body: { message: 'Invalid password' },
        };
      }

      // If the password is valid, return a success response
      return {
        status: 200,
        body: { message: 'Login successful', user },
      };
    } catch (error) {
      return {
        status: 500,
        body: { message: 'Error processing login', error },
      };
    }
  }

  return {
    status: 405,
    body: { message: 'Method Not Allowed' },
  };
});
