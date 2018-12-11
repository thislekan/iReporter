/* eslint-disable no-console */
import validator from 'validator';
import userMiddleware from './userMiddleware';

function errorMessage(res, statusCode, message) {
  return res.status(statusCode).send({
    status: statusCode,
    error: message,
  });
}

function checkPasswordIfString(res, password) {
  let passwordNotSringError;
  if (typeof (password) !== 'string') {
    const message = 'Password invalid. Your password needs to be a string.';
    passwordNotSringError = errorMessage(res, 400, message);
  }
  return passwordNotSringError;
}

function checkEmailValidity(res, email) {
  let emailNotValidError;
  if (!validator.isEmail(email)) {
    const message = 'The email is invalid';
    emailNotValidError = errorMessage(res, 400, message);
  }
  return emailNotValidError;
}

function checkPasswordCount(res, password) {
  let paswwordCountError;
  if (password.length < 6) {
    const message = 'Your password needs to be 6 characters or more';
    paswwordCountError = errorMessage(res, 400, message);
  }
  return paswwordCountError;
}

// function checkUserInputsIfValid(res, value) {
//   let response;
//   if (!value) {
//     response = res.status(400).send({
//       status: 400,
//       error: 'Update user not successful. Required fields are empty',
//     });
//   }
//   return response;
// }

function checkUpdateInputsIfString(res, statusCode, message, value) {
  let response;
  if (typeof (value) !== 'string') {
    response = res.status(statusCode).send({
      status: statusCode,
      error: message,
    });
  }
  return response;
}

export default {
  validateCreateUserInput: async (req, res, next) => {
    const { email, password, fullname } = req.body;
    if (!email) {
      const message = `${(!email) ? 'You can not create an account without an email.' : ''}`;
      return errorMessage(res, 400, message);
    }
    if (!password) {
      const message = `${(!password) ? 'You can not create an account without a password' : ''}`;
      return errorMessage(res, 400, message);
    }
    if (!fullname) {
      const message = `${(!fullname) ? 'We need to know your name before creating your account.' : ''}`;
      return errorMessage(res, 400, message);
    }

    checkEmailValidity(res, email);
    checkPasswordIfString(res, password);
    checkPasswordCount(res, password);

    const user = await userMiddleware.checkIfEmailExist(email);
    if (!user.status) {
      if (user.email) {
        const message = 'This email is already in use.';
        return errorMessage(res, 400, message);
      }
      return user;
    }
    return next();
  },
  validateLoginUserInput: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
      return errorMessage(res, 400, 'Log in unsuccessful. Please provide email.');
    }

    if (!password) {
      return errorMessage(res, 400, 'Log in unsuccessful. Please provide password.');
    }

    checkEmailValidity(res, email);
    checkPasswordIfString(res, password);
    checkPasswordCount(res, password);

    const user = await userMiddleware.checkIfEmailExist(email);
    if (!user.email) {
      if (user.status) {
        const message = 'No records of this user exist on our database.';
        return errorMessage(res, 404, message);
      }
      return user;
    }

    return next();
  },
  validateUpdateUserInput: async (req, res, next) => {
    const { userid } = req.headers;
    const {
      fullname,
      lastname,
      firstname,
      othernames,
      phoneNumber,
      username,
    } = req.body;

    if (!userid) {
      return res.status(404).send({
        error: 'User not found',
        status: 404,
      });
    }

    if (!fullname && !lastname && !firstname && !othernames && !phoneNumber && !username) {
      return res.status(400).send({
        status: 400,
        error: 'Update user not successful. Required fields are empty',
      });
    }

    if (fullname) {
      checkUpdateInputsIfString(res, 400, 'The fullname is invalid', fullname);
    }
    if (lastname) {
      checkUpdateInputsIfString(res, 400, 'The lastname is invalid', lastname);
    }
    if (firstname) {
      checkUpdateInputsIfString(res, 400, 'The firstname is invalid', firstname);
    }
    if (othernames) {
      checkUpdateInputsIfString(res, 400, 'The other names you provided is invalid', othernames);
    }
    if (username) {
      checkUpdateInputsIfString(res, 400, 'The username is invalid', username);
    }

    return next();
  },
};
