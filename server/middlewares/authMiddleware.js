/* eslint-disable no-console */
import bcrypt from 'bcryptjs';
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
    bcrypt.compare(password, foundUser.password)
      .then((foundPassword) => {
        if (!foundPassword) {
          return res.status(400).send({
            status: 401, error: 'Email or password invalid',
          });
        }
        return next();
      })
      .catch(error => res.status(400).send({ status: 400, error }));
  },
  validateToken: (req, res, next) => {
    const token = req.headers['x-auth'];
    if (!token.trim()) {
      return res.status(400).send({
        status: 400,
        error: 'Provide auth token',
      });
    }
    try {
      const decoded = jwt.verify(token.trim(), process.env.JWT_SECRET);
      res.locals.userid = decoded;
    } catch (error) {
      return res.status(400).send({ status: 400, error: 'Token is invalid' });
    }
    return next();
  },
};
