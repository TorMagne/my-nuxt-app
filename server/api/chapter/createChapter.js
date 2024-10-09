import Chapter from '~/server/models/chapterModel';
import verifyJwt from '~/server/utils/verifyJwt';

export default defineEventHandler(async (event) => {
  // Apply JWT verification middleware
  await verifyJwt(event);

  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event);

      if (!body.book || !body.name) {
        return sendError(
          event,
          createError({
            statusCode: 400,
            statusMessage: 'Book and name are required fields',
          })
        );
      }

      const newChapter = new Chapter({
        book: body.book,
        name: body.name,
        level: body.level,
        description: body.description,
      });

      const savedChapter = await newChapter.save();

      return {
        statusCode: 201,
        body: savedChapter,
        statusMessage: 'Chapter created successfully',
      };
    } catch (error) {
      console.error('Error creating chapter:', error); // Detailed error logging
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while creating the chapter',
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
