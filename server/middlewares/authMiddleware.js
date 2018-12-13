/* eslint-disable no-console */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default {
  hashPassword: (req, res, next) => {
    const { password } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (hasherr, hash) => {
        res.locals.hashedPassword = hash;
        next();
      });
    });
  },
  comparePassword: (req, res, next) => {
    const { password } = req.body;
    const { foundUser } = res.locals;
    console.log(foundUser);
    bcrypt.compare(password, foundUser.password, (err, hashres) => {
      // res == true
      console.log(hashres);
      console.log('calling next soon');
    });
    return next();
  },
  validateToken: (req, res, next) => {
    const token = req.headers['x-auth'];
    if (!token) {
      return res.status(400).send({
        status: 400,
        error: 'Provide auth token',
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    res.locals.userid = decoded;
    return next();
  },
};
