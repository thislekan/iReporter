/* eslint-disable no-console */
import uuid from 'uuid/v4';
import bcrypt from 'bcrypt';
import dbMiddleware from '../models/dbMiddleware';
import userMiddleware from '../middlewares/userMiddleware';

// const findUserQuery = 'SELECT * FROM users WHERE id = $1';

// const hashPasswordFunction = async (password) => {
//   let hashedPassword;
//   bcrypt.genSalt(10, (err, salt) => {
//     console.log(err);
//     bcrypt.hash(password, salt, (hasherr, hash) => {
//       console.log(salt);
//       if (hasherr) {
//         console.log(hasherr);
//       }
//       hashedPassword = hash;
//       return hashedPassword;
//       // next();
//     });
//   });
// };

export default {
  /**
   * dbMiddleware.query returns an awaiting promise on debugging.
   * using Promises still didn't solve the problem,
   * so I implemented an already existing solution to save time
   * This article provided me with how to resolve it:
   * https://www.codementor.io/olawalealadeusi896/building-a-simple-api-with-nodejs-expressjs-and-postgresql-db-masuu56t7
   */

  createUser: async (req, res) => {
    // console.log(req.body);

    const { email, fullname, password } = req.body;
    const text = `INSERT INTO
    Users(id, email, fullname, password) VALUES($1, $2, $3, $4)
    returning *`;

    // const hashedPassword = await hashPasswordFunction(password);

    let hashedPassword;
    bcrypt.genSalt(10, (err, salt) => {
      console.log(err);
      bcrypt.hash(password, salt, (hasherr, hash) => {
        console.log(salt);
        if (hasherr) {
          console.log(hasherr);
        }
        hashedPassword = hash;
        return hashedPassword;
        // next();
      });
    });

    const values = [uuid(), email, fullname, password];
    try {
      const { rows } = await dbMiddleware.query(text, values);
      console.log(rows);
      delete rows[0].password;
      return res.status(201).send({
        status: 201,
        data: rows[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },
  loginUser: async (req, res) => {
    // const { userid } = req.headers;
    const { email, password } = req.body;

    const user = await userMiddleware.checkIfEmailExist(email);
    console.log(user);
    console.log(password);

    if (user.password !== password) {
      return res.status(400).send({
        status: 400,
        error: 'Email or password invalid.',
      });
    }
    delete user.password;

    return res.status(200).send({
      status: 200,
      data: user,
    });

    // try {
    //   const { rows } = await dbMiddleware.query(findUserQuery, [userid]);
    //   console.log(rows);
    //   delete rows[0].password;
    //   return res.status(200).send(rows[0]);
    // } catch (error) {
    //   console.log(error);
    //   return res.status(400).send({
    //     status: 400,
    //     error,
    //   });
    // }
  },
  updateUser: async (req, res) => {
    console.log('update fired');
    const { userid } = req.headers;
    const {
      fullname,
      lastname,
      firstname,
      othernames,
      phoneNumber,
      username,
    } = req.body;

    if (req.body.email || req.body.password || req.body.id) {
      return res.status(400).send({
        status: 400,
        error: 'Email, password or user Id can\'t be edited',
      });
    }

    const text = `UPDATE Users
      SET fullname=$1,lastname=$2,firstname=$3,othernames=$4,phoneNumber=$5,username=$6
      WHERE id=$7 returning *`;

    try {
      const rows = await userMiddleware.findUser(userid);
      console.log(rows);
      if (rows.status === 401) {
        console.log('no rows found');
        return res.status(401).send({
          status: 401,
          error: rows,
        });
      }

      if (rows.fullname) {
        const userFullname = rows.fullname;
        if (!userFullname.includes(lastname) && !userFullname.includes(firstname)) {
          return res.status(400).send({
            error: 'Your last name and first name needs to match your full name',
            status: 400,
          });
        }
      }


      const values = [
        fullname || rows.fullname,
        lastname || rows.lastname,
        firstname || rows.firstname,
        othernames || rows.othernames,
        phoneNumber || rows.phoneNumber,
        username || rows.username,
        userid,
      ];
      const result = await dbMiddleware.query(text, values);
      delete result.rows.password;
      return res.status(201).send({
        status: 201,
        data: result.rows,
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
