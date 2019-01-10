/* eslint-disable no-console */
const errorMessage = (res, status, message) => {
  res.status(status).send({
    status,
    error: message,
  });
};

function fileCheck(res, files) {
  files.forEach((element) => {
    if (!element.mimetype.includes('video') && !element.mimetype.includes('image')) {
      errorMessage(res, 400, `${element.mimetype} format not supported.`);
    }
  });
}

export default {
  returnedFiles: (req, res, next) => {
    if (!req.files && !req.files[0]) return next();
    if (req.files.length) return fileCheck(res, req.files);
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
