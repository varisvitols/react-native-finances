import { sql } from '../config/db.js';

export async function getTransactionsByUserId(request, response) {
  try {
    const { userId } = request.params;

    const transactions = await sql`
        SELECT * from transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    response.status(200).json(transactions);
  } catch (error) {
    console.log('Error fetching transactions', error);
    response.status(500).json({ message: 'Internal server error' });
  }
}

export async function createTransaction(request, response) {
  try {
    const { title, amount, category, user_id } = request.body;

    if (!title || !amount || !category || amount === undefined) {
      return response.status(400).json({ message: 'All fields are requried' });
    }

    const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
    `;

    console.log(transaction);
    response.status(201).json(transaction[0]);
  } catch (error) {
    console.log('Error creating the transaction', error);
    response.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteTransaction(request, response) {
  try {
    const { id } = request.params;

    if (isNaN(parseInt(id))) {
      return response.status(400).json({ message: 'Invalid transaction ID' });
    }

    const result = await sql`
        DELETE from transactions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return response.status(404).json({ message: 'Transaction not found' });
    }

    response.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.log('Error deleting transaction', error);
    response.status(500).json({ message: 'Internal server error' });
  }
}

export async function getSummaryByUserId(request, response) {
  try {
    const { userId } = request.params;

    const balanceResult = await sql`
        SELECT COALESCE(SUM(amount),0) as balance
        FROM transactions
        WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
        SELECT COALESCE(SUM(amount),0) as income
        FROM transactions
        WHERE user_id = ${userId}
        AND amount > 0
    `;

    const expensesResult = await sql`
        SELECT COALESCE(SUM(amount),0) as expenses
        FROM transactions
        WHERE user_id = ${userId}
        AND amount < 0
    `;

    response.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log('Error getting the summary', error);
    response.status(500).json({ message: 'Internal server error' });
  }
}
