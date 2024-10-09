import TaskType from '~/server/models/taskTypeModel';
import verifyJwt from '~/server/utils/verifyJwt';

export default defineEventHandler(async (event) => {
  // Apply JWT verification middleware
  await verifyJwt(event);

  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event);

      if (!body.name) {
        return sendError(
          event,
          createError({
            statusCode: 400,
            statusMessage: 'Name is a required field',
          })
        );
      }

      const newTaskType = new TaskType({
        name: body.name,
        description: body.description,
      });

      const savedTaskType = await newTaskType.save();

      return {
        statusCode: 201,
        statusMessage: 'Task type created successfully',
        taskType: savedTaskType,
      };
    } catch (error) {
      console.error('Error creating task type:', error); // Detailed error logging
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while creating the task type',
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
