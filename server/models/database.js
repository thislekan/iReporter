import Client from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/iReporter';
const db = new Client(connectionString);
db.connect();

export default db;
