
import React, { useState, useEffect } from 'react';
import { fetchData } from './api';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
export default function App() {
const [customers, setCustomers] = useState([]);
const [transactions, setTransactions] = useState([]);
const [filterName, setFilterName] = useState('');
const [filterAmount, setFilterAmount] = useState('');
const [tableData, setTableData] = useState([]);
const [graph, setGraph] = useState(false)
const [selectedCustomer, setSelectedCustomer] = useState(null);
useEffect(() => {
const getData = async () => {
const data = await fetchData();
setCustomers(data.customers);
setTransactions(data.transactions);

};
getData();
}, []);

useEffect(() => {
applyFilters();
}, [filterName, filterAmount, transactions, customers]);

const applyFilters = () => {
  const filteredData = transactions.filter((transaction) => {
    const customer = customers.find((c) => c.id === transaction.customer_id);
    const customerName = customer ? customer.name.toLowerCase() : '';
    const amount = parseFloat(filterAmount);
    return (
      (!filterName || customerName.includes(filterName.toLowerCase())) &&
      (!filterAmount || transaction.amount >= amount)
    );
  });
 
  
  setTableData(filteredData );

};

const handleFilterNameChange = (event) => {
setFilterName(event.target.value);
};

const handleFilterAmountChange = (event) => {
setFilterAmount(event.target.value);
};
const handleSelectCustomer = (customerId) => {
  setSelectedCustomer(customers.find(customer => customer.id == parseInt(customerId)));
  setGraph(true);
};

return (
<div>
<h1 className=' font-bold text-3xl'>Customer Transactions</h1>
<table className="m-auto bg-white shadow-md rounded-lg">
  <thead className="bg-gray-200">
    <tr>
      <th className="py-2 px-4">Customer ID</th>
      <th className="py-2 px-4">Name</th>
      <th className="py-2 px-4">Date</th>
      <th className="py-2 px-4">Amount</th>
    </tr>
  </thead>
  <tbody>
    {tableData.map((transaction) => {
      const customer = customers.find((c) => c.id === transaction.customer_id);
      return (
        <tr key={transaction.id} className="border-b">
          <td className="py-2 px-4">{transaction.customer_id}</td>
          <td className="py-2 px-4">{customer ? customer.name : ''}</td>
          <td className="py-2 px-4">{transaction.date}</td>
          <td className="py-2 px-4">{transaction.amount}</td>
        </tr>
      );
    })}
  </tbody>
</table>
<br />
<div class="flex flex-wrap items-center">

<label className='p-4' htmlFor="filterName">Filter by Name:</label>
<input className=' border-2 rounded  ' type="text" id="filterName"  value={filterName} onChange={handleFilterNameChange} />
<br />
<label className='p-4'  htmlFor="filterAmount">Filter by Amount:</label>
<input className=' border-2 rounded '   type="number" id="filterAmount" value={filterAmount}  />
<select onChange={handleFilterAmountChange} >
<option value="">None</option>
{transactions.map(transaction => (
            <option key={transaction.amount} value={transaction.amount}>{transaction.amount}</option>
          ))}

</select>
<br />
</div>
<div className="mt-4 p-4 bg-white shadow rounded-lg">
        <label className="block mb-2 text-lg">Select customer for chart:</label>
        <select
          className="block w-full p-2 border border-gray-300 rounded"           
          value={selectedCustomer ? selectedCustomer.id : ''} 
          onChange={(e) => handleSelectCustomer(e.target.value)}
        >
          <option value="">None</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>{customer.name}</option>
          ))}
        </select>
       
        {selectedCustomer && (
        <div>
          <h2 className='py-4 font-bold text-lg'>Selected Customer: {selectedCustomer.name}</h2>
          <button onClick={() => setSelectedCustomer(null)} className=' rounded-lg bg-gray-200 p-2 '>Clear Selection</button>
              <CanvasJSChart
                options={{
                  animationEnabled: true,
                  theme: 'light2',
                  title: {
                    text: 'Total Transaction Amount per Day',
                  },
                  data: [
                    {
                      type: 'line',
                      // dataPoints: chartData,
                      dataPoints: transactions
                      .filter((transaction) => transaction.customer_id === selectedCustomer.id)
                      .map((transaction) => ({
                        x: new Date(transaction.date),
                        y: transaction.amount,
                      })),
                    },
                  ],
                }}
              />

        </div>
      )}
       </div>
<br />
</div>
)
}