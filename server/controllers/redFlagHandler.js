/* eslint-disable no-console */
import store from '../db/store';
import idGenerator from '../middlewares/idGenerator';

class RedFlag {
  constructor(id, createdBy, type, status, Images, Videos, comment, location) {
    this.id = id;
    this.createdBy = createdBy;
    this.type = type;
    this.status = status;
    this.Images = Images;
    this.Videos = Videos;
    this.comment = comment;
    this.location = location;
    // this.createdOn = new Date();
  }
}

export default {
  createRedFlag: (req, res) => {
    const { body, headers } = req;
    const { userid } = headers;
    const {
      type, status, Images, Videos, comment, location,
    } = body;

    const incidentId = parseInt(idGenerator(), 10);
    const createdRedFlag = new RedFlag(
      incidentId, parseInt(userid, 10), type, status, Images, Videos, comment, location,
    );
    const foundUser = store.users.find(element => element.id === parseInt(userid, 10));
    if (!foundUser) {
      return res.status(404).send({
        status: 404,
        error: 'User does not exist on the database.',
      });
    }
    if (type !== 'red-flag') {
      return res.status(401).send({
        status: 401,
        error: 'Unable to create red-flag record. This endpoint only creates red-flags.',
      });
    }

    foundUser.reports.redFlags.unshift(createdRedFlag);
    store.records.redFlags.unshift(createdRedFlag);

    return res.status(201).send({
      status: 201,
      data: { redFlag: createdRedFlag },
    });
  },
  getAllRedFlags: (req, res) => {
    const { userid } = req.headers;
    const foundUser = store.users.find(element => element.id === parseInt(userid, 10));
    if (!foundUser) {
      return res.status(404).send({
        status: 404,
        error: 'No record of user found in our database.',
      });
    }
    if (foundUser && (!foundUser.isAdmin || foundUser.isAdmin === 'false')) {
      return res.status(200).send({
        status: 200,
        data: {
          redFlags: foundUser.reports.redFlags,
        },
      });
    }

    const allRedFlags = store.records.redFlags;
    return res.status(200).send({
      status: 200,
      data: {
        redFlags: allRedFlags,
      },
    });
  },
  getRedFlagById: (req, res) => {
    const { userid } = req.headers;
    const redFlagId = parseInt(req.params.id, 10);
    const foundRedFlag = store.records.redFlags.find(element => element.id === redFlagId);
    const foundUser = store.users.find(element => element.id === parseInt(userid, 10));

    if (!foundRedFlag) {
      return res.status(404).send({
        status: 404,
        error: `Red-flag record with ID: ${redFlagId} not found.`,
      });
    }

    if (!foundUser) {
      return res.status(400).send({
        status: 400,
        error: 'User not found.',
      });
    }

    if ((foundUser.isAdmin === 'true' || foundUser.isAdmin === true) && foundRedFlag) {
      return res.status(200).send({
        status: 200,
        data: foundRedFlag,
      });
    }

    if (foundRedFlag.createdBy !== parseInt(userid, 10)) {
      return res.status(401).send({
        status: 401,
        error: 'You are not authorized to view this record.',
      });
    }

    return res.status(200).send({
      status: 200,
      data: foundRedFlag,
    });
  },
  deleteRedFlag: (req, res) => {
    const { userid } = req.headers;
    const redFlagId = parseInt(req.params.id, 10);
    const foundRedFlag = store.records.redFlags.find(element => element.id === redFlagId);
    const foundUser = store.users.find(element => element.id === parseInt(userid, 10));

    if (!foundUser) {
      return res.status(404).send({
        status: 404,
        error: 'This user does not exist in our records.',
      });
    }

    if (!foundRedFlag) {
      return res.status(404).send({
        status: 404,
        error: `The record with ID: ${redFlagId} you requested was not found.`,
      });
    }

    if (foundRedFlag.createdBy !== parseInt(userid, 10)) {
      return res.status(401).send({
        status: 401,
        error: 'You are not authorized to delete this record.',
      });
    }

    if (foundRedFlag.status !== 'draft') {
      return res.status(401).send({
        status: 401,
        error: `You can not delete a record whose status is ${foundRedFlag.status}`,
      });
    }

    const indexOfRedFlagForUser = foundUser.reports.redFlags.indexOf(foundRedFlag);
    const indexOfRedFlagForRecords = store.records.redFlags.indexOf(foundRedFlag);

    const deletedRedFlag = foundUser.reports.redFlags[indexOfRedFlagForUser];

    foundUser.reports.redFlags.splice(indexOfRedFlagForUser, 1);
    store.records.redFlags.splice(indexOfRedFlagForRecords, 1);

    return res.status(200).send({
      status: 200,
      data: {
        redFlag: deletedRedFlag,
      },
      message: 'red-flag record has been deleted.',
    });
  },
  editRedFlagLocation: (req, res) => {
    let { userid } = req.headers;
    const { location } = req.body;
    userid = parseInt(userid, 10);
    const redFlagId = parseInt(req.params.id, 10);
    const foundUser = store.users.find(element => element.id === parseInt(userid, 10));
    const foundRedFlag = store.records.redFlags.find(element => element.id === redFlagId);

    if (!foundUser) {
      return res.status(404).send({
        status: 404,
        error: 'This user does not exist in our records.',
      });
    }

    const foundRedFlagInUser = foundUser.reports.redFlags.find(element => element.id === redFlagId);

    if (!foundRedFlagInUser) {
      return res.status(404).send({
        status: 404,
        error: `No record with this ID: ${redFlagId} found.`,
      });
    }

    if (foundRedFlagInUser.status !== 'draft') {
      return res.status(401).send({
        status: 401,
        error: `You can not edit a record whose status is ${foundRedFlag.status}`,
      });
    }

    foundRedFlag.location = location;
    foundRedFlagInUser.location = location;

    return res.status(200).send({
      status: 200,
      data: {
        redFlag: foundRedFlag,
      },
      message: 'Updated red-flag record\'s location',
    });
  },
  editRedFlagComment: (req, res) => {
    let { userid } = req.headers;
    const { comment } = req.body;
    userid = parseInt(userid, 10);
    const redFlagId = parseInt(req.params.id, 10);
    const foundUser = store.users.find(element => element.id === userid);
    const foundRedFlag = store.records.redFlags.find(element => element.id === redFlagId);

    if (!foundUser) {
      return res.status(404).send({
        status: 404,
        error: 'This user does not exist in our records.',
      });
    }

    const foundRedFlagInUser = foundUser.reports.redFlags.find(element => element.id === redFlagId);

    if (!foundRedFlagInUser) {
      return res.status(404).send({
        status: 404,
        error: `No record with this ID: ${redFlagId} found.`,
      });
    }

    if (foundRedFlag.status !== 'draft') {
      return res.status(401).send({
        status: 401,
        error: `You can not edit a record whose status is ${foundRedFlag.status}`,
      });
    }

    foundRedFlag.comment = comment;
    foundRedFlagInUser.comment = comment;

    return res.status(200).send({
      status: 200,
      data: {
        redFlag: foundRedFlag,
      },
      message: 'Updated red-flag record\'s comment',
    });
  },
};
