import Book from '~/server/models/bookModel';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  if (method === 'GET') {
    try {
      const books = await Book.find().lean();
      return books;
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
