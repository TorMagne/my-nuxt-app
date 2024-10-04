import User from '~/server/models/userModel';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const { req } = event.node;

  if (req.method === 'POST') {
    try {
      const body = await readBody(event);
      const { userNumber, password } = body;

      const user = await User.findOne({ userNumber });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const userData = JSON.parse(JSON.stringify(user));
      delete userData.__v;
      delete userData.password;

      return {
        status: 200,
        body: { message: 'Password set successfully', user: userData },
      };
    } catch (error) {
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
