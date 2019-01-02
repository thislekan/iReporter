/* eslint-disable no-console */
import userMiddleware from './userMiddleware';

const pattern = /[0-9]/g;
function errorMessage(res, statusCode, message) {
  return res.status(statusCode).send({
    status: statusCode,
    error: message,
  });
}


// function checkUpdateInputsIfString(res, statusCode, message, value) {
//   let response;
//   if (typeof (value) !== 'string') {
//     response = res.status(statusCode).send({
//       status: statusCode,
//       error: message,
//     });
//   }
//   return response;
// }

function checkForTrim(values, res, statusCode) {
  const [email, firstName, lastName] = values;
  const message = `The following: ${(!email.trim()) ? 'email, ' : ''}${(!firstName.trim()) ? 'firstName, ' : ''}${(!lastName.trim()) ? 'lastName' : ''} contains just white spaces.`;
  return errorMessage(res, statusCode, message);
}


export default {
  validateCreateUserInput: async (req, res, next) => {
    const {
      email, password, lastName, firstName,
    } = req.body;

    if (!email || !password || !lastName || !firstName) {
      const message = `The following fields are not provided: ${!email ? 'email, ' : ''}${!password ? 'password, ' : ''}${!lastName ? 'lastName, ' : ''}${!firstName ? 'firstName' : ''}.`;
      return errorMessage(res, 400, message);
    }

    const inputValues = [email, lastName, firstName];
    if (!email.trim() || !lastName.trim() || !firstName.trim()) {
      return checkForTrim(inputValues, res, 400);
    }

    if (firstName.match(pattern) || lastName.match(pattern)) {
      const message = `The ${(firstName.match(pattern)) ? 'firstName, ' : ''}${(lastName.match(pattern)) ? 'lastName' : ''} can not contain numbers`;
      return errorMessage(res, 400, message);
    }

    if (!/^.+@.+\..+$/.test(email)) return errorMessage(res, 400, 'The email is invalid');
    if (typeof (password) !== 'string') {
      return errorMessage(res, 400, 'Password needs to be a string');
    }
    if (password.length < 6) {
      return errorMessage(res, 400, 'Password needs to be 6 at least characters or more');
    }

    const user = await userMiddleware.checkIfEmailExist(email);
    if (user && !user.status) {
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

    if (!email || !password) {
      return errorMessage(res, 400, 'Log in unsuccessful. Please provide email.');
    }

    if (!/^.+@.+\..+$/.test(email)) return errorMessage(res, 400, 'The email is invalid');
    if (typeof (password) !== 'string') {
      return errorMessage(res, 400, 'Password needs to be a string');
    }
    if (password.length < 6) {
      return errorMessage(res, 400, 'Password needs to be 6 at least characters or more');
    }

    const user = await userMiddleware.checkIfEmailExist(email);
    if (!user.email && user.status) {
      return errorMessage(res, 404, 'No records of this user exist on our database.');
    }
    res.locals.foundUser = user;
    return next();
  },


  // validateUpdateUserInput: async (req, res, next) => {
  //   const { userid } = req.headers;
  //   const {
  //     fullname,
  //     lastName,
  //     firstName,
  //     otherNames,
  //     phoneNumber,
  //     userName,
  //   } = req.body;

  //   if (!userid) {
  //     return errorMessage(res, 404, 'User not found');
  //   }

  //   if (!fullname && !lastName && !firstName && !otherNames && !phoneNumber && !userName) {
  //     return errorMessage(res, 400, 'Can\'t update user with empty fields');
  //   }

  //   if (fullname) {
  //     checkUpdateInputsIfString(res, 400, 'The fullname is invalid', fullname);
  //   }
  //   if (lastName) {
  //     checkUpdateInputsIfString(res, 400, 'The lastName is invalid', lastName);
  //   }
  //   if (firstName) {
  //     checkUpdateInputsIfString(res, 400, 'The firstName is invalid', firstName);
  //   }
  //   if (otherNames) {
  //     checkUpdateInputsIfString(res, 400, 'The other names you provided is invalid', otherNames);
  //   }
  //   if (userName) {
  //     checkUpdateInputsIfString(res, 400, 'The userName is invalid', userName);
  //   }

  //   return next();
  // },
};
