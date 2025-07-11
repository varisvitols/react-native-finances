import express from 'express';
import dontenv from 'dotenv';

dontenv.config();

const PORT = process.env.PORT;

const app = express();

app.get('/', (request, response) => {
  response.send('Its working');
});

app.listen(PORT, () => {
  console.log('Server is up and running on port:', PORT);
});
