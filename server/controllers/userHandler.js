import store from '../db/store';
import idGenerator from '../middlewares/idGenerator';

class User {
  constructor(
    firstname,
    lastname,
    othernames,
    email,
    password,
    id,
    phoneNumber,
    registered,
    isAdmin,
  ) {
    this.email = email;
    this.password = password;
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.othernames = othernames;
    this.phoneNumber = phoneNumber;
    this.registered = registered;
    this.isAdmin = isAdmin;
    this.reports = { interventions: [], redFlags: [] };
  }
}

export default {
  createUser: (req, res) => {
    const {
      email,
      password,
      firstname,
      lastname,
      othernames,
      phoneNumber,
      isAdmin,
    } = req.body;
    if (!/^.+@.+\..+$/.test(email)) {
      return res.status(400).send({
        status: 400,
        error: 'Email invalid. Please signup with a valid email',
      });
    }

    if (password.length < 6 || typeof (password) !== 'string') {
      return res.status(400).send({
        status: 400,
        error: 'The password needs to be 6 or more characters and also a string',
      });
    }

    const userId = parseInt(idGenerator(), 10);
    const registered = new Date();
    const userDetails = new User(
      firstname,
      lastname,
      othernames,
      email,
      password,
      userId,
      phoneNumber,
      registered,
      isAdmin,
    );

    store.users.push(userDetails);
    return res.status(201).send({
      status: 201,
      data: {
        email,
        userId,
        firstname,
        lastname,
        othernames,
        phoneNumber,
        registered,
      },
    });
  },
  loginUser: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        status: 400,
        error: 'Password and Email required to log in.',
      });
    }

    const foundUser = store.users.find(element => element.email === email);
    if (!foundUser) {
      return res.status(404).send({
        status: 404,
        error: 'This user does not exist',
      });
    }

    if (password !== foundUser.password) {
      return res.status(400).send({
        status: 400,
        error: 'The email or password is incorrect',
      });
    }
    return res.status(200).send({
      status: 200,
      data: { user: foundUser },
    });
  },
};
