import Task from '~/server/models/taskModel';
import verifyJwt from '~/server/utils/verifyJwt';

export default defineEventHandler(async (event) => {
  // Apply JWT verification middleware
  await verifyJwt(event);

  if (event.node.req.method === 'GET') {
    try {
      //
      const tasks = await Task.find()
        .populate('chapter')
        .populate('taskType')
        .populate('infopixels');
      return {
        statusCode: 200,
        body: tasks,
      };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while fetching the tasks',
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
