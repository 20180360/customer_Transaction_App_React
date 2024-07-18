import express from 'express';
import fetch from 'node-fetch';
const app = express();
const PORT = 3000;

app.get('/data', async (req, res) => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/20180360/customer_transaction_db_json_server/master/json/db.json'
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});