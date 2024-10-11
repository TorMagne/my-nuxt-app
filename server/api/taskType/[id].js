import TaskType from '~/server/models/taskTypeModel';
import verifyJwt from '~/server/utils/verifyJwt';

export default defineEventHandler(async (event) => {
  await verifyJwt(event);

  const id = event.context.params.id;

  if (event.node.req.method === 'PUT') {
    try {
      const body = await readBody(event);
      const { name, description } = body;

      if (!name) {
        return sendError(
          event,
          createError({
            statusCode: 400,
            statusMessage: 'Name is a required field',
          })
        );
      }

      const updatedTaskType = await TaskType.findByIdAndUpdate(
        id,
        { name, description },
        { new: true, runValidators: true }
      );

      if (!updatedTaskType) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Task type not found',
        });
      }

      return {
        message: 'Task type updated successfully',
        taskType: updatedTaskType,
      };
    } catch (error) {
      console.error('Error updating task type:', error);
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while updating the task type',
          data: error.message,
        })
      );
    }
  } else if (event.node.req.method === 'DELETE') {
    try {
      const deletedTaskType = await TaskType.findByIdAndDelete(id);

      if (!deletedTaskType) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Task type not found',
        });
      }

      return {
        message: 'Task type deleted successfully',
        taskType: deletedTaskType,
      };
    } catch (error) {
      console.error('Error deleting task type:', error);
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while deleting the task type',
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
