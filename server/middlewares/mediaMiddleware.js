/* eslint-disable no-console */
import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import dotEnv from '../config/config';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || dotEnv.CLOUD_NAME,
  api_key: process.env.API_KEY || dotEnv.API_KEY,
  api_secret: process.env.API_SECRET || dotEnv.API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'svg', 'png', 'jpeg', 'gif', 'avi', 'flv', 'mpeg', '3gp', 'mp4'],
  params: {
    resource_type: 'auto',
    folder: 'iReporter/media',
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
}).any();

const errorMessage = (res, status, message) => {
  res.status(status).send({
    status,
    error: message,
  });
};

export default {
  multerCheck: (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return errorMessage(res, 400, err.message);
      }
      return next();
    });
  },
  returnedFiles: (req, res, next) => {
    if (!req.files.length) return next();
    const imageUrl = [];
    const videoUrl = [];
    req.files.forEach((element) => {
      if (element.mimetype.includes('image')) {
        imageUrl.push(element.secure_url);
      }

      if (element.mimetype.includes('video')) {
        videoUrl.push(element.secure_url);
      }
    });

    if (imageUrl.length > 4) return errorMessage(res, 400, 'maximum of 4 images allowed');
    if (videoUrl.length > 1) return errorMessage(res, 400, 'maximum of 1 video allowed');
    res.locals.imageUrl = imageUrl;
    res.locals.videoUrl = videoUrl;
    return next();
  },
};
