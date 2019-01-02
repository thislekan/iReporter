/* eslint-disable no-console */
import express from 'express';
import userHandler from '../controllers/dbUserHandler';
import dbIncidentHandler from '../controllers/dbIncidentHandler';
import incidentInputValidator from '../middlewares/incidentInputValidator';
import userInputValidator from '../middlewares/userInputValidator';
import authMiddleware from '../middlewares/authMiddleware';

const app = express.Router();
const apiVersion = '/api/v2/';

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
    incidentInputValidator.createIncidentQueryValidator,
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
