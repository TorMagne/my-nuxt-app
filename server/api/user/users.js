import User from '~/server/models/userModel';
import verifyJwt from '~/server/utils/verifyJwt';

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event);
      const { userNumber } = body;

      const user = await User.findOne({ userNumber });

      if (!user) {
        return sendError(
          event,
          createError({
            statusCode: 404,
            statusMessage: 'User does not exist',
          })
        );
      }

      if (!user.password) {
        return {
          statusCode: 200,
          body: {
            message: 'User found, but password needs to be set',
            needsPassword: true,
            needsLogin: false,
          },
        };
      }

      return {
        statusCode: 200,
        body: { needsPassword: false, needsLogin: true },
      };
    } catch (error) {
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'Error processing user number',
          data: error.message,
        })
      );
    }
  }

  if (event.node.req.method === 'GET') {
    try {
      // Apply JWT verification middleware
      await verifyJwt(event);

      // Get all users
      const users = await User.find().lean(); // Use .lean() to get plain objects
      return {
        statusCode: 200,
        body: users,
      };
    } catch (error) {
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while fetching the users',
          data: error.message,
        })
      );
    }
  }

  return sendError(
    event,
    createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    })
  );
});
