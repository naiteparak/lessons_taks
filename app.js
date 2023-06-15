import express from 'express';
import 'dotenv/config';
import { appRouter } from './src/router/app-router.js';
import pg from 'pg';

// Custom DATE parser for pg module, see https://github.com/brianc/node-postgres/issues/818
pg.types.setTypeParser(1082, (value) => {
  return value;
});

const port = process.env.PORT;
const app = express();

app.use(express.json()).use(appRouter);

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
