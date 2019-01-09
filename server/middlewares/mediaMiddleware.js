/* eslint-disable no-console */
export default {
  returnedFiles: (req, res, next) => {
    if (!req.files && !req.file) return next();
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
    res.locals.imageUrl = imageUrl;
    res.locals.videoUrl = videoUrl;
    return next();
  },
};
