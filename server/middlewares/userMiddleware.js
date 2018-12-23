/* eslint-disable no-console */
import dbHelper from '../models/dbHelper';

export default {
  findUser: async (userid) => {
    const findUserQuery = 'SELECT * FROM Users WHERE id = $1';
    try {
      const { rows } = await dbHelper.query(findUserQuery, [userid]);
      return rows[0];
    } catch (error) {
      return {
        status: 401,
        error: 'This user does not exist.',
      };
    }
  },
  checkIfEmailExist: async (email) => {
    const text = 'SELECT * FROM Users WHERE email = $1';
    const { rows } = await dbHelper.query(text, [email]);
    if (!rows.length) {
      return {
        status: 404,
        message: 'No record of email exist on the database',
      };
    }
    return rows[0];
  },
};
