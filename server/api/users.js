import User from '~/server/models/userModel';

export default defineEventHandler(async (event) => {
  const { req } = event.node;

  if (req.method === 'POST') {
    try {
      const body = await readBody(event);
      const { userNumber } = body;

      const user = await User.findOne({ userNumber });

      if (!user) {
        return {
          status: 404,
          body: { message: 'User does not exsist' },
        };
      }

      if (!user.password) {
        return {
          status: 200,
          body: {
            message: 'User found, but password needs to be set',
            needsPassword: true,
            needsLogin: false,
          },
        };
      }

      return {
        status: 200,
        body: { needsPassword: false, needsLogin: true },
      };
    } catch (error) {
      return {
        status: 500,
        body: { message: 'Error processing user number', error },
      };
    }
  }

  if (req.method === 'GET') {
    // get all users
    const users = await User.find().lean(); // Use .lean() to get plain objects
    return {
      status: 200,
      body: users,
    };
  }

  return {
    status: 405,
    body: { message: 'Method Not Allowed' },
  };
});
