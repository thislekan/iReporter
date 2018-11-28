import store from '../db/store';

const confirmUser = (req, res, next) => {
  const query = req.body;
  if (!query.email || !query.password) {
    return res.status(400).send({
      status: 400,
      error: 'Email and password are required.',
    });
  }
  const alreadyExist = store.users.findIndex(element => element.email === query.email);
  if (alreadyExist !== -1) {
    return res.status(403).send({
      status: 403,
      error: 'The user already exist.',
    });
  }
  return next();
};

export default confirmUser;
