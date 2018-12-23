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

function errorMessage(res, statusCode, message) {
  return res.status(statusCode).send({
    status: statusCode,
    error: message,
  });
}

function checkForValues(values, res, statusCode) {
  const [type, location, title, comment] = values;
  const message = `The following: ${(!type) ? 'type, ' : ''}${(!location) ? 'location, ' : ''}${(!title) ? 'title, ' : ''}${!comment ? 'comment' : ''} are not provided.`;
  return errorMessage(res, statusCode, message);
}

function checkForTrim(values, res, statusCode) {
  const [type, location, title, comment] = values;
  const message = `The following: ${(!type.trim()) ? 'type, ' : ''}${(!location.trim()) ? 'location, ' : ''}${(!title.trim()) ? 'title, ' : ''}${!comment.trim() ? 'comment' : ''} contains just white space.`;
  return errorMessage(res, statusCode, message);
}

function typeOfCheck(values, res, statusCode) {
  const [type, location, title, comment] = values;
  const message = `The following: ${(typeof (type) !== 'string') ? 'type, ' : ''}${(typeof (location) !== 'string') ? 'location, ' : ''}${(typeof (title) !== 'string') ? 'title, ' : ''}${(typeof (comment) !== 'string') ? 'comment' : ''} should all be strings`;
  return errorMessage(res, statusCode, message);
}

function confirmIdValidity(res, id) {
  if (!uuidValidator(id)) return errorMessage(res, 400, 'The record you requested for does not exist');
  return '';
}

function confirmCommentIsNotJustNumbers(res, comment) {
  if (/^\d+$/.test(comment.trim())) return errorMessage(res, 400, 'Comment can not contain just numbers');
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
      return errorMessage(res, 400, 'The incident type selected is not recogized. Please choose either a red-flag or intervention');
    }
    if (status !== 'draft') {
      return errorMessage(res, 400, 'You can\'t create an incident with your selected status.');
    }
    return next();
  },


  getAllUserIncidentsInputValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const user = await userMiddleware.findUser(userid);
    if (user && user.status) return findUserFromDb(res, user);
    return next();
  },

  getUserIncidentsByTypeInputValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { type } = req.params;

    if (type !== 'red-flag' && type !== 'intervention') {
      return errorMessage(res, 400, 'The incident type is not recognized');
    }

    const user = await userMiddleware.findUser(userid);
    if (user && user.status) return findUserFromDb(res, user);
    return next();
  },


  getSingleIncidentQueryValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { id } = req.params;

    if (!uuidValidator(id)) return errorMessage(res, 400, 'The incident id is invalid.');
    const user = await userMiddleware.findUser(userid);
    if (user && user.status) return findUserFromDb(res, user);
    return next();
  },


  editRedFlagCommentQueryValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const { comment } = req.body;

    if (!uuidValidator(id)) return confirmIdValidity(res, id);
    if (!comment) return errorMessage(res, 400, 'The comment field is empty');

    if (typeof (comment) !== 'number' && !comment.trim()) {
      return errorMessage(res, 400, 'You can not post an empty comment');
    }

    if (typeof (comment) !== 'string') return errorMessage(res, 400, 'Only strings allowed for comment');

    if (/^\d+$/.test(comment)) return confirmCommentIsNotJustNumbers(res, comment);

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows } = await dbHelper.query(text, [id]);

    if (rows[0].createdBy !== userid) return errorMessage(res, 401, 'The record was not created by this user');

    if (rows[0].type !== 'red-flag') return errorMessage(res, 401, 'The record you requested is not a red flag');

    if (rows[0].status !== 'draft') return errorMessage(res, 400, `The ${rows[0].status} record can not be updated`);

    return next();
  },


  editInterventionCommentQueryValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const { comment } = req.body;

    if (!uuidValidator(id)) return confirmIdValidity(res, id);
    if (!comment) return errorMessage(res, 400, 'The comment field is empty');

    if (typeof (comment) !== 'number' && !comment.trim()) {
      return errorMessage(res, 400, 'You can not post an empty comment');
    }
    if (typeof (comment) !== 'string') return errorMessage(res, 400, 'Only strings allowed for comment');

    if (/^\d+$/.test(comment)) return confirmCommentIsNotJustNumbers(res, comment);


    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows } = await dbHelper.query(text, [id]);

    if (rows[0].createdBy !== userid) return errorMessage(res, 401, 'The record was not created by this user');

    if (rows[0].type !== 'intervention') return errorMessage(res, 401, 'The record you requested is not an intervention');

    if (rows[0].status !== 'draft') return errorMessage(res, 400, `The ${rows[0].status} record can not be updated`);

    return next();
  },


  editInterventionLocationQuery: async (req, res, next) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const { location } = req.body;

    if (!uuidValidator(id)) return confirmIdValidity(res, id);

    if (!location) return errorMessage(res, 400, 'The location field is missing');
    if (typeof (location) !== 'string') return errorMessage(res, 400, 'Location can only be a string');
    if (!location.trim()) return errorMessage(res, 400, 'You can not post an empty location');

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows } = await dbHelper.query(text, [id]);

    if (rows[0].createdBy !== userid) {
      return errorMessage(res, 401, 'The record was not created by this user');
    }

    if (rows[0].type !== 'intervention') {
      return errorMessage(res, 401, 'The record you requested is not an intervention');
    }

    if (rows[0].status !== 'draft') {
      return errorMessage(res, 400, `The ${rows[0].status} record can not be updated`);
    }

    return next();
  },


  editRedFlagLocationQuery: async (req, res, next) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const { location } = req.body;

    if (!uuidValidator(id)) return confirmIdValidity(res, id);
    if (!location) return errorMessage(res, 400, 'The location field is missing');

    if (typeof (location) !== 'string') return errorMessage(res, 400, 'Location can only be a string');
    if (!location.trim()) return errorMessage(res, 400, 'You can not post an empty location');

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows } = await dbHelper.query(text, [id]);

    if (rows[0].createdBy !== userid) {
      return errorMessage(res, 401, 'The record was not created by this user');
    }

    if (rows[0].type !== 'red-flag') {
      return errorMessage(res, 401, 'The record you requested is not a red flag');
    }

    if (rows[0].status !== 'draft') {
      return errorMessage(res, 400, `The ${rows[0].status} record can not be updated`);
    }

    return next();
  },


  updateIncidentStatusInputValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { status, id } = req.body;

    if (!status) return errorMessage(res, 400, 'The status is not provided');
    if (!id) return errorMessage(res, 400, 'The id is not provided');
    if (!uuidValidator(id)) return confirmIdValidity(res, id);
    if (typeof (status) !== 'string') return errorMessage(res, 400, 'Status needs to be a string');
    if (!status.trim()) return errorMessage(res, 400, 'Status can not be empty.');

    const user = await userMiddleware.findUser(userid);
    if (user && !user.status) {
      if (!user.isAdmin) {
        return errorMessage(res, 401, 'Unauthorized request.');
      }
    }
    if (status === 'draft') return errorMessage(res, 400, 'The incident status can not be draft');
    if (status !== 'under-investigation' && status !== 'rejected' && status !== 'resolved') {
      return errorMessage(res, 400, 'The selected status is not recognized.');
    }
    return next();
  },


  deleteIncidentQueryValidator: async (req, res, next) => {
    const { userid } = res.locals;
    const { id, type } = req.body;

    if (!id) return errorMessage(res, 400, 'The incident id is not provided');
    if (!type) return errorMessage(res, 400, 'The incident type is not provided');
    if (typeof (type) !== 'string') return errorMessage(res, 400, 'The incident type can only be a string');
    if (!type.trim()) return errorMessage(res, 400, 'The incident type can not be empty');
    if (!uuidValidator(id)) return confirmIdValidity(res, id);

    if (type !== 'red-flag' && type !== 'intervention') return errorMessage(res, 400, `No ${type} record found`);

    const user = await userMiddleware.findUser(userid);
    if (user && user.status) return findUserFromDb(res, user);

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows, rowCount } = await dbHelper.query(text, [id]);

    if (!rowCount) return errorMessage(res, 404, 'This record does not exist');

    if (rows[0].createdBy !== userid) return errorMessage(res, 403, 'You do not have access to delete the record you requested');

    if (rows[0].type !== type) return errorMessage(res, 409, `Record requested is a ${rows[0].type} and not a ${type}`);

    if (rows[0].status !== 'draft') return errorMessage(res, 400, 'The requested record can not be deleted');
    return next();
  },

  errorInfo: (req, res) => {
    res.status(404).send({
      status: 404,
      error: 'Page not found.',
    });
  },
};
