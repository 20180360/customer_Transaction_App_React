export const fetchData = async () => {
    try {
      const response = await fetch("https://raw.githubusercontent.com/20180360/customer_transaction_db_json_server/master/json/db.json");
      const data = await response.json();
      const customers = data.customers;
      const transactions = data.transactions;
      return { customers, transactions };
    } catch (error) {
      console.error('Error fetching data:', error);
      return { customers: [], transactions: [] };
    }
  };