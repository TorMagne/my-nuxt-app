import TaskType from '~/server/models/taskTypeModel';
import verifyJwt from '~/server/utils/verifyJwt';

export default defineEventHandler(async (event) => {
  // Apply JWT verification middleware
  await verifyJwt(event);

  if (event.node.req.method === 'POST') {
    try {
      const { name, description } = await readBody(event);

      const newTaskType = await TaskType.create({ name, description });

      return {
        statusCode: 201,
        statusMessage: 'Task type created successfully',
        taskType: newTaskType,
      };
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Could not create task type',
        data: error.message,
      });
    }
  }
});
