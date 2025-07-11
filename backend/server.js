import express from 'express';
import dontenv from 'dotenv';
import { sql } from './config/db.js';

dontenv.config();

const PORT = process.env.PORT;

const app = express();

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(2,10) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;

    console.log('Database initialized successfully.');
  } catch (error) {
    console.log('Error initializing database:', error);
    process.exit(1); // 0 for success, 1 for failure
  }
}

app.get('/', (request, response) => {
  response.send('Its working');
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server is up and running on port:', PORT);
  });
});
