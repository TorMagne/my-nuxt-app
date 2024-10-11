import Task from '~/server/models/taskModel';
import verifyJwt from '~/server/utils/verifyJwt';

export default defineEventHandler(async (event) => {
  // Apply JWT verification middleware
  await verifyJwt(event);

  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event);

      if (!body.name || !body.level) {
        return sendError(
          event,
          createError({
            statusCode: 400,
            statusMessage: 'Name and level are required fields',
          })
        );
      }

      const newTask = new Task({
        name: body.name,
        description: body.description,
        level: body.level,
        image: body.image,
        chapter: body.chapter,
        taskType: body.taskType,
      });

      const savedTask = await newTask.save();

      return {
        statusCode: 201,
        body: savedTask,
        statusMessage: 'Task created successfully',
      };
    } catch (error) {
      console.error('Error creating task:', error); // Detailed error logging
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while creating the task',
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
