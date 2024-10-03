import User from '~/server/models/userModel';

export default defineEventHandler(async (event) => {
  const { req } = event.node;

  if (req.method === 'POST') {
    try {
      const body = await readBody(event);
      const { userNumber, password } = body;

      const user = await User.findOne({ userNumber });

      user.password = password;
      await user.save();

      return {
        status: 200,
        body: { message: 'Password set successfully', user },
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
