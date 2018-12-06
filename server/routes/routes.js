/* eslint-disable no-console */
import express from 'express';
import authorizeUser from '../middlewares/authorizeUser';
import userHandler from '../controllers/userHandler';
import redFlagHandler from '../controllers/redFlagHandler';

const app = express.Router();
const apiVersion = '/api/v1/';

app
  .route(`${apiVersion}user/create`)
  .post(authorizeUser, userHandler.createUser);

app.route(`${apiVersion}user/login`).post(userHandler.loginUser);

app
  .route(`${apiVersion}red-flags`)
  .get(redFlagHandler.getAllRedFlags)
  .post(redFlagHandler.createRedFlag);

app
  .route(`${apiVersion}red-flags/:id`)
  .get(redFlagHandler.getRedFlagById)
  .delete(redFlagHandler.deleteRedFlag);

app
  .route(`${apiVersion}red-flags/:id/location`)
  .patch(redFlagHandler.editRedFlagLocation);

app
  .route(`${apiVersion}red-flags/:id/comment`)
  .patch(redFlagHandler.editRedFlagComment);

export default app;
