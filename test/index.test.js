/* eslint-disable no-console */
import supertest from 'supertest';
import { expect } from 'chai';
// import mlog from 'mocha-logger';
import app from '../server/app';

process.env.NODE_ENV = 'test';

const request = supertest(app);
const apiVersion = '/api/v1/';

const user = {
  firstname: 'Anonymous',
  lastname: 'User',
  othernames: 'Gbeborun',
  phoneNumber: '0908909890',
  email: 'testuser@email.com',
  password: 'test_user_419',
  isAdmin: false,
};

const admin = {
  email: 'admin@email.com',
  password: '123456',
  isAdmin: true,
};

const redFlag = {
  type: 'red-flag',
  createdBy: user.id,
  comment: 'Presence of a comment',
  location: '6.9876 6.23111',
};

describe('Home route', () => {
  it('Should return a proper welcome message', (done) => {
    request.get('/')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(typeof (response.body.message)).to.equal('string');
        expect(response.body.message).to.equal('Welcome to the iReporter service.');
        done();
      });
  });
});

describe('Create user with invalid email', () => {
  it('Should return an error', (done) => {
    user.email = 'young john';
    user.password = '123456';
    request.post(`${apiVersion}user/create`)
      .send(user)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('Email invalid. Please signup with a valid email');
        done();
      });
  });
});

describe('Create user with numbers', () => {
  it('Should return an error', (done) => {
    user.email = 'youngjohn@wicked.com';
    user.password = 123456;
    request.post(`${apiVersion}user/create`)
      .send(user)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('The password needs to be 6 or more characters and also a string');
        done();
      });
  });
});

describe('Create user with strings lesser than 6', () => {
  it('Should return an error', (done) => {
    user.email = 'youngjohn@wicked.com';
    user.password = '1236';
    request.post(`${apiVersion}user/create`)
      .send(user)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('The password needs to be 6 or more characters and also a string');
        done();
      });
  });
});

describe('Create user without email and password', () => {
  it('Should return an error', (done) => {
    user.email = '';
    user.password = '';
    request.post(`${apiVersion}user/create`)
      .send(user)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('Email and password are required.');
        done();
      });
  });
});

describe('Create user with required details', () => {
  it('Should return user data', (done) => {
    user.email = 'youngjohn@onthebeat.com';
    user.password = 'lmnopqrst';
    request.post(`${apiVersion}user/create`)
      .send(user)
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(typeof (response.body.data)).to.equal('object');
        expect(response.body.data.email).to.equal(user.email);
        done();
      });
  });
});

describe('Create user with existing details', () => {
  it('Should return an error', (done) => {
    user.email = 'youngjohn@onthebeat.com';
    user.password = '123456';
    request.post(`${apiVersion}user/create`)
      .send(user)
      .end((error, response) => {
        expect(response.status).to.equal(403);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('The user already exist.');
        done();
      });
  });
});

describe('Log user in without email and password', () => {
  it('Should return an error', (done) => {
    const email = '';
    const password = '';
    request.post(`${apiVersion}user/login`)
      .send({ email, password })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('Password and Email required to log in.');
        done();
      });
  });
});

describe('Log user in with non exisiting email', () => {
  it('Should return an error', (done) => {
    const email = 'jeezy@yung.com';
    const password = '123456';
    request.post(`${apiVersion}user/login`)
      .send({ email, password })
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('This user does not exist');
        done();
      });
  });
});

describe('Log user in with wrong password', () => {
  it('Should return an error', (done) => {
    const email = 'youngjohn@onthebeat.com';
    const password = '123456';
    request.post(`${apiVersion}user/login`)
      .send({ email, password })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('The email or password is incorrect');
        done();
      });
  });
});

describe('Log user in with exisiting email', () => {
  it('Should return the user object', (done) => {
    const email = 'youngjohn@onthebeat.com';
    const password = 'lmnopqrst';
    request.post(`${apiVersion}user/login`)
      .send({ email, password })
      .end((error, response) => {
        user.id = response.body.data.user.id;
        expect(response.status).to.equal(200);
        expect(typeof (response.body.data.user)).to.equal('object');
        expect(response.body.data.user.email).to.equal(email);
        done();
      });
  });
});

describe('Create a red flag with invalid userId', () => {
  it('Should return an error', (done) => {
    request.post(`${apiVersion}red-flags`)
      .send(redFlag)
      .set('userid', 9008900)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('User does not exist on the database.');
        done();
      });
  });
});

describe('Create an intervention', () => {
  it('Should return an error', (done) => {
    redFlag.type = 'intervention';
    request.post(`${apiVersion}red-flags`)
      .send(redFlag)
      .set('userid', user.id)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('Unable to create red-flag record. This endpoint only creates red-flags.');
        done();
      });
  });
});

describe('Create a red-flag with valid data', () => {
  it('Should return an error', (done) => {
    redFlag.type = 'red-flag';
    request.post(`${apiVersion}red-flags`)
      .send(redFlag)
      .set('userid', user.id)
      .end((error, response) => {
        redFlag.id = response.body.data.redFlag.id;
        expect(response.status).to.equal(201);
        expect(typeof (response.body.data)).to.equal('object');
        expect(response.body.data.redFlag.createdBy).to.equal(user.id);
        done();
      });
  });
});

describe('Create an admin with required details', () => {
  it('Should return admin data', (done) => {
    request.post(`${apiVersion}user/create`)
      .send(admin)
      .end((error, response) => {
        admin.id = response.body.data.userId;
        // mlog.log(admin.id);
        expect(response.status).to.equal(201);
        expect(typeof (response.body.data)).to.equal('object');
        expect(response.body.data.email).to.equal(admin.email);
        done();
      });
  });
});

describe('Get all red-flags with invalid userId', () => {
  it('Should return an error', (done) => {
    request.get(`${apiVersion}red-flags`)
      .set('userid', 890340)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('No record of user found in our database.');
        done();
      });
  });
});

describe('Get all red-flags with valid userId', () => {
  it('Should return all red-flags created by user', (done) => {
    request.get(`${apiVersion}red-flags`)
      .set('userid', user.id)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(typeof (response.body.data.redFlags.length)).to.equal('number');
        expect(response.body.data.redFlags.length).to.equal(1);
        expect(response.body.data.redFlags[0].createdBy).to.equal(user.id);
        done();
      });
  });
});

describe('Get all red-flags with valid adminId', () => {
  it('Should return all red-flags created by user', (done) => {
    request.get(`${apiVersion}red-flags`)
      .set('userid', admin.id)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(typeof (response.body.data.redFlags.length)).to.equal('number');
        expect(response.body.data.redFlags.length).to.equal(3);
        expect(response.body.data.redFlags[0].createdBy).to.equal(user.id);
        done();
      });
  });
});

describe('Get a red-flag with invalid Id', () => {
  it('Should return an error', (done) => {
    request.get(`${apiVersion}red-flags/909009`)
      .set('userid', admin.id)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('Red-flag record with ID: 909009 not found.');
        done();
      });
  });
});

describe('Get a red-flag using admin account', () => {
  it('Should return an error', (done) => {
    request.get(`${apiVersion}red-flags/${redFlag.id}`)
      .set('userid', admin.id)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(typeof (response.body.data)).to.equal('object');
        expect(response.body.data.id).to.equal(redFlag.id);
        expect(response.body.data.createdBy).to.equal(user.id);
        done();
      });
  });
});

describe('Get a red-flag with invalid userId', () => {
  it('Should return an error', (done) => {
    request.get(`${apiVersion}red-flags/${redFlag.id}`)
      .set('userid', 8908909)
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('User not found.');
        done();
      });
  });
});

describe('Get a red-flag with another userId', () => {
  it('Should return an error', (done) => {
    request.get(`${apiVersion}red-flags/${redFlag.id}`)
      .set('userid', 56789)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('You are not authorized to view this record.');
        done();
      });
  });
});

describe('Get a red-flag with valid usreid', () => {
  it('Should return a red-flag', (done) => {
    request.get(`${apiVersion}red-flags/${redFlag.id}`)
      .set('userid', user.id)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(typeof (response.body.data)).to.equal('object');
        expect(response.body.data.createdBy).to.equal(user.id);
        done();
      });
  });
});

describe('Edit a red-flag location with invalid userId', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersion}red-flags/${redFlag.id}/location`)
      .set('userid', 487472)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('This user does not exist in our records.');
        done();
      });
  });
});

describe('Edit a red-flag location with invalid id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersion}red-flags/540000/location`)
      .set('userid', user.id)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('No record with this ID: 540000 found.');
        done();
      });
  });
});

redFlag.status = 'rejected';
describe('Edit a red-flag location with status other than draft', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersion}red-flags/${redFlag.id}/location`)
      .send({ location: '6.54 6.66' })
      .set('userid', user.id)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('You can not edit a record whose status is rejected');
        done();
      });
  });
});


describe('Edit a red-flag location with status draft', () => {
  it('Should edit the location', (done) => {
    request.patch(`${apiVersion}red-flags/${91020}/location`)
      .send({ location: '6.54 6.66' })
      .set('userid', 56789)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(typeof (response.body.data)).to.equal('object');
        expect(response.body.data.redFlag.createdBy).to.equal(56789);
        expect(response.body.message).to.equal('Updated red-flag record\'s location');
        done();
      });
  });
});

describe('Edit a red-flag comment with invalid userId', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersion}red-flags/${redFlag.id}/comment`)
      .set('userid', 487472)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('This user does not exist in our records.');
        done();
      });
  });
});

describe('Edit a red-flag comment with invalid id', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersion}red-flags/540000/comment`)
      .set('userid', user.id)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('No record with this ID: 540000 found.');
        done();
      });
  });
});

describe('Edit a red-flag comment with status other than draft', () => {
  it('Should return an error', (done) => {
    request.patch(`${apiVersion}red-flags/${redFlag.id}/comment`)
      .send({ comment: 'Brutal killings by police in Oshodi' })
      .set('userid', user.id)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('You can not edit a record whose status is rejected');
        done();
      });
  });
});

describe('Edit a red-flag location with status draft', () => {
  it('Should edit the location', (done) => {
    request.patch(`${apiVersion}red-flags/${91020}/comment`)
      .send({ location: '6.54 6.66' })
      .set('userid', 56789)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(typeof (response.body.data)).to.equal('object');
        expect(response.body.data.redFlag.createdBy).to.equal(56789);
        expect(response.body.message).to.equal('Updated red-flag record\'s comment');
        done();
      });
  });
});

describe('Delete a red-flag with invalid userId', () => {
  it('Should return an error', (done) => {
    request.delete(`${apiVersion}red-flags/98908`)
      .set('userid', 65426)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('This user does not exist in our records.');
        done();
      });
  });
});

describe('Delete a red-flag with invalid red-flag id', () => {
  it('Should return an error', (done) => {
    request.delete(`${apiVersion}red-flags/98908`)
      .set('userid', user.id)
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('The record with ID: 98908 you requested was not found.');
        done();
      });
  });
});

describe('Delete a red-flag with another userId', () => {
  it('Should return an error', (done) => {
    request.delete(`${apiVersion}red-flags/${redFlag.id}`)
      .set('userid', 56789)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('You are not authorized to delete this record.');
        done();
      });
  });
});

describe('Delete a red-flag with status rejected', () => {
  it('Should return an error', (done) => {
    request.delete(`${apiVersion}red-flags/${redFlag.id}`)
      .set('userid', user.id)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        expect(typeof (response.body.error)).to.equal('string');
        expect(response.body.error).to.equal('You can not delete a record whose status is rejected');
        done();
      });
  });
});

describe('Delete a red-flag with valid userId and red-flag id', () => {
  it('Should return an error', (done) => {
    request.delete(`${apiVersion}red-flags/91020`)
      .set('userid', 56789)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(typeof (response.body.data)).to.equal('object');
        expect(response.body.message).to.equal('red-flag record has been deleted.');
        done();
      });
  });
});
