/* eslint-disable no-console */
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'babel-polyfill';
import routes from './routes/routes';
import dbRoutes from './routes/routesWithDb';

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the iReporter service.',
  });
});

app.use(routes);
app.use(dbRoutes);

export default app;
