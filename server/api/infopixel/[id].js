import Infopixel from '~/server/models/infoPixelModel';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import verifyJwt from '~/server/utils/verifyJwt';

export default defineEventHandler(async (event) => {
  // Verify JWT
  await verifyJwt(event);

  const id = event.context.params.id;

  if (event.node.req.method === 'PUT') {
    try {
      const form = formidable({ multiples: false });

      // Parse incoming form data
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      // Handle uploaded image
      let imagePath = undefined;
      if (files.image) {
        let imageFile = files.image;
        if (Array.isArray(imageFile)) {
          imageFile = imageFile[0];
        }

        // Validate MIME type
        const mimeType = imageFile.mimetype || imageFile.type;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(mimeType)) {
          return sendError(
            event,
            createError({
              statusCode: 400,
              statusMessage: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
            })
          );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (imageFile.size > maxSize) {
          return sendError(
            event,
            createError({
              statusCode: 400,
              statusMessage: 'File is too large. Maximum size is 5MB.',
            })
          );
        }

        // Create image directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'infopixelImages');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const fileName = `${Date.now()}-${imageFile.originalFilename}`;
        const newFilePath = path.join(uploadDir, fileName);

        // Move file from temp path to image directory
        fs.copyFileSync(imageFile.filepath, newFilePath);

        // Set image path relative to public directory
        imagePath = `/infopixelImages/${fileName}`;
      }

      // Ensure fields are strings
      for (const key in fields) {
        if (Array.isArray(fields[key])) {
          fields[key] = fields[key][0];
        }
      }

      // Update the infopixel
      const updateData = {
        name: fields.name,
        medicalname: fields.medicalname,
        description: fields.description,
        hint: fields.hint,
        level: fields.level,
      };
      if (imagePath) {
        updateData.image = imagePath;
      }

      const updatedInfopixel = await Infopixel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedInfopixel) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Infopixel not found',
        });
      }

      return {
        message: 'Infopixel updated successfully',
        infopixel: updatedInfopixel,
      };
    } catch (error) {
      console.error('Error updating infopixel:', error);
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while updating the infopixel',
          data: error.message,
        })
      );
    }
  } else if (event.node.req.method === 'DELETE') {
    try {
      const deletedInfopixel = await Infopixel.findByIdAndDelete(id);

      if (!deletedInfopixel) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Infopixel not found',
        });
      }

      // Delete the image file if it exists
      if (deletedInfopixel.image) {
        const imagePath = path.join(process.cwd(), 'public', deletedInfopixel.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      return {
        message: 'Infopixel deleted successfully',
        infopixel: deletedInfopixel,
      };
    } catch (error) {
      console.error('Error deleting infopixel:', error);
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while deleting the infopixel',
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
