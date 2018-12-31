/* eslint-disable no-console */
import uuid from 'uuid/v4';
import jwt from 'jsonwebtoken';
import dotEnv from '../config/config';
import dbHelper from '../models/dbHelper';
// import userMiddleware from '../middlewares/userMiddleware';

function createToken(userid) {
  const token = jwt.sign(userid, dotEnv.JWT_SECRET);
  return token;
}

function responseMessage(res, statusCode, message, type) {
  return res.status(statusCode).send({
    status: statusCode,
    [type]: message,
  });
}

export default {
  /**
   * dbHelper.query returns an awaiting promise on debugging.
   * using Promises still didn't solve the problem,
   * so I implemented an already existing solution to save time
   * This article provided me with how to resolve it:
   * https://www.codementor.io/olawalealadeusi896/building-a-simple-api-with-nodejs-expressjs-and-postgresql-db-masuu56t7
   */

  createUser: async (req, res) => {
    const { email, lastName, firstName } = req.body;
    const { hashedPassword } = res.locals;
    const text = `INSERT INTO
    Users(id, email, "lastName", "firstName", password) VALUES($1, $2, $3, $4, $5)
    returning *`;

    const newUserId = uuid();
    const token = createToken(newUserId);
    const values = [newUserId, email, lastName.trim(), firstName.trim(), hashedPassword];

    try {
      const { rows } = await dbHelper.query(text, values);
      delete rows[0].password;
      return responseMessage(res, 201, { user: rows[0], token }, 'data');
    } catch (error) {
      return responseMessage(res, 400, error, 'error');
    }
  },
  loginUser: async (req, res) => {
    const user = res.locals.foundUser;
    delete user.password;

    const token = createToken(user.id);
    return responseMessage(res, 200, { user, token }, 'data');
  },
  // updateUser: async (req, res) => {
  //   console.log('update fired');
  //   const { userid } = req.headers;
  //   const {
  //     fullname,
  //     lastname,
  //     firstname,
  //     othernames,
  //     phoneNumber,
  //     username,
  //   } = req.body;

  //   if (req.body.email || req.body.password || req.body.id) {
  //     return errorMessage(res, 400, 'Email, password or user Id can\'t be edited');
  //   }

  //   const text = `UPDATE Users
  //     SET fullname=$1,lastname=$2,firstname=$3,othernames=$4,phoneNumber=$5,username=$6
  //     WHERE id=$7 returning *`;

  //   try {
  //     const rows = await userMiddleware.findUser(userid);
  //     console.log(rows);
  //     if (rows.status === 401) {
  //       console.log('no rows found');
  //       return errorMessage(res, 401, rows);
  //     }

  //     if (rows.fullname) {
  //       const userFullname = rows.fullname;
  //       if (!userFullname.includes(lastname) && !userFullname.includes(firstname)) {
  //         return errorMessage(
  //           res, 400,
  //           'Your last name and first name needs to match your full name',
  //         );
  //       }
  //     }


  //     const values = [
  //       fullname || rows.fullname,
  //       lastname || rows.lastname,
  //       firstname || rows.firstname,
  //       othernames || rows.othernames,
  //       phoneNumber || rows.phoneNumber,
  //       username || rows.username,
  //       userid,
  //     ];
  //     const result = await dbHelper.query(text, values);
  //     delete result.rows.password;
  //     return res.status(201).send({
  //       status: 201,
  //       data: result.rows,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(400).send({
  //       status: 400,
  //       error,
  //     });
  //   }
  // },
};
