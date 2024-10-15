import Infopixel from '~/server/models/infoPixelModel';
import verifyJwt from '~/server/utils/verifyJwt';

export default defineEventHandler(async (event) => {
  // Apply JWT verification middleware
  await verifyJwt(event);

  if (event.node.req.method === 'GET') {
    try {
      const infopixels = await Infopixel.find().lean();
      return {
        statusCode: 200,
        body: infopixels,
      };
    } catch (error) {
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while fetching the infopixels',
          data: error.message,
        })
      );
    }
  }
});
