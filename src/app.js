import express from 'express';
import 'dotenv/config';
import { appRouter } from './router/app-router.js';
import pg from 'pg';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json' assert { type: 'json' };

// Custom DATE parser for pg module, see https://github.com/brianc/node-postgres/issues/818
pg.types.setTypeParser(1082, (value) => {
  return value;
});

const port = process.env.PORT;
const app = express();

app
  .use(express.json())
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(appRouter);

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
