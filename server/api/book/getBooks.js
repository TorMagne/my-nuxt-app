import Book from '~/server/models/bookModel';
import verifyJwt from '~/server/utils/verifyJwt';

export default defineEventHandler(async (event) => {
  // Apply JWT verification middleware
  await verifyJwt(event);

  if (event.node.req.method === 'GET') {
    try {
      const books = await Book.find().lean();
      return {
        statusCode: 200,
        body: books,
      };
    } catch (error) {
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while fetching the books',
          data: error.message,
        })
      );
    }
  }
});
