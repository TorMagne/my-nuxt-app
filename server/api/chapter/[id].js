import Chapter from '~/server/models/chapterModel';
import verifyJwt from '~/server/utils/verifyJwt';

export default defineEventHandler(async (event) => {
  await verifyJwt(event);

  const id = event.context.params.id;

  if (event.node.req.method === 'PUT') {
    try {
      const body = await readBody(event);
      const { book, name, description } = body;

      if (!name) {
        return sendError(
          event,
          createError({
            statusCode: 400,
            statusMessage: 'Name is a required field',
          })
        );
      }

      const updatedChapter = await Chapter.findByIdAndUpdate(
        id,
        { book, name, description },
        { new: true, runValidators: true }
      );

      if (!updatedChapter) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Chapter not found',
        });
      }

      return {
        message: 'Chapter updated successfully',
        chapter: updatedChapter,
      };
    } catch (error) {
      console.error('Error updating chapter:', error);
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while updating the chapter',
          data: error.message,
        })
      );
    }
  } else if (event.node.req.method === 'DELETE') {
    try {
      const deletedChapter = await Chapter.findByIdAndDelete(id);

      if (!deletedChapter) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Chapter not found',
        });
      }

      return {
        message: 'Chapter deleted successfully',
        chapter: deletedChapter,
      };
    } catch (error) {
      console.error('Error deleting chapter:', error);
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while deleting the chapter',
          data: error.message,
        })
      );
    }
  } else {
    return sendError(
      event,
      createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed',
      })
    );
  }
});
