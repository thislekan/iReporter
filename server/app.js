/* eslint-disable no-console */
import express from 'express';
import morgan from 'morgan';
import routes from './routes/routes';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the iReporter service.',
  });
});

app.use(routes);

export default app;
