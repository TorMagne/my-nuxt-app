import User from '~/server/models/userModel';
import verifyJwt from '~/server/utils/verifyJwt';

export default defineEventHandler(async (event) => {
  // Verifiser JWT
  await verifyJwt(event);

  if (event.node.req.method === 'PUT') {
    try {
      const id = event.context.params.id;
      const { userNumber, group, role } = await readBody(event);

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { userNumber, group, role },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw createError({
          statusCode: 404,
          statusMessage: 'User not found',
        });
      }

      return {
        statusCode: 200,
        statusMessage: 'User updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Could not update user',
        data: error.message,
      });
    }
  }
});
