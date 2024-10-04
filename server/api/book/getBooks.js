import Book from '~/server/models/bookModel';

export default defineEventHandler(async (event) => {
  try {
    // Get all books
    const books = await Book.find().lean(); // Use .lean() to get plain objects
    return books;
  } catch (error) {
    return {
      statusCode: 500,
      message: 'An error occurred while retrieving the books',
      error: error.message,
    };
  }
});
