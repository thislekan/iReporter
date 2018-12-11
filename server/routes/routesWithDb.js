/* eslint-disable no-console */
import express from 'express';
import userHandler from '../controllers/dbUserHandler';
import dbIncidentHandler from '../controllers/dbIncidentHandler';
import incidentInputValidator from '../middlewares/incidentInputValidator';
import userInputValidator from '../middlewares/userInputValidator';

const app = express.Router();
const apiVersion = '/api/v2/';

app
  .route(`${apiVersion}user/create`)
  .post(
    userInputValidator.validateCreateUserInput,
    userHandler.createUser,
  );

app
  .route(`${apiVersion}user/login`)
  .post(
    userInputValidator.validateLoginUserInput,
    userHandler.loginUser,
  );

app
  .route(`${apiVersion}user/update`)
  .patch(
    userInputValidator.validateUpdateUserInput,
    userHandler.updateUser,
  );

app
  .route(`${apiVersion}incident/create`)
  .post(
    incidentInputValidator.createIncidentQueryValidator,
    dbIncidentHandler.createIncident,
  );

app
  .route(`${apiVersion}incidents`)
  .get(
    incidentInputValidator.getAllIncindentQueryValidator,
    dbIncidentHandler.getAllIncidents,
  );
app
  .route(`${apiVersion}incidents/:type`)
  .get(
    incidentInputValidator.getAllIncindentQueryValidator,
    dbIncidentHandler.getIncidentsByType,
  );
app
  .route(`${apiVersion}incident/:id`)
  .get(
    incidentInputValidator.getSingleIncidentQueryValidator,
    dbIncidentHandler.getSingleIncident,
  );
app
  .route(`${apiVersion}redFlag/comment/:id`)
  .patch(
    incidentInputValidator.editRedFlagCommentQueryValidator,
    dbIncidentHandler.editRedFlagComment,
  );
app
  .route(`${apiVersion}intervention/comment/:id`)
  .patch(
    incidentInputValidator.editInterventionCommentQueryValidator,
    dbIncidentHandler.editInterventionComment,
  );

app
  .route(`${apiVersion}redFlag/location/:id`)
  .patch(
    incidentInputValidator.editRedFlagLocationQuery,
    dbIncidentHandler.editRedFlagLocation,
  );

app
  .route(`${apiVersion}intervention/location/:id`)
  .patch(
    incidentInputValidator.editInterventionLocationQuery,
    dbIncidentHandler.editInterventionLocation,
  );

app
  .route(`${apiVersion}delete/:type/:id`)
  .delete(
    incidentInputValidator.deleteIncidentQueryValidator,
    dbIncidentHandler.deleteIncident,
  );

app
  .route('*')
  .get()
  .post(incidentInputValidator.errorInfo)
  .put(incidentInputValidator.errorInfo)
  .patch(incidentInputValidator.errorInfo)
  .delete(incidentInputValidator.errorInfo);

export default app;
