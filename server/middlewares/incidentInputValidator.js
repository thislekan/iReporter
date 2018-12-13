/* eslint-disable no-console */
import validator from 'validator';
import userMiddleware from './userMiddleware';
import dbHelper from '../models/dbHelper';


const findUserFromDb = (res, user) => {
  if (user.status === 401) {
    return res.status(401).send(user);
  }
  return user;
};

const confirmUserId = (res, userid) => {
  if (!userid) {
    return res.status(400).send({
      status: 400,
      error: 'No user ID found.',
    });
  }
  return userid;
};

function responseMessage(res, statusCode, message) {
  return res.status(statusCode).send({
    status: statusCode,
    error: message,
  });
}

export default {
  createIncidentQueryValidator: (req, res, next) => {
    const {
      type,
      status = 'draft',
      location,
    } = req.body;


    if (!type || !location) {
      return responseMessage(res, 400, 'One or two required fields missing.');
    }
    if (type !== 'red-flag' && type !== 'intervention') {
      return responseMessage(res, 400, 'The incident type selected is not recogized. Please choose either a red-flag or intervention');
    }
    if (status !== 'draft') {
      return res.status(403).send({
        status: 403,
        error: 'You can\'t create an incident with your selected status.',
      });
    }

    return next();
  },


  getAllUserIncidentsInputValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    return next();
  },

  getUserIncidentsByTypeInputValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { type } = req.params;
    if (!type) {
      return responseMessage(res, 400, 'The incident type is not included.');
    }
    if (type !== 'red-flag' && type !== 'intervention') {
      return responseMessage(res, 400, 'The incident type is not recognized');
    }
    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    return next();
  },


  getSingleIncidentQueryValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { id } = req.params;

    confirmUserId(res, userid);

    if (!id) {
      return responseMessage(res, 400, 'The incident id is not prrovided.');
    }
    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    return next();
  },


  editRedFlagCommentQueryValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const { comment } = req.body;

    confirmUserId(res, userid);

    if (!comment.trim()) {
      return responseMessage(res, 400, 'You can not post an empty comment');
    }

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows } = await dbHelper.query(text, [id]);

    if (rows[0].type !== 'red-flag') {
      return responseMessage(res, 401, 'The record you requested is not a red flag');
    }

    if (rows[0].status !== 'draft') {
      return responseMessage(res, 401, `Records of ${rows[0].status} can not be updated`);
    }

    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    return next();
  },


  editInterventionCommentQueryValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const { comment } = req.body;

    confirmUserId(res, userid);

    if (!comment) {
      return responseMessage(res, 400, 'One or more required fields missing');
    }
    if (!comment.trim()) {
      return responseMessage(res, 400, 'You can not post an empty comment');
    }

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows } = await dbHelper.query(text, [id]);

    if (rows[0].type !== 'intervention') {
      return responseMessage(res, 401, 'The record you requested is not an intervention');
    }

    if (rows[0].status !== 'draft') {
      return responseMessage(res, 401, `Records of ${rows[0].status} can not be updated`);
    }

    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    return next();
  },


  editInterventionLocationQuery: async (req, res, next) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const { location } = req.body;

    confirmUserId(res, userid);

    if (!location) {
      return responseMessage(res, 400, 'One or more required fields missing');
    }
    if (!location.trim()) {
      return responseMessage(res, 400, 'You can not post an empty comment');
    }

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows } = await dbHelper.query(text, [id]);

    if (rows[0].type !== 'intervention') {
      return responseMessage(res, 401, 'The record you requested is not an intervention');
    }

    if (rows[0].status !== 'draft') {
      return responseMessage(res, 401, `Records of ${rows[0].status} can not be updated`);
    }

    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    return next();
  },


  editRedFlagLocationQuery: async (req, res, next) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const { location } = req.body;

    confirmUserId(res, userid);

    if (!location) {
      return responseMessage(res, 400, 'One or more required fields missing');
    }
    if (!location.trim()) {
      return responseMessage(res, 400, 'You can not post an empty comment');
    }

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows } = await dbHelper.query(text, [id]);

    if (rows[0].type !== 'red-flag') {
      return responseMessage(res, 401, 'The record you requested is not a red flag');
    }

    if (rows[0].status !== 'draft') {
      return responseMessage(res, 401, `Records of ${rows[0].status} can not be updated`);
    }

    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    return next();
  },


  updateIncidentStatusInputValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { status, id } = req.body;
    if (!status || !id) {
      return responseMessage(res, 400, 'One or more required field missing');
    }
    if (validator.isEmpty(status, { ignore_whitespace: true })) {
      return responseMessage(res, 400, 'white spaces are not allowed.');
    }
    const user = await userMiddleware.findUser(userid);
    if (user && !user.status) {
      if (!user.isadmin) {
        return responseMessage(res, 401, 'Unauthorized request.');
      }
    }
    if (status === 'draft') {
      return responseMessage(res, 401, 'incident status can not be draft');
    }
    return next();
  },


  deleteIncidentQueryValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { id, type } = req.body;

    if (type !== 'red-flag' && type !== 'intervention') {
      return responseMessage(res, 400, `No ${type} record found`);
    }

    confirmUserId(res, userid);

    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows, rowCount } = await dbHelper.query(text, [id]);

    if (!rowCount) {
      return responseMessage(res, 404, 'This record does not exist');
    }

    if (rows[0].createdby !== userid) {
      return responseMessage(res, 403, 'You do not have access to the record you requested');
    }

    if (rows[0].type !== type) {
      return responseMessage(res, 409, `Record requested is a ${rows[0].type} and not a ${type}`);
    }
    return next();
  },


  errorInfo: (req, res) => {
    res.status(404).send({
      status: 404,
      error: 'Page not found.',
    });
  },
};
