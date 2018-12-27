/* eslint-disable no-console */
const pg = require('pg');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const password = require('../config/password');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const connectionString = process.env.DATABASE_URL || `postgres://thislekan:${password}@localhost:5432/ireporter`;

const client = new pg.Pool({ connectionString });
client.connect(() => console.log('connected to db'));

const createUserTable = () => {
  const queryTextforUsers = `CREATE TABLE IF NOT EXISTS
  users(
    id UUID PRIMARY KEY NOT NULL,
    email VARCHAR(25) NOT NULL UNIQUE,
    password VARCHAR(225) NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "otherNames" TEXT,
    "isAdmin" BOOLEAN default FALSE,
    "phoneNumber" INT,
    "userName" VARCHAR(10)
  )`;

  client.query(queryTextforUsers)
    .then(() => {
      client.end();
    })
    .catch(() => {
      client.end();
    });
};

const createAdmin = () => {
  const salt = bcrypt.genSaltSync(10);
  const hashedpassword = bcrypt.hashSync('admin_super_user', salt);

  const text = `INSERT INTO
    Users(id, email, "lastName", "firstName", password, "isAdmin") VALUES($1, $2, $3, $4, $5, $6)`;
  const values = [
    uuid(),
    'admin@email.com',
    'Admin',
    'User',
    hashedpassword,
    true,
  ];
  client.query(text, values)
    .then(() => {
      client.end();
    })
    .catch(() => {
      client.end();
    });
};

const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS Users';

  client.query(queryText)
    .then(() => {
      client.end();
    })
    .catch(() => {
      client.end();
    });
};

const createIncidentTable = () => {
  const queryTextforIncidents = `CREATE TABLE IF NOT EXISTS
  Incidents(
    id UUID PRIMARY KEY NOT NULL,
    "createdBy" UUID NOT NULL,
    "createdOn" BIGINT NOT NULL,
    creator TEXT,
    "updatedOn" BIGINT,
    title VARCHAR(75) NOT NULL,
    type TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    status TEXT DEFAULT 'draft',
    comment TEXT,
    Images TEXT[],
    Videos TEXT[],
    FOREIGN KEY ("createdBy") REFERENCES users (id) ON DELETE CASCADE
  )`;

  client.query(queryTextforIncidents)
    .then(() => {
      client.end();
    })
    .catch(() => {
      client.end();
    });
};

const dropIncidentTable = () => {
  const queryText = 'DROP TABLE IF EXISTS Incidents';

  client.query(queryText)
    .then(() => {
      client.end();
    })
    .catch(() => {
      client.end();
    });
};
const insertAdminIntoTable = () => createAdmin();

const createAllTables = () => {
  createUserTable();
  createIncidentTable();
  insertAdminIntoTable();
};

const dropAllTables = () => {
  dropIncidentTable();
  dropUserTable();
};

module.exports = {
  createUserTable,
  createIncidentTable,
  createAdmin,
  dropUserTable,
  dropIncidentTable,
  createAllTables,
  dropAllTables,
  insertAdminIntoTable,
};

require('make-runnable');
