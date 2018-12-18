/* eslint-disable no-console */
import supertest from 'supertest';
import { expect } from 'chai';
// import mlog from 'mocha-logger';
import app from '../server/app';

process.env.NODE_ENV = 'test';
const request = supertest(app);
const apiVersionTwo = '/api/v2/';

const user = {
  firstname: 'John',
  lastname: 'Bellew',
  othernames: 'Gbeborun',
  phoneNumber: '080986544443',
  email: 'testuser@email.com',
  password: 'test_user_419',
  isAdmin: false,
  token: '',
  id: '',
};

const redFlag = {
  title: 'The killings of sex workers',
  location: '0.9876 2.345',
  comment: 'The government needs to take this serious',
  type: 'red-flag',
};

const intervention = {
  title: 'Fuel scarcity in the east',
  location: '6.543 6.1234',
  comment: 'The east suffers too much from scarcity',
  type: 'intervention',
};

/**
 * Tests for challenge 3, Persisting data with Postgres database
 * Splitting the test, the routes, controllers and middlewares come first
 * after which the functions required by each middleware will be put to test
 * *************************************************************************
 * Test for users immediately follows.
 * *************************************************************************
 */

describe('Create a user without any value', () => {
  it('Should return an error', (done) => {
    request.post(`${apiVersionTwo}user/create`)
      .send({})
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(typeof (response.body)).to.equal('object');
        expect(response.body.error).to.equal('The following fields are not provided: email, password, lastname, firstname.');
      });
    done();
  });
});

describe('Create a user with lots of white spaces', () => {
  it('Should return an error', (done) => {
    request.post(`${apiVersionTwo}user/create`)
      .send({
        email: 'newemail@email.com',
        password: '         ',
        firstname: 'Hilarious',
        lastname: '            ',
      })
      .end(async (error, response) => {
        if (error) return done(error);
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        return done();
      });
  });
});

describe('Create a user with alphanumeric names', () => {
  it('Should return an error', (done) => {
    request.post(`${apiVersionTwo}user/create`)
      .send({
        email: user.email,
        password: user.password,
        firstname: '900Users',
        lastname: '500 subscribers',
      })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(typeof (response.body)).to.equal('object');
        expect(response.body.error).to.equal('The firstname, lastname can not contain numbers');
      });
    done();
  });
});

describe('Create a user without using string as password', () => {
  it('Should return an error', (done) => {
    const { email, firstname, lastname } = user;
    request.post(`${apiVersionTwo}user/create`)
      .send({
        email, password: 78474567890, lastname, firstname,
      })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(typeof (response.body)).to.equal('object');
        expect(response.body.error).to.equal('Password needs to be a string');
      });
    done();
  });
});

describe('Create a user with an invalid email', () => {
  it('Should return an error', (done) => {
    const { password, firstname, lastname } = user;
    request.post(`${apiVersionTwo}user/create`)
      .send({
        email: 'yony', password, lastname, firstname,
      })
      .end(async (error, response) => {
        await expect(response.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The email is invalid');
        done();
      });
  });
});

describe('Create a user with a short password', () => {
  it('Should return an error', (done) => {
    const { email, firstname, lastname } = user;
    request.post(`${apiVersionTwo}user/create`)
      .send({
        email, password: '12', lastname, firstname,
      })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Password needs to be 6 at least characters or more');
        done();
      });
  });
});

describe('Create a user with an existing email', () => {
  it('Should return an error', (done) => {
    const { password, firstname, lastname } = user;
    request.post(`${apiVersionTwo}user/create`)
      .send({
        email: 'email@password.com', password, lastname, firstname,
      })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('This email is already in use.');
        done();
      });
  });
});

describe('Create a user with all required details', () => {
  it('Should create a user', (done) => {
    const {
      email, password, firstname, lastname,
    } = user;
    request.post(`${apiVersionTwo}user/create`)
      .send({
        email, password, lastname, firstname,
      })
      .end(async (error, response) => {
        user.id = response.body.data.user.id;
        await expect(response.body.status).to.equal(201);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.user.lastname).to.equal(lastname);
        await expect(response.body.data.user.password).to.undefined;
        done();
      });
  });
});

describe('Login a user without any details', () => {
  it('Should return an error', (done) => {
    request.post(`${apiVersionTwo}user/login`)
      .send({})
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Log in unsuccessful. Please provide email.');
        done();
      });
  });
});

describe('Login a user with invalid email', () => {
  it('Should return an error', (done) => {
    const { password } = user;
    request.post(`${apiVersionTwo}user/login`)
      .send({ email: 'youtube', password })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The email is invalid');
        done();
      });
  });
});

describe('Login a user with invalid password', () => {
  it('Should return an error', (done) => {
    const { email } = user;
    request.post(`${apiVersionTwo}user/login`)
      .send({ email, password: 90898989 })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Password needs to be a string');
        done();
      });
  });
});

describe('Login a user with a short password', () => {
  it('Should return an error', (done) => {
    const { email } = user;
    request.post(`${apiVersionTwo}user/login`)
      .send({ email, password: 'uyu' })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Password needs to be 6 at least characters or more');
        done();
      });
  });
});

describe('Login a non existing user', () => {
  it('Should return an error', (done) => {
    request.post(`${apiVersionTwo}user/login`)
      .send({ email: 'sikiru@fuji.com', password: 'uyujfkf' })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(404);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('No records of this user exist on our database.');
        done();
      });
  });
});

describe('Login an existing user', () => {
  it('Should return user object and token', (done) => {
    const { email, password } = user;
    request.post(`${apiVersionTwo}user/login`)
      .send({ email, password })
      .end(async (error, response) => {
        user.token = response.body.data.token;
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.user.password).to.undefined;
        await expect(response.body.data.user.email).to.equal(email);
        done();
      });
  });
});

/**
 * ********************************************************************************
 * Tests for incidents follows
 * ********************************************************************************
 */

describe('Create an incident without user token', () => {
  it('Should return an error', (done) => {
    const {
      title, location, comment, type,
    } = redFlag;
    request.post(`${apiVersionTwo}incident/create`)
      .send({
        title, location, comment, type,
      })
      .set({ 'x-auth': '' })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Provide auth token');
        done();
      });
  });
});

describe('Create an incident without required details', () => {
  it('Should return an error', (done) => {
    request.post(`${apiVersionTwo}incident/create`)
      .send({})
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The following: type, location, title, comment are not provided.');
        done();
      });
  });
});


describe('Create an incident with numbers', () => {
  it('Should return an error', (done) => {
    request.post(`${apiVersionTwo}incident/create`)
      .send({
        title: 83974, location: 5367, comment: 4789, type: 5345,
      })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The following: type, location, title, comment should all be strings');
        done();
      });
  });
});

describe('Create an incident with numbers as comment', () => {
  it('Should return an error', (done) => {
    const { title, location, type } = redFlag;
    request.post(`${apiVersionTwo}incident/create`)
      .send({
        title, location, comment: '467859', type,
      })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Comment can not contain just numbers');
        done();
      });
  });
});

describe('Create an incident with unrecognized type', () => {
  it('Should return an error', (done) => {
    const { title, location, comment } = redFlag;
    request.post(`${apiVersionTwo}incident/create`)
      .send({
        title, location, comment, type: 'Asgardian',
      })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The incident type selected is not recogized. Please choose either a red-flag or intervention');
        done();
      });
  });
});

describe('Create an incident with a status other than draft', () => {
  it('Should return an error', (done) => {
    const {
      title, location, comment, type,
    } = redFlag;
    request.post(`${apiVersionTwo}incident/create`)
      .send({
        title, location, comment, type, status: 'under-investigation',
      })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('You can\'t create an incident with your selected status.');
        done();
      });
  });
});

describe('Create an incident: a red-flag', () => {
  it('Should create a red-flag', (done) => {
    const {
      title, location, comment, type,
    } = redFlag;
    request.post(`${apiVersionTwo}incident/create`)
      .send({
        title, location, comment, type,
      })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(201);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.status).to.equal('draft');
        await expect(response.body.data.createdBy).to.equal(user.id);
        await expect(response.body.data.type).to.equal(type);
        done();
      });
  });
});

describe('Create an incident: an intervention', () => {
  it('Should create an intervention', (done) => {
    const {
      title, location, comment, type,
    } = intervention;
    request.post(`${apiVersionTwo}incident/create`)
      .send({
        title, location, comment, type,
      })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(201);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.status).to.equal('draft');
        await expect(response.body.data.createdBy).to.equal(user.id);
        await expect(response.body.data.type).to.equal(type);
        done();
      });
  });
});

describe('Get all incidents', () => {
  it('Should return all incidents', (done) => {
    request.get(`${apiVersionTwo}incidents`)
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.rowCount).to.equal(2);
        done();
      });
  });
});

describe('Get a list of one user\'s incidents without a token', () => {
  it('Should return an error', (done) => {
    request.get(`${apiVersionTwo}user/incidents`)
      .set({ 'x-auth': '' })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Provide auth token');
        done();
      });
  });
});

// describe('Get a list of one user\'s incidents with ', () => {
//   it('Should return an error', (done) => {
//     request.get(`${apiVersionTwo}user/incidents`)
//       .set({ 'x-auth': '' })
//       .end(async (error, response) => {
//         await expect(response.body.status).to.equal(400);
//         await expect(typeof (response.body)).to.equal('object');
//         await expect(response.body.error).to.equal('Provide auth token');
//         done();
//       });
//   });
// });
