import express from 'express';
import dontenv from 'dotenv';
import { sql } from './config/db.js';

dontenv.config();

const PORT = process.env.PORT;

const app = express();

// middleware
app.use(express.json());

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
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

app.post('/api/transactions', async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !amount || !category || amount === undefined) {
      return res.status(400).json({ message: 'All fields are requried' });
    }

    const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
    `;

    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log('Error creating the transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server is up and running on port:', PORT);
  });
});
