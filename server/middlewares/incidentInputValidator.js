/* eslint-disable no-console */
import userMiddleware from './userMiddleware';
import dbMiddleware from '../models/dbMiddleware';


const findUserFromDb = (res, user) => {
  if (user.status === 401) {
    return res.status(401).send(user);
  }
  console.log('confirmed');
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

export default {
  createIncidentQueryValidator: (req, res, next) => {
    const {
      type,
      status = 'draft',
      location,
    } = req.body;


    if (!type) {
      return res.status(400).send({
        status: 400,
        error: 'The type of Incident you wish to report is unknown. Please select a type.',
      });
    }
    if (type !== 'red-flag' && type !== 'intervention') {
      return res.status(400).send({
        status: 400,
        error: 'The incident type selected is not recogized. Please choose either a red-flag or intervention',
      });
    }
    if (!location) {
      return res.status(400).send({
        status: 400,
        error: 'No location was selected. Please retry by entering your location.',
      });
    }
    if (status !== 'draft') {
      return res.status(403).send({
        status: 403,
        error: 'You can\'t create an incident with your selected status.',
      });
    }

    return next();
  },
  getAllIncindentQueryValidator: async (req, res, next) => {
    const { userid } = req.headers;
    const { type } = req.params;

    confirmUserId(res, userid);

    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    if (!user.isAdmin && !type) {
      return res.status(400).send({
        status: 400,
        error: 'You haven\'t specified the type of report you want. Please select a type.',
      });
    }

    if (type !== 'intervention' && type !== 'red-flag') {
      return res.status(400).send({
        status: 400,
        error: 'No record of the requested type exist.',
      });
    }
    console.log('fired next');
    return next();
  },
  getSingleIncidentQueryValidator: async (req, res, next) => {
    const { userid } = req.headers;
    const { id } = req.params;

    confirmUserId(res, userid);

    if (!id) {
      return res.status(400).send({
        status: 400,
        error: 'The incident id is not provided.',
      });
    }
    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    return next();
  },
  editRedFlagCommentQueryValidator: async (req, res, next) => {
    const { userid } = req.headers;
    const { id } = req.params;
    const { comment } = req.body;

    confirmUserId(res, userid);

    if (!comment) {
      return res.status(400).send({
        status: 400,
        error: 'You can not post an empty comment.',
      });
    }

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows } = await dbMiddleware.query(text, [id]);

    if (rows[0].type !== 'red-flag') {
      return res.status(401).send({
        status: 401,
        error: 'The record you requested is not a red flag.',
      });
    }

    if (rows[0].status !== 'draft') {
      return res.status(401).send({
        status: 401,
        error: `The record you requested is already ${rows[0].status}. It can not be updated.`,
      });
    }

    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    return next();
  },
  editInterventionCommentQueryValidator: async (req, res, next) => {
    const { userid } = req.headers;
    const { id } = req.params;
    const { comment } = req.body;

    confirmUserId(res, userid);

    if (!comment) {
      return res.status(400).send({
        status: 400,
        error: 'You can not post an empty comment.',
      });
    }

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows } = await dbMiddleware.query(text, [id]);

    if (rows[0].type !== 'intervention') {
      return res.status(401).send({
        status: 401,
        error: 'The record you requested is not an intervention.',
      });
    }

    if (rows[0].status !== 'draft') {
      return res.status(401).send({
        status: 401,
        error: `The record you requested is already ${rows[0].status}. It can not be updated.`,
      });
    }

    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    return next();
  },
  editInterventionLocationQuery: async (req, res, next) => {
    const { userid } = req.headers;
    const { id } = req.params;
    const { location } = req.body;

    confirmUserId(res, userid);

    if (!location) {
      return res.status(400).send({
        status: 400,
        error: 'You can not post an empty comment.',
      });
    }

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows } = await dbMiddleware.query(text, [id]);

    if (rows[0].type !== 'intervention') {
      return res.status(401).send({
        status: 401,
        error: 'The record you requested is not an intervention.',
      });
    }

    if (rows[0].status !== 'draft') {
      return res.status(401).send({
        status: 401,
        error: `The record you requested is already ${rows[0].status}. It can not be updated.`,
      });
    }

    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    return next();
  },
  editRedFlagLocationQuery: async (req, res, next) => {
    const { userid } = req.headers;
    const { id } = req.params;
    const { location } = req.body;

    confirmUserId(res, userid);

    if (!location) {
      return res.status(400).send({
        status: 400,
        error: 'You can not post an empty comment.',
      });
    }

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows } = await dbMiddleware.query(text, [id]);

    if (rows[0].type !== 'red-flag') {
      return res.status(401).send({
        status: 401,
        error: 'The record you requested is not a red flag.',
      });
    }

    if (rows[0].status !== 'draft') {
      return res.status(401).send({
        status: 401,
        error: `The record you requested is already ${rows[0].status}. It can not be updated.`,
      });
    }

    const user = await userMiddleware.findUser(userid);
    findUserFromDb(res, user);
    return next();
  },
  deleteIncidentQueryValidator: async (req, res, next) => {
    const { userid } = req.headers;
    const { id, type } = req.params;

    if (type !== 'red-flag' && type !== 'intervention') {
      return res.status(400).send({
        status: 400,
        error: `No ${type} record found.`,
      });
    }

    confirmUserId(res, userid);

    const user = await userMiddleware.findUser(userid);
    console.log(user);
    findUserFromDb(res, user);

    const text = 'SELECT * FROM incidents WHERE id = $1';
    const { rows, rowCount } = await dbMiddleware.query(text, [id]);

    if (!rowCount) {
      return res.status(404).send({
        status: 404,
        error: 'This record does not exist.',
      });
    }

    if (rows[0].createdby !== userid) {
      console.log(user);
      return res.status(403).send({
        status: 403,
        error: 'You do not have access to the record you requested.',
      });
    }

    if (rows[0].type !== type) {
      return res.status(409).send({
        status: 409,
        error: `The record you requested is a ${rows[0].type} and not a ${type}`,
      });
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
