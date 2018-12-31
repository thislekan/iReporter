/* eslint-disable no-console */
import supertest from 'supertest';
import { expect } from 'chai';
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

const randomUser = {
  firstname: 'Synchronous',
  lastname: 'Javascript',
  email: 'async@await.com',
  password: 'asyncawaitjs',
  token: '',
  id: '',
  isAdmin: false,
};

const admin = {
  email: 'admin@email.com',
  password: 'admin_super_user',
  token: '',
};

const redFlag = {
  title: 'The killings of sex workers',
  location: '0.9876 2.345',
  comment: 'The government needs to take this serious',
  type: 'red-flag',
  id: '',
};

const intervention = {
  title: 'Fuel scarcity in the east',
  location: '6.543 6.1234',
  comment: 'The east suffers too much from scarcity',
  type: 'intervention',
  id: '',
};

const newRedFlag = {
  title: 'Newly created',
  location: '6.6678 6.3245',
  comment: 'hjdshajbdysdn hsb',
  type: 'red-flag',
  id: '',
};

const newIntervention = {
  title: 'Newly created',
  location: '6.6678 6.3245',
  comment: 'hjdshajbdysdn hsb',
  type: 'intervention',
  id: '',
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

describe('Create a user with all required details', () => {
  it('Should create a user', (done) => {
    const {
      email, password, firstname, lastname,
    } = randomUser;
    request.post(`${apiVersionTwo}user/create`)
      .send({
        email, password, lastname, firstname,
      })
      .end(async (error, response) => {
        randomUser.id = response.body.data.user.id;
        await expect(response.body.status).to.equal(201);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.user.lastname).to.equal(lastname);
        await expect(response.body.data.user.password).to.undefined;
        done();
      });
  });
});

describe('Create a user with an existing email', () => {
  it('Should return an error', (done) => {
    const {
      email, password, firstname, lastname,
    } = user;
    request.post(`${apiVersionTwo}user/create`)
      .send({
        email, password, lastname, firstname,
      })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('This email is already in use.');
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

describe('Login random user', () => {
  it('Should return user object and token', (done) => {
    const { email, password } = randomUser;
    request.post(`${apiVersionTwo}user/login`)
      .send({ email, password })
      .end(async (error, response) => {
        randomUser.token = response.body.data.token;
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.user.password).to.undefined;
        await expect(response.body.data.user.email).to.equal(email);
        done();
      });
  });
});

describe('Login an admin user', () => {
  it('Should return user object and token', (done) => {
    const { email, password } = admin;
    request.post(`${apiVersionTwo}user/login`)
      .send({ email, password })
      .end(async (error, response) => {
        admin.token = response.body.data.token;
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

describe('Create an incident with white space', () => {
  it('Should return an error', (done) => {
    request.post(`${apiVersionTwo}incident/create`)
      .send({
        title: '   ',
        location: '    ',
        comment: '   ',
        type: '    ',
        status: '    ',
      })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The following: type, location, title, comment contains just white space.');
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
        redFlag.id = response.body.data.id;
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
        intervention.id = response.body.data.id;
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

describe('Get a list of incidents from user with none', () => {
  it('Should return an empty object', (done) => {
    request.get(`${apiVersionTwo}user/incidents`)
      .set({ 'x-auth': randomUser.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data).to.equal('User yet to report an incident');
        done();
      });
  });
});

describe('Get a list of incidents from user with incidents reported', () => {
  it('Should return a list of incidents', (done) => {
    request.get(`${apiVersionTwo}user/incidents`)
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data[0].createdBy).to.equal(user.id);
        done();
      });
  });
});

describe('Get user incident by type without a token', () => {
  it('Should return an error', (done) => {
    request.get(`${apiVersionTwo}incidents/red-flag`)
      .set({ 'x-auth': '' })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Provide auth token');
        done();
      });
  });
});

describe('Get user incident by type with non-existing type', () => {
  it('Should return an error', (done) => {
    request.get(`${apiVersionTwo}incidents/solution`)
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The incident type is not recognized');
        done();
      });
  });
});

describe('Get user incident by type. Type is a red-flag', () => {
  it('Should return a list of red-flags', (done) => {
    request.get(`${apiVersionTwo}incidents/red-flag`)
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        const { data } = response.body;
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(data['red-flag'].length).to.equal(1);
        await expect(data['red-flag'][0].type).to.equal('red-flag');
        done();
      });
  });
});

describe('Get user incident by type. Type is an intervention', () => {
  it('Should return a list of interventions', (done) => {
    request.get(`${apiVersionTwo}incidents/intervention`)
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        const { data } = response.body;
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(data.intervention.length).to.equal(1);
        await expect(data.intervention[0].type).to.equal('intervention');
        done();
      });
  });
});

describe('Get single incident from User without token', () => {
  it('Should return an error', (done) => {
    request.get(`${apiVersionTwo}incident/red-flag`)
      .set({ 'x-auth': '' })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Provide auth token');
        done();
      });
  });
});

describe('Get single incident from User with invalid id', () => {
  it('Should return an error', (done) => {
    request.get(`${apiVersionTwo}incident/099089`)
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The incident id is invalid.');
        done();
      });
  });
});

describe('Get single incident from User without record', () => {
  it('Should return an error', (done) => {
    request.get(`${apiVersionTwo}incident/${intervention.id}`)
      .set({ 'x-auth': randomUser.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(404);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record you requested for does not exist');
        done();
      });
  });
});

describe('Get an intervention incident from a User', () => {
  it('Should return the intervention incident', (done) => {
    request.get(`${apiVersionTwo}incident/${intervention.id}`)
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.createdBy).to.equal(user.id);
        done();
      });
  });
});

describe('Get a red-flag incident from a User', () => {
  it('Should return the intervention incident', (done) => {
    request.get(`${apiVersionTwo}incident/${redFlag.id}`)
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.createdBy).to.equal(user.id);
        done();
      });
  });
});

describe('Edit a red-flag\'s comment without token', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/comment/${redFlag.id}`)
      .set({ 'x-auth': '' })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Provide auth token');
        done();
      });
  });
});

describe('Edit a red-flag\'s comment with non existing id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/comment/8b67a459-4ff5-32450`)
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record you requested for does not exist');
        done();
      });
  });
});

describe('Edit a red-flag\'s comment without sending comment', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/comment/${redFlag.id}`)
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The comment field is empty');
        done();
      });
  });
});

describe('Edit a red-flag\'s comment without token', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/comment/${redFlag.id}`)
      .send({ comment: '       ' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('You can not post an empty comment');
        done();
      });
  });
});

describe('Edit a red-flag\'s comment with type Number', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/comment/${redFlag.id}`)
      .send({ comment: 8907790 })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Only strings allowed for comment');
        done();
      });
  });
});

describe('Edit a red-flag\'s comment with string of just numbers', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/comment/${redFlag.id}`)
      .send({ comment: '7800436647483' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Comment can not contain just numbers');
        done();
      });
  });
});

describe('Edit a red-flag\'s comment with an intervention id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/comment/${intervention.id}`)
      .send({ comment: '8907790 Christain Dior Denim Flow' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(401);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record you requested is not a red flag');
        done();
      });
  });
});

describe('Edit a red-flag\'s comment with another user id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/comment/${redFlag.id}`)
      .send({ comment: '8907790 Christain Dior Denim Flow' })
      .set({ 'x-auth': randomUser.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(401);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record was not created by this user');
        done();
      });
  });
});

describe('Edit a red-flag\'s comment', () => {
  it('Should return the edited red-flag', (done) => {
    request.patch(`${apiVersionTwo}red-flag/comment/${redFlag.id}`)
      .send({ comment: '8907790 Christain Dior Denim Flow' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.createdBy).to.equal(user.id);
        await expect(response.body.data.comment).to.equal('8907790 Christain Dior Denim Flow');
        done();
      });
  });
});

describe('Edit an intervention\'s comment without token', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/comment/${intervention.id}`)
      .set({ 'x-auth': '' })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Provide auth token');
        done();
      });
  });
});

describe('Edit an intervention\'s comment with non existing id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/comment/8b67a459-4ff5-32450`)
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record you requested for does not exist');
        done();
      });
  });
});

describe('Edit an intervention\'s comment without sending comment', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/comment/${intervention.id}`)
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The comment field is empty');
        done();
      });
  });
});

describe('Edit an intervention\'s comment without token', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/comment/${intervention.id}`)
      .send({ comment: '       ' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('You can not post an empty comment');
        done();
      });
  });
});

describe('Edit a intervention\'s comment with type Number', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/comment/${intervention.id}`)
      .send({ comment: 8907790 })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Only strings allowed for comment');
        done();
      });
  });
});

describe('Edit a intervention\'s comment with string of just numbers', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/comment/${intervention.id}`)
      .send({ comment: '7800436647483' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Comment can not contain just numbers');
        done();
      });
  });
});

describe('Edit a intervention\'s comment with an intervention id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/comment/${redFlag.id}`)
      .send({ comment: '8907790 Christain Dior Denim Flow' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(401);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record you requested is not an intervention');
        done();
      });
  });
});

describe('Edit an intervention\'s comment with another user id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/comment/${intervention.id}`)
      .send({ comment: '8907790 Christain Dior Denim Flow' })
      .set({ 'x-auth': randomUser.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(401);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record was not created by this user');
        done();
      });
  });
});

describe('Edit an intervention\'s comment', () => {
  it('Should return the edited intervention', (done) => {
    request.patch(`${apiVersionTwo}intervention/comment/${intervention.id}`)
      .send({ comment: '8907790 Christain Dior Denim Flow' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.createdBy).to.equal(user.id);
        await expect(response.body.data.comment).to.equal('8907790 Christain Dior Denim Flow');
        done();
      });
  });
});

describe('Edit an intervention\'s location without token', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/location/${intervention.id}`)
      .send({ location: '0.990 1.225' })
      .set({ 'x-auth': '' })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Provide auth token');
        done();
      });
  });
});

describe('Edit an intervention\'s location with invalid id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/location/89099-098877`)
      .send({ location: '0.990 1.225' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record you requested for does not exist');
        done();
      });
  });
});

describe('Edit an intervention\'s location with empty string', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/location/${intervention.id}`)
      .send({ location: '' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The location field is missing');
        done();
      });
  });
});

describe('Edit an intervention\'s location with number type', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/location/${intervention.id}`)
      .send({ location: 6.12345 })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Location can only be a string');
        done();
      });
  });
});

describe('Edit an intervention\'s location with white space', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/location/${intervention.id}`)
      .send({ location: '        ' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('You can not post an empty location');
        done();
      });
  });
});

describe('Edit an intervention\'s location with another user id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/location/${intervention.id}`)
      .send({ location: '9.345 6.3566' })
      .set({ 'x-auth': randomUser.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(401);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record was not created by this user');
        done();
      });
  });
});

describe('Edit an intervention\'s location with redflag id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}intervention/location/${redFlag.id}`)
      .send({ location: '9.345 6.3566' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(401);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record you requested is not an intervention');
        done();
      });
  });
});

describe('Edit an intervention\'s location', () => {
  it('Should return the intervention', (done) => {
    request.patch(`${apiVersionTwo}intervention/location/${intervention.id}`)
      .send({ location: '9.345 6.3566' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.type).to.equal('intervention');
        await expect(response.body.data.createdBy).to.equal(user.id);
        await expect(response.body.data.updatedOn).to.not.be.undefined;
        done();
      });
  });
});

describe('Edit an red-flag\'s location without token', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/location/${redFlag.id}`)
      .send({ location: '0.990 1.225' })
      .set({ 'x-auth': '' })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Provide auth token');
        done();
      });
  });
});

describe('Edit an red-flag\'s location with invalid id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/location/89099-098877`)
      .send({ location: '0.990 1.225' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record you requested for does not exist');
        done();
      });
  });
});

describe('Edit an red-flag\'s location with empty string', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/location/${redFlag.id}`)
      .send({ location: '' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The location field is missing');
        done();
      });
  });
});

describe('Edit an red-flag\'s location with number type', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/location/${redFlag.id}`)
      .send({ location: 6.12345 })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Location can only be a string');
        done();
      });
  });
});

describe('Edit an red-flag\'s location with white space', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/location/${redFlag.id}`)
      .send({ location: '        ' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('You can not post an empty location');
        done();
      });
  });
});

describe('Edit an red-flag\'s location with another user id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/location/${redFlag.id}`)
      .send({ location: '9.345 6.3566' })
      .set({ 'x-auth': randomUser.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(401);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record was not created by this user');
        done();
      });
  });
});

describe('Edit an red-flag\'s location with redflag id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}red-flag/location/${intervention.id}`)
      .send({ location: '9.345 6.3566' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(401);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record you requested is not a red flag');
        done();
      });
  });
});

describe('Edit an red-flag\'s location', () => {
  it('Should return the red-flag', (done) => {
    request.patch(`${apiVersionTwo}red-flag/location/${redFlag.id}`)
      .send({ location: '9.345 6.3566' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.type).to.equal('red-flag');
        await expect(response.body.data.createdBy).to.equal(user.id);
        await expect(response.body.data.updatedOn).to.not.be.undefined;
        done();
      });
  });
});

describe('Update an incident status without token', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}update/status`)
      .send({ status: 'ready', id: 'nothing' })
      .set({ 'x-auth': '' })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Provide auth token');
        done();
      });
  });
});

describe('Update an incident status without status', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}update/status`)
      .send({ status: '', id: 'nothing' })
      .set({ 'x-auth': randomUser.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The status is not provided');
        done();
      });
  });
});

describe('Update an incident status without incident id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}update/status`)
      .send({ status: 'ready', id: '' })
      .set({ 'x-auth': randomUser.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The id is not provided');
        done();
      });
  });
});

describe('Update an incident status via user', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}update/status`)
      .send({ status: 'ready', id: redFlag.id })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(401);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Unauthorized request.');
        done();
      });
  });
});

describe('Update an incident status, changing it to draft', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}update/status`)
      .send({ status: 'draft', id: redFlag.id })
      .set({ 'x-auth': admin.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The incident status can not be draft');
        done();
      });
  });
});

describe('Update an incident status to an unrecognized status', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersionTwo}update/status`)
      .send({ status: 'ready', id: redFlag.id })
      .set({ 'x-auth': admin.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The selected status is not recognized.');
        done();
      });
  });
});

describe('Update a red-flag status to under-investigation', () => {
  it('Should return updated red-flag', (done) => {
    request.patch(`${apiVersionTwo}update/status`)
      .send({ status: 'under-investigation', id: redFlag.id })
      .set({ 'x-auth': admin.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.id).to.equal(redFlag.id);
        await expect(response.body.data.status).to.equal('under-investigation');
        done();
      });
  });
});

describe('Update a red-flag status to resolved', () => {
  it('Should return updated red-flag', (done) => {
    request.patch(`${apiVersionTwo}update/status`)
      .send({ status: 'resolved', id: redFlag.id })
      .set({ 'x-auth': admin.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.id).to.equal(redFlag.id);
        await expect(response.body.data.status).to.equal('resolved');
        done();
      });
  });
});

describe('Update a red-flag status to rejected', () => {
  it('Should return updated red-flag', (done) => {
    request.patch(`${apiVersionTwo}update/status`)
      .send({ status: 'rejected', id: redFlag.id })
      .set({ 'x-auth': admin.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.id).to.equal(redFlag.id);
        await expect(response.body.data.status).to.equal('rejected');
        done();
      });
  });
});

describe('Update an intervention status to under-investigation', () => {
  it('Should return updated intervention', (done) => {
    request.patch(`${apiVersionTwo}update/status`)
      .send({ status: 'under-investigation', id: intervention.id })
      .set({ 'x-auth': admin.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.id).to.equal(intervention.id);
        await expect(response.body.data.status).to.equal('under-investigation');
        done();
      });
  });
});

describe('Update an intervention status to resolved', () => {
  it('Should return updated intervention', (done) => {
    request.patch(`${apiVersionTwo}update/status`)
      .send({ status: 'resolved', id: intervention.id })
      .set({ 'x-auth': admin.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.id).to.equal(intervention.id);
        await expect(response.body.data.status).to.equal('resolved');
        done();
      });
  });
});

describe('Update an intervention status to rejected', () => {
  it('Should return updated intervention', (done) => {
    request.patch(`${apiVersionTwo}update/status`)
      .send({ status: 'rejected', id: intervention.id })
      .set({ 'x-auth': admin.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.id).to.equal(intervention.id);
        await expect(response.body.data.status).to.equal('rejected');
        done();
      });
  });
});

describe('Edit a red-flag\'s location after status changed', () => {
  it('Should return the red-flag', (done) => {
    request.patch(`${apiVersionTwo}red-flag/location/${redFlag.id}`)
      .send({ location: '9.345 6.3566' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The rejected record can not be updated');
        done();
      });
  });
});

describe('Edit a red-flag\'s comment after status changed', () => {
  it('Should return the red-flag', (done) => {
    request.patch(`${apiVersionTwo}red-flag/comment/${redFlag.id}`)
      .send({ comment: 'Indescribable comment' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The rejected record can not be updated');
        done();
      });
  });
});

describe('Edit an intervention\'s location after status changed', () => {
  it('Should return the red-flag', (done) => {
    request.patch(`${apiVersionTwo}intervention/location/${intervention.id}`)
      .send({ location: '9.345 6.3566' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The rejected record can not be updated');
        done();
      });
  });
});

describe('Edit an intervention\'s comment after status changed', () => {
  it('Should return the red-flag', (done) => {
    request.patch(`${apiVersionTwo}intervention/comment/${intervention.id}`)
      .send({ comment: 'Ignore that and this' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The rejected record can not be updated');
        done();
      });
  });
});

describe('Create an incident: a red-flag', () => {
  it('Should create a red-flag', (done) => {
    const {
      title, location, comment, type,
    } = newRedFlag;
    request.post(`${apiVersionTwo}incident/create`)
      .send({
        title, location, comment, type,
      })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        newRedFlag.id = response.body.data.id;
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
    } = newIntervention;
    request.post(`${apiVersionTwo}incident/create`)
      .send({
        title, location, comment, type,
      })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        newIntervention.id = response.body.data.id;
        await expect(response.body.status).to.equal(201);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.status).to.equal('draft');
        await expect(response.body.data.createdBy).to.equal(user.id);
        await expect(response.body.data.type).to.equal(type);
        done();
      });
  });
});

describe('Delete an incident without token', () => {
  it('Should return an error', (done) => {
    const { id, type } = newRedFlag;
    request.delete(`${apiVersionTwo}incident/delete`)
      .send({ id, type })
      .set({ 'x-auth': '' })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Provide auth token');
        done();
      });
  });
});

describe('Delete an incident without incident id', () => {
  it('Should return an error', (done) => {
    const { type } = newRedFlag;
    request.delete(`${apiVersionTwo}incident/delete`)
      .send({ id: '', type })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The incident id is not provided');
        done();
      });
  });
});

describe('Delete an incident without incident type', () => {
  it('Should return an error', (done) => {
    const { id } = newRedFlag;
    request.delete(`${apiVersionTwo}incident/delete`)
      .send({ id, type: '' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The incident type is not provided');
        done();
      });
  });
});

describe('Delete an incident with incident type just white spaces', () => {
  it('Should return an error', (done) => {
    const { id } = newRedFlag;
    request.delete(`${apiVersionTwo}incident/delete`)
      .send({ id, type: '    ' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The incident type can not be empty');
        done();
      });
  });
});

describe('Delete an incident without incident type as an object', () => {
  it('Should return an error', (done) => {
    const { id } = newRedFlag;
    request.delete(`${apiVersionTwo}incident/delete`)
      .send({ id, type: { hello: 'world' } })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The incident type can only be a string');
        done();
      });
  });
});

describe('Delete an incident with an invalid incident id', () => {
  it('Should return an error', (done) => {
    const { type } = newRedFlag;
    request.delete(`${apiVersionTwo}incident/delete`)
      .send({ id: '8937830-fbcff-gdye', type })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The record you requested for does not exist');
        done();
      });
  });
});

describe('Delete an incident with an invalid type', () => {
  it('Should return an error', (done) => {
    const { id } = newRedFlag;
    request.delete(`${apiVersionTwo}incident/delete`)
      .send({ id, type: 'fried-rice' })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('No fried-rice record found');
        done();
      });
  });
});

describe('Delete an incident as an admin', () => {
  it('Should return an error', (done) => {
    const { id, type } = newRedFlag;
    request.delete(`${apiVersionTwo}incident/delete`)
      .send({ id, type })
      .set({ 'x-auth': admin.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(403);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('You do not have access to delete the record you requested');
        done();
      });
  });
});

describe('Delete an incident with conflicting type', () => {
  it('Should return an error', (done) => {
    const { type } = redFlag;
    request.delete(`${apiVersionTwo}incident/delete`)
      .send({ id: intervention.id, type })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(409);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Record requested is a intervention and not a red-flag');
        done();
      });
  });
});


describe('Delete an incident with status not draft', () => {
  it('Should return an error', (done) => {
    const { id, type } = redFlag;
    request.delete(`${apiVersionTwo}incident/delete`)
      .send({ id, type })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(400);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('The requested record can not be deleted');
        done();
      });
  });
});

describe('Delete an incident', () => {
  it('Should return the deleted incident', (done) => {
    const { id, type } = newIntervention;
    request.delete(`${apiVersionTwo}incident/delete`)
      .send({ id, type })
      .set({ 'x-auth': user.token })
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(200);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.data.id).to.equal(id);
        await expect(response.body.data.createdBy).to.equal(user.id);
        await expect(response.body.data.status).to.equal('draft');
        done();
      });
  });
});

describe('Visit unrecognized endpoint', () => {
  it('Should return an error', (done) => {
    request.delete(`${apiVersionTwo}incidentyul/jjhjbh`)
      .end(async (error, response) => {
        await expect(response.body.status).to.equal(404);
        await expect(typeof (response.body)).to.equal('object');
        await expect(response.body.error).to.equal('Page not found.');
        done();
      });
  });
});
