/* eslint-disable no-console */
import uuid from 'uuid/v4';
import dbHelper from '../models/dbHelper';
// import userMiddleware from '../middlewares/userMiddleware';

// const findIncidentQuery = 'SELECT * FROM incidents WHERE id = $1';

function rowCountCheck(res, rowCount, message, type) {
  let response;
  if (!rowCount) {
    response = res.status(404).send({
      status: (type === 'data') ? 200 : 404,
      [type || 'error']: message || 'Sorry. This user is yet to report this type of incident.',
    });
  }
  return response;
}

function responseMessage(res, statusCode, message, type) {
  return res.status(statusCode).send({
    status: statusCode,
    [type]: message,
  });
}

export default {
  createIncident: async (req, res) => {
    const { userid } = res.locals;
    const {
      type, location, comment, title, status = 'draft',
    } = req.body;
    const text = `INSERT INTO
    incidents(id, "createdBy", "createdOn", type, location, status, comment, title) VALUES($1, $2, $3, $4, $5,$6, $7, $8)
    returning *`;

    const values = [
      uuid(),
      userid,
      new Date().getTime(),
      type.trim(),
      location.trim(),
      status.trim(),
      comment.trim(),
      title.trim(),
    ];

    try {
      const { rows } = await dbHelper.query(text, values);
      return responseMessage(res, 201, rows[0], 'data');
    } catch (error) {
      return responseMessage(res, 400, error, 'error');
    }
  },


  getAllIncidents: async (req, res) => {
    const textQueryForAllIncidents = 'SELECT * FROM incidents';

    try {
      const { rows, rowCount } = await dbHelper.query(textQueryForAllIncidents);
      if (!rows.length) {
        return responseMessage(
          res, 404, 'Sorry. There are no records on our database yet.', 'error',
        );
      }
      return responseMessage(res, 200, { incidents: rows, rowCount }, 'data');
    } catch (error) {
      return responseMessage(res, 400, error, 'error');
    }
  },


  getAllUserIncidents: async (req, res) => {
    const { userid } = res.locals;
    const text = 'SELECT * FROM incidents WHERE "createdBy" = $1';

    try {
      const { rows, rowCount } = await dbHelper.query(text, [userid]);
      if (!rowCount) return rowCountCheck(res, rowCount, 'User yet to report an incident', 'data');
      return responseMessage(res, 200, rows, 'data');
    } catch (error) {
      return responseMessage(res, 400, error, 'error');
    }
  },


  getIncidentsByType: async (req, res) => {
    const { type } = req.params;
    const { userid } = res.locals;
    const queryText = 'SELECT * FROM incidents WHERE type = $1 AND "createdBy" = $2';
    const redFlagValue = [(type === 'red-flag') ? 'red-flag' : '', userid];
    const interventionValue = [(type === 'intervention') ? 'intervention' : '', userid];

    try {
      let value = interventionValue;
      if (type === 'red-flag') value = redFlagValue;
      const { rows, rowCount } = await dbHelper.query(queryText, value);
      if (!rowCount) return rowCountCheck(res, rowCount);
      return responseMessage(res, 200, { [type]: rows, rowCount }, 'data');
    } catch (error) {
      return responseMessage(res, 400, error, 'error');
    }
  },
  getSingleIncident: async (req, res) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const text = 'SELECT * FROM incidents where id = $1 AND "createdBy" = $2';
    const values = [id, userid];

    try {
      const { rows, rowCount } = await dbHelper.query(text, values);
      if (!rowCount) {
        return responseMessage(
          res, 404, 'The record you requested for does not exist', 'error',
        );
      }
      return responseMessage(res, 200, rows[0], 'data');
    } catch (error) {
      return responseMessage(res, 400, 'The incident you requested does not exist', 'error');
    }
  },
  editRedFlagComment: async (req, res) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const { comment } = req.body;
    const text = `
    UPDATE incidents
      SET comment=$3, "updatedOn"=$4
      WHERE id=$1 AND "createdBy" = $2 AND status = 'draft' AND type = 'red-flag' returning *
    `;
    try {
      const values = [
        id,
        userid,
        comment.trim(),
        new Date().getTime(),
      ];
      const { rows, rowCount } = await dbHelper.query(text, values);
      if (!rowCount) return rowCountCheck(res, rowCount);
      return responseMessage(res, 200, rows[0], 'data');
    } catch (error) {
      return responseMessage(res, 400, 'The record you requested does not exist', 'error');
    }
  },
  editInterventionComment: async (req, res) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const { comment } = req.body;
    const text = `
    UPDATE incidents
      SET comment=$3, "updatedOn"=$4
      WHERE id=$1 AND "createdBy" = $2 AND status = 'draft' AND type = 'intervention' returning *
    `;
    try {
      const values = [
        id,
        userid,
        comment.trim(),
        new Date().getTime(),
      ];
      const { rows, rowCount } = await dbHelper.query(text, values);
      if (!rowCount) return responseMessage(res, 404, 'This record does not exist', 'error');
      return responseMessage(res, 200, rows[0], 'data');
    } catch (error) {
      return responseMessage(res, 400, 'The record you requested does not exist', 'error');
    }
  },
  editRedFlagLocation: async (req, res) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const { location } = req.body;
    const text = `
    UPDATE incidents
      SET location=$3, "updatedOn"=$4
      WHERE id=$1 AND "createdBy" = $2 AND status = 'draft' AND type = 'red-flag' returning *
    `;
    try {
      const values = [
        id,
        userid,
        location.trim(),
        new Date().getTime(),
      ];
      const { rows, rowCount } = await dbHelper.query(text, values);
      if (!rowCount) return responseMessage(res, 404, 'This record does not exist', 'error');
      return responseMessage(res, 200, rows[0], 'data');
    } catch (error) {
      return responseMessage(res, 400, 'The record you requested does not exist', 'error');
    }
  },
  editInterventionLocation: async (req, res) => {
    const { userid } = res.locals;
    const { id } = req.params;
    const { location } = req.body;
    const text = `
    UPDATE incidents
      SET location=$3, "updatedOn"=$4
      WHERE id=$1 AND "createdBy" = $2 AND status = 'draft' AND type = 'intervention' returning *
    `;
    try {
      const values = [
        id,
        userid,
        location.trim(),
        new Date().getTime(),
      ];
      const { rows, rowCount } = await dbHelper.query(text, values);
      if (!rowCount) return responseMessage(res, 404, 'This record does not exist', 'error');
      return responseMessage(res, 200, rows[0], 'data');
    } catch (error) {
      return responseMessage(res, 400, 'The record you requested does not exist', 'error');
    }
  },
  deleteIncident: async (req, res) => {
    const { userid } = res.locals;
    const { id, type } = req.body;
    const text = `
    DELETE FROM incidents 
    WHERE id=$1 AND status='draft' AND "createdBy"=$2 AND type=$3
    returning *
    `;
    const values = [id, userid, type.trim()];
    try {
      const { rows } = await dbHelper.query(text, values);
      return responseMessage(res, 200, rows[0], 'data');
    } catch (error) {
      return responseMessage(res, 400, 'The record you requested does not exist', 'error');
    }
  },
  updateIncidentStatus: async (req, res) => {
    const { id, status } = req.body;

    const text = `UPDATE incidents
      SET status=$2, "updatedOn"=$3
      WHERE id=$1 returning *`;
    const values = [id, status.trim(), new Date().getTime()];

    try {
      const { rows, rowCount } = await dbHelper.query(text, values);
      if (!rowCount) return responseMessage(res, 404, 'This record does not exist', 'error');
      return responseMessage(res, 200, rows[0], 'data');
    } catch (error) {
      return responseMessage(res, 400, 'The record you requested does not exist', 'error');
    }
  },
};
