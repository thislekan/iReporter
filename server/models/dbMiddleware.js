/* eslint-disable no-console */
import pg from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://thislekan:123phoe5@localhost:5432/ireporter';

const client = new pg.Client(connectionString);
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
