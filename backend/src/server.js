import express from 'express';
import dontenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

import transactionsRoute from './routes/transactionsRoute.js';

dontenv.config();

const PORT = process.env.PORT;

const app = express();

// middleware

// Disabling the rateLimiter middleware as it seems to require paid account to use this feature from Upstash
// app.use(rateLimiter);
app.use(express.json());

app.get('/', (request, response) => {
  response.send('Its working');
});

app.use('/api/transactions', transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server is up and running on port:', PORT);
  });
});
