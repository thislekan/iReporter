/* eslint-disable no-console */
// import pg from 'pg';
const pg = require('pg');
const dotEnv = require('../config/config');

process.env.NODE_ENV = dotEnv.NODE_ENV;

const connectionString = dotEnv.DATABASE_URL;

const client = new pg.Client(connectionString);

client.connect(() => console.log('connected to db'));

const createUserTable = () => {
  console.log('create table');
  const queryTextforUsers = `CREATE TABLE IF NOT EXISTS
  users(
    id UUID PRIMARY KEY NOT NULL,
    email VARCHAR(25) NOT NULL UNIQUE,
    fullname TEXT NOT NULL,
    password VARCHAR(225) NOT NULL,
    lastname TEXT,
    firstname TEXT,
    othernames TEXT,
    isAdmin BOOLEAN default FALSE,
    phoneNumber INT,
    username VARCHAR(10)
  )`;

  client.query(queryTextforUsers)
    .then((res) => {
      console.log(res);
      client.end();
    })
    .catch((err) => {
      console.log(err);
      client.end();
    });
};

const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS Users';

  client.query(queryText)
    .then((res) => {
      console.log(res);
      client.end();
    })
    .catch((err) => {
      console.log(err);
      client.end();
    });
};

const createIncidentTable = () => {
  const queryTextforIncidents = `CREATE TABLE IF NOT EXISTS
  Incidents(
    id UUID PRIMARY KEY NOT NULL,
    createdBy UUID NOT NULL,
    createdOn BIGINT NOT NULL,
    creator TEXT,
    updatedOn BIGINT,
    title VARCHAR(75) NOT NULL,
    type TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    status TEXT DEFAULT 'draft',
    comment TEXT,
    Images TEXT[],
    Videos TEXT[],
    FOREIGN KEY (createdBy) REFERENCES users (id) ON DELETE CASCADE
  )`;

  client.query(queryTextforIncidents)
    .then((res) => {
      console.log(res);
      client.end();
    })
    .catch((err) => {
      console.log(err);
      client.end();
    });
};

const dropIncidentTable = () => {
  const queryText = 'DROP TABLE IF EXISTS Incidents';

  client.query(queryText)
    .then((res) => {
      console.log(res);
      client.end();
    })
    .catch((err) => {
      console.log(err);
      client.end();
    });
};

const createAllTables = () => {
  createUserTable();
  createIncidentTable();
};

const dropAllTables = () => {
  dropUserTable();
  dropIncidentTable();
};

// export default {
//   createUserTable,
//   createIncidentTable,
//   dropUserTable,
//   dropIncidentTable,
//   createAllTables,
//   dropAllTables,
// };

module.exports = {
  createUserTable,
  createIncidentTable,
  dropUserTable,
  dropIncidentTable,
  createAllTables,
  dropAllTables,
};

require('make-runnable');
