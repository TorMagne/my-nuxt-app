import Chapter from '~/server/models/chapterModel';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
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
