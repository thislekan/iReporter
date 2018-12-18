/* eslint-disable no-console */
import uuidValidator from 'uuid-validate';
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

function checkForValues(values, res, statusCode) {
  const [type, location, title, comment] = values;
  const message = `The following: ${(!type) ? 'type, ' : ''}${(!location) ? 'location, ' : ''}${(!title) ? 'title, ' : ''}${!comment ? 'comment' : ''} are not provided.`;
  return responseMessage(res, statusCode, message);
}

function checkForTrim(values, res, statusCode) {
  const [type, location, title, comment] = values;
  const message = `The following: ${(!type.trim()) ? 'type, ' : ''}${(!location.trim()) ? 'location, ' : ''}${(!title.trim()) ? 'title, ' : ''}${!comment.trim() ? 'comment' : ''} contains just white space.`;
  return responseMessage(res, statusCode, message);
}

function typeOfCheck(values, res, statusCode) {
  const [type, location, title, comment] = values;
  const message = `The following: ${(typeof (type) !== 'string') ? 'type, ' : ''}${(typeof (location) !== 'string') ? 'location, ' : ''}${(typeof (title) !== 'string') ? 'title, ' : ''}${(typeof (comment) !== 'string') ? 'comment' : ''} should all be strings`;
  return responseMessage(res, statusCode, message);
}

function confirmIdValidity(res, id) {
  if (!uuidValidator(id)) return responseMessage(res, 400, 'The record you requested for does not exist');
  return id;
}

function confirmCommentIsNotJustNumbers(res, comment) {
  if (/^\d+$/.test(comment.trim())) return responseMessage(res, 400, 'Comment can not contain just numbers');
  return '';
}

export default {
  createIncidentQueryValidator: (req, res, next) => {
    const {
      type, status = 'draft', location, title, comment,
    } = req.body;

    const inputValues = [type, location, title, comment];
    if (!type || !location || !title || !comment) return checkForValues(inputValues, res, 400);

    if (typeof (type) !== 'string' || typeof (location) !== 'string' || typeof (title) !== 'string' || typeof (comment) !== 'string') {
      return typeOfCheck(inputValues, res, 400);
    }

    if (!type.trim() || !location.trim() || !title.trim() || !comment.trim()) {
      return checkForTrim(inputValues, res, 400);
    }

    if (/^\d+$/.test(comment.trim())) return confirmCommentIsNotJustNumbers(res, comment);

    if (type !== 'red-flag' && type !== 'intervention') {
      return responseMessage(res, 400, 'The incident type selected is not recogized. Please choose either a red-flag or intervention');
    }
    if (status !== 'draft') {
      return responseMessage(res, 400, 'You can\'t create an incident with your selected status.');
    }
    return next();
  },


  getAllUserIncidentsInputValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const user = await userMiddleware.findUser(userid);
    if (user.status) return findUserFromDb(res, user);
    return next();
  },

  getUserIncidentsByTypeInputValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { type } = req.params;

    if (!type) return responseMessage(res, 400, 'The incident type is not included.');
    if (!type.trim()) return responseMessage(res, 400, 'The incident type can not be empty');
    if (typeof (type) !== 'string') return responseMessage(res, 400, 'The incident type is not a string');
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

    if (!id) return responseMessage(res, 400, 'The incident id is not prrovided.');
    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    return next();
  },


  editRedFlagCommentQueryValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const { comment } = req.body;

    confirmIdValidity(res, id);

    if (!comment) return responseMessage(res, 400, 'One or more required fields are empty');
    confirmUserId(res, userid);

    if (!comment.trim()) return responseMessage(res, 400, 'You can not post an empty comment');
    typeOfCheck(comment, res, 400, 'One or more fields contain an unsupported type');
    confirmCommentIsNotJustNumbers(res, comment);

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

    confirmIdValidity(res, id);
    confirmUserId(res, userid);

    if (!comment) return responseMessage(res, 400, 'One or more required fields missing');
    if (!comment.trim()) return responseMessage(res, 400, 'You can not post an empty comment');
    typeOfCheck(comment, res, 400, 'One or more fields contain an unsupported type');
    confirmCommentIsNotJustNumbers(res, comment);


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

    confirmIdValidity(res, id);
    confirmUserId(res, userid);

    if (!location) {
      return responseMessage(res, 400, 'One or more required fields missing');
    }
    if (!location.trim()) {
      return responseMessage(res, 400, 'You can not post an empty comment');
    }
    typeOfCheck(location, res, 400, 'One or more fields contain an unsupported type');

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

    confirmIdValidity(res, id);
    confirmUserId(res, userid);

    if (!location) {
      return responseMessage(res, 400, 'One or more required fields missing');
    }
    if (!location.trim()) {
      return responseMessage(res, 400, 'You can not post an empty comment');
    }
    typeOfCheck(location, res, 400, 'One or more required fields contains unsuppported format');

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

    confirmIdValidity(res, id);
    checkForTrim(status, res, 400, 'One or more required fields are empty');
    typeOfCheck(status, res, 400, 'One or more required fields format is unsupported');

    const user = await userMiddleware.findUser(userid);
    if (user && !user.status) {
      if (!user.isadmin) {
        return responseMessage(res, 401, 'Unauthorized request.');
      }
    }
    if (status === 'draft') return responseMessage(res, 401, 'incident status can not be draft');
    if (status !== 'under-investigation' && status !== 'rejected' && status !== 'resolved') {
      return responseMessage(res, 400, 'The selected status is not recognized.');
    }
    return next();
  },


  deleteIncidentQueryValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { id, type } = req.body;

    if (!type || !id) return responseMessage(res, 400, 'One or more required fields empty');
    if (!type.trim()) return responseMessage(res, 400, 'One or more required fields empty');
    confirmIdValidity(res, id);

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

    if (rows[0].createdby !== userid) return responseMessage(res, 403, 'You do not have access to delete the record you requested');

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
