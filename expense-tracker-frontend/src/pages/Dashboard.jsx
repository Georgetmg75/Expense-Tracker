import { useEffect, useState } from 'react';
import API from '../services/api';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: '', category: '', amount: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log("Dashboard mounted");
    fetchTransactions();
  }, []);

  
  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      alert('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post('/transactions', form);
      setTransactions(prev => [...prev, res.data]);
      setForm({ date: '', category: '', amount: '' });
    } catch (err) {
      alert('Failed to add transaction');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Dashboard</h1>

      {/* Add Transaction Form */}
      <form onSubmit={handleAdd} className="bg-white shadow rounded p-4 mb-6 space-y-4 max-w-xl mx-auto">
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded text-white font-semibold transition ${
            submitting ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {submitting ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>

      {/* Transaction Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading transactions...</p>
      ) : (
        <div className="bg-white shadow rounded p-4">
          {transactions.length === 0 ? (
            <p className="text-gray-600">No transactions found.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx._id} className="border-t">
                    <td className="px-4 py-2">{tx.date}</td>
                    <td className="px-4 py-2">{tx.category}</td>
                    <td className="px-4 py-2">₹{tx.amount}</td>
                    <td className="px-4 py-2">
                      <button className="text-blue-600 hover:underline mr-2">Edit</button>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
