/* eslint-disable no-console */
import uuid from 'uuid/v4';
import dbMiddleware from '../models/dbMiddleware';
// import userMiddleware from '../middlewares/userMiddleware';

// const findIncidentQuery = 'SELECT * FROM incidents WHERE id = $1';

function rowCountCheck(res, rowCount) {
  let response;
  if (!rowCount) {
    response = res.status(404).send({
      status: 404,
      error: 'Sorry. This user is yet to report an incident.',
    });
  }
  return response;
}

export default {
  /**
   * nothong to show here.
   */

  createIncident: async (req, res) => {
    const { userid } = req.headers;
    const {
      type,
      location,
      comment,
      title,
      status = 'draft',
    } = req.body;
    const text = `INSERT INTO
    incidents(id, createdBy, createdOn, type, location, status, comment, title) VALUES($1, $2, $3, $4, $5,$6, $7, $8)
    returning *`;

    const values = [uuid(), userid, new Date().getTime(), type, location, status, comment, title];

    try {
      const { rows } = await dbMiddleware.query(text, values);
      console.log(rows);
      return res.status(201).send({
        status: 201,
        data: rows[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: 400,
        error,
      });
    }
  },
  getAllIncidents: async (req, res) => {
    const textQueryForAllIncidents = 'SELECT * FROM incidents';

    try {
      const { rows, rowCount } = await dbMiddleware.query(textQueryForAllIncidents);
      if (!rows.length) {
        return res.status(404).send({
          status: 404,
          error: 'Sorry. There are no records on our database yet.',
        });
      }
      return res.status(200).send({
        status: 200,
        data: { rows, rowCount },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: 400,
        error,
      });
    }
  },
  getAllUserIncidents: async (req, res) => {
    console.log(req, res);
  },
  getIncidentsByType: async (req, res) => {
    const { type } = req.params;
    const { userid } = req.headers;
    const queryText = 'SELECT * FROM incidents WHERE type = $1 AND createdBy = $2';
    const redFlagValue = [(type === 'red-flag') ? 'red-flag' : '', userid];
    const interventionValue = [(type === 'intervention') ? 'intervention' : '', userid];

    try {
      if (type === 'red-flag') {
        const { rows, rowCount } = await dbMiddleware.query(queryText, redFlagValue);
        rowCountCheck(res, rowCount);
        return res.status(200).send({
          status: 200,
          data: { [type]: rows, rowCount },
        });
      }
      const { rows, rowCount } = await dbMiddleware.query(
        queryText, interventionValue,
      );
      rowCountCheck(res, rowCount);
      // const inicdents = rows[0];
      return res.status(200).send({
        status: 200,
        data: { [type]: rows[0], rowCount },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: 400,
        error,
      });
    }
  },
  getSingleIncident: async (req, res) => {
    const { userid } = req.headers;
    const { id } = req.params;
    const text = 'SELECT * FROM incidents where id = $1 AND createdBy = $2';
    const values = [id, userid];

    try {
      const { rows, rowCount } = await dbMiddleware.query(text, values);
      if (!rowCount) {
        return res.status(404).send({
          status: 404,
          error: 'The record you requested for does not exist',
        });
      }
      return res.status(200).send({
        status: 200,
        data: rows[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(404).send({
        status: 400,
        error: 'No record of the incident you requested exist.',
      });
    }
  },
  editRedFlagComment: async (req, res) => {
    const { userid } = req.headers;
    const { id } = req.params;
    const { comment } = req.body;
    const text = `
    UPDATE incidents
      SET comment=$3, updatedOn=$4
      WHERE id=$1 AND createdby = $2 AND status = 'draft' AND type = 'red-flag' returning *
    `;
    try {
      const values = [
        id,
        userid,
        comment,
        new Date().getTime(),
      ];
      const { rows, rowCount } = await dbMiddleware.query(text, values);
      rowCountCheck(res, rowCount);
      return res.status(201).send({
        status: 201,
        data: rows[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: 400,
        error,
      });
    }
  },
  editInterventionComment: async (req, res) => {
    const { userid } = req.headers;
    const { id } = req.params;
    const { comment } = req.body;
    const text = `
    UPDATE incidents
      SET comment=$3, updatedOn=$4
      WHERE id=$1 AND createdby = $2 AND status = 'draft' AND type = 'intervention' returning *
    `;
    try {
      const values = [
        id,
        userid,
        comment,
        new Date().getTime(),
      ];
      const { rows, rowCount } = await dbMiddleware.query(text, values);
      rowCountCheck(res, rowCount);
      return res.status(201).send({
        status: 201,
        data: rows[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: 400,
        error,
      });
    }
  },
  editRedFlagLocation: async (req, res) => {
    const { userid } = req.headers;
    const { id } = req.params;
    const { location } = req.body;
    const text = `
    UPDATE incidents
      SET location=$3, updatedOn=$4
      WHERE id=$1 AND createdby = $2 AND status = 'draft' AND type = 'red-flag' returning *
    `;
    try {
      const values = [
        id,
        userid,
        location,
        new Date().getTime(),
      ];
      const { rows, rowCount } = await dbMiddleware.query(text, values);
      rowCountCheck(res, rowCount);
      return res.status(201).send({
        status: 201,
        data: rows[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: 400,
        error,
      });
    }
  },
  editInterventionLocation: async (req, res) => {
    const { userid } = req.headers;
    const { id } = req.params;
    const { location } = req.body;
    const text = `
    UPDATE incidents
      SET location=$3, updatedOn=$4
      WHERE id=$1 AND createdby = $2 AND status = 'draft' AND type = 'intervention' returning *
    `;
    try {
      const values = [
        id,
        userid,
        location,
        new Date().getTime(),
      ];
      const { rows, rowCount } = await dbMiddleware.query(text, values);
      rowCountCheck(res, rowCount);
      return res.status(201).send({
        status: 201,
        data: rows[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: 400,
        error,
      });
    }
  },
  deleteIncident: async (req, res) => {
    const { userid } = req.headers;
    const { id, type } = req.params;
    const text = `
    DELETE FROM incidents 
    WHERE id=$1 AND status='draft' AND createdBy=$2 AND type=$3
    returning *
    `;
    const values = [id, userid, type];
    try {
      const { rows } = await dbMiddleware.query(text, values);
      return res.status(200).send({
        status: 200,
        data: rows[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        status: 400,
        error,
      });
    }
  },
};
