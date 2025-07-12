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

app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
        SELECT * from transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.log('Error fetching transactions', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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
    console.log('Error creating the transaction', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const result = await sql`
        DELETE from transactions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.log('Error deleting transaction', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server is up and running on port:', PORT);
  });
});
