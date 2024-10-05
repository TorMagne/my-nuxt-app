import jwt from 'jsonwebtoken';
const config = useRuntimeConfig(); // Access runtime configuration

export default defineEventHandler(async (event) => {
  const authHeader = event.node.req.headers['authorization'];

  if (!authHeader) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    event.context.user = decodedToken; // Attach user information to the event context
  } catch (error) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    );
  }
});
