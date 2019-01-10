/* eslint-disable no-console */
import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import userHandler from '../controllers/dbUserHandler';
import dbIncidentHandler from '../controllers/dbIncidentHandler';
import incidentInputValidator from '../middlewares/incidentInputValidator';
import userInputValidator from '../middlewares/userInputValidator';
import authMiddleware from '../middlewares/authMiddleware';
import mediaMiddleware from '../middlewares/mediaMiddleware';
import dotEnv from '../config/config';

const app = express.Router();
const apiVersion = '/api/v2/';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || dotEnv.CLOUD_NAME,
  api_key: process.env.API_KEY || dotEnv.API_KEY,
  api_secret: process.env.API_SECRET || dotEnv.API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'iReporter/media',
  allowedFormats: ['jpg', 'svg', 'png', 'jpeg', 'gif', 'avi', 'flv', 'mpeg', '3gp', 'mp4'],
  // allowedFormats: (req, file, cb) => {
  //   if (!file.mimetype.includes('image') && !file.mimetype.includes('vidoe')) {
  //     return cb(new Error(`${file.mimetype} is not supported`));
  //   }
  //   return '';
  // },
});

const upload = multer({
  storage,
  limits: 100000,
});

app
  .route(`${apiVersion}user/create`)
  .post(
    userInputValidator.validateCreateUserInput,
    authMiddleware.hashPassword,
    userHandler.createUser,
  );

app
  .route(`${apiVersion}user/login`)
  .post(
    userInputValidator.validateLoginUserInput,
    authMiddleware.comparePassword,
    userHandler.loginUser,
  );

app
  .route(`${apiVersion}incident/create`)
  .post(
    authMiddleware.validateToken,
    upload.any(),
    incidentInputValidator.createIncidentQueryValidator,
    mediaMiddleware.returnedFiles,
    dbIncidentHandler.createIncident,
  );

app
  .route(`${apiVersion}incidents`)
  .get(dbIncidentHandler.getAllIncidents);

app
  .route(`${apiVersion}user/incidents`)
  .get(
    authMiddleware.validateToken,
    incidentInputValidator.getAllUserIncidentsInputValidator,
    dbIncidentHandler.getAllUserIncidents,
  );
app
  .route(`${apiVersion}incidents/:type`)
  .get(
    authMiddleware.validateToken,
    incidentInputValidator.getUserIncidentsByTypeInputValidator,
    dbIncidentHandler.getIncidentsByType,
  );
app
  .route(`${apiVersion}incident/:id`)
  .get(
    authMiddleware.validateToken,
    incidentInputValidator.getSingleIncidentQueryValidator,
    dbIncidentHandler.getSingleIncident,
  );
app
  .route(`${apiVersion}red-flag/comment/:id`)
  .patch(
    authMiddleware.validateToken,
    incidentInputValidator.editRedFlagCommentQueryValidator,
    dbIncidentHandler.editRedFlagComment,
  );
app
  .route(`${apiVersion}intervention/comment/:id`)
  .patch(
    authMiddleware.validateToken,
    incidentInputValidator.editInterventionCommentQueryValidator,
    dbIncidentHandler.editInterventionComment,
  );

app
  .route(`${apiVersion}red-flag/location/:id`)
  .patch(
    authMiddleware.validateToken,
    incidentInputValidator.editRedFlagLocationQuery,
    dbIncidentHandler.editRedFlagLocation,
  );

app
  .route(`${apiVersion}intervention/location/:id`)
  .patch(
    authMiddleware.validateToken,
    incidentInputValidator.editInterventionLocationQuery,
    dbIncidentHandler.editInterventionLocation,
  );

app
  .route(`${apiVersion}update/status`)
  .patch(
    authMiddleware.validateToken,
    incidentInputValidator.updateIncidentStatusInputValidator,
    dbIncidentHandler.updateIncidentStatus,
  );

app
  .route(`${apiVersion}incident/delete`)
  .delete(
    authMiddleware.validateToken,
    incidentInputValidator.deleteIncidentQueryValidator,
    dbIncidentHandler.deleteIncident,
  );

app
  .route('*')
  .get(incidentInputValidator.errorInfo)
  .post(incidentInputValidator.errorInfo)
  .put(incidentInputValidator.errorInfo)
  .patch(incidentInputValidator.errorInfo)
  .delete(incidentInputValidator.errorInfo);

export default app;
