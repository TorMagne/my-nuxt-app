import Infopixel from '~/server/models/infoPixelModel';
import verifyJwt from '~/server/utils/verifyJwt';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  // Apply JWT verification middleware
  await verifyJwt(event);

  if (event.node.req.method === 'POST') {
    try {
      const form = formidable({ multiples: false });

      // Parse the incoming form data
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      // Handle the uploaded image
      let imagePath = '';
      if (files.image) {
        let imageFile = files.image;

        // Check if imageFile is an array
        if (Array.isArray(imageFile)) {
          imageFile = imageFile[0];
        }

        // Now imageFile is the actual file object
        console.log('Uploaded File:', imageFile);
        console.log('Detected MIME Type:', imageFile.mimetype);

        // Validate the MIME type
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

        // Validate the file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (imageFile.size > maxSize) {
          return sendError(
            event,
            createError({
              statusCode: 400,
              statusMessage: 'File too large. Max size is 5MB.',
            })
          );
        }

        // Create the images directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'infopixelImages');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate a unique filename
        const fileName = `${Date.now()}-${imageFile.originalFilename}`;
        const newFilePath = path.join(uploadDir, fileName);

        // Move the file from temp path to the images directory
        fs.copyFileSync(imageFile.filepath, newFilePath);

        // Set the image path relative to the public directory
        imagePath = `/infopixelImages/${fileName}`;
      }

      // Log fields before adjustment
      console.log('Fields before adjustment:', fields);
      console.log('Image Path:', imagePath);

      // Ensure that fields are strings
      for (const key in fields) {
        if (Array.isArray(fields[key])) {
          fields[key] = fields[key][0];
        }
      }

      // Log fields after adjustment
      console.log('Fields after adjustment:', fields);

      // Create a new Infopixel with the adjusted fields
      const newInfoPixel = new Infopixel({
        ...fields,
        image: imagePath,
      });

      const savedInfoPixel = await newInfoPixel.save();

      return {
        statusCode: 201,
        body: savedInfoPixel,
        statusMessage: 'Infopixel created successfully',
      };
    } catch (error) {
      console.error('Error creating infopixel:', error); // Detailed error logging
      return sendError(
        event,
        createError({
          statusCode: 500,
          statusMessage: 'An error occurred while creating the infopixel',
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
