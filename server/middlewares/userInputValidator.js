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
  const [email, firstname, lastname] = values;
  const message = `The following: ${(!email.trim()) ? 'email, ' : ''}${(!firstname.trim()) ? 'firstname, ' : ''}${(!lastname.trim()) ? 'lastname' : ''} contains just white spaces.`;
  return errorMessage(res, statusCode, message);
}


export default {
  validateCreateUserInput: async (req, res, next) => {
    const {
      email, password, lastname, firstname,
    } = req.body;

    if (!email || !password || !lastname || !firstname) {
      const message = `The following fields are not provided: ${!email ? 'email, ' : ''}${!password ? 'password, ' : ''}${!lastname ? 'lastname, ' : ''}${!firstname ? 'firstname' : ''}.`;
      return errorMessage(res, 400, message);
    }

    const inputValues = [email, lastname, firstname];
    if (!email.trim() || !lastname.trim() || !firstname.trim()) {
      return checkForTrim(inputValues, res, 400);
    }

    if (firstname.match(pattern) || lastname.match(pattern)) {
      const message = `The ${(firstname.match(pattern)) ? 'firstname, ' : ''}${(lastname.match(pattern)) ? 'lastname' : ''} can not contain numbers`;
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
  //     lastname,
  //     firstname,
  //     othernames,
  //     phoneNumber,
  //     username,
  //   } = req.body;

  //   if (!userid) {
  //     return errorMessage(res, 404, 'User not found');
  //   }

  //   if (!fullname && !lastname && !firstname && !othernames && !phoneNumber && !username) {
  //     return errorMessage(res, 400, 'Can\'t update user with empty fields');
  //   }

  //   if (fullname) {
  //     checkUpdateInputsIfString(res, 400, 'The fullname is invalid', fullname);
  //   }
  //   if (lastname) {
  //     checkUpdateInputsIfString(res, 400, 'The lastname is invalid', lastname);
  //   }
  //   if (firstname) {
  //     checkUpdateInputsIfString(res, 400, 'The firstname is invalid', firstname);
  //   }
  //   if (othernames) {
  //     checkUpdateInputsIfString(res, 400, 'The other names you provided is invalid', othernames);
  //   }
  //   if (username) {
  //     checkUpdateInputsIfString(res, 400, 'The username is invalid', username);
  //   }

  //   return next();
  // },
};
