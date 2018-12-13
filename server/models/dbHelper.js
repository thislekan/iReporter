/* eslint-disable no-console */
import pg from 'pg';
import dotEnv from '../config/config';

const connectionString = dotEnv.DATABASE_URL;

const client = new pg.Pool({ connectionString });
client.connect(() => console.log('welcome to db'));

export default {
  query(text, params) {
    return new Promise((resolve, reject) => {
      client.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
