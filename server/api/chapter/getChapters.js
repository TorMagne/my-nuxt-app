import Chapter from '~/server/models/chapterModel';
import verifyJwt from '~/server/utils/verifyJwt';

export default defineEventHandler(async (event) => {
  // Apply JWT verification middleware
  await verifyJwt(event);

  if (event.node.req.method === 'GET') {
    try {
      //
      const chapters = await Chapter.find().populate('book');
      return {
        statusCode: 200,
        body: chapters,
      };
    } catch (error) {
      console.error('Error fetching chapters:', error);
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while fetching the chapters',
          data: error.message,
        })
      );
    }
  } else {
    // Handle other HTTP methods
    return sendError(
      event,
      createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed',
      })
    );
  }
});
