import { useEffect, useState } from 'react';
import API from '../services/api';
import CategoryGrid from '../components/CategoryGrid';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import DonutChart from '../components/DonutChart';
import SalaryEditor from '../components/SalaryEditor';
import CategoryBudgetEditor from '../components/CategoryBudgetEditor';

const categories = [
  { name: 'Monthly Bills', icon: '💡' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Groceries', icon: '🥦' },
  { name: 'Health Insurance', icon: '🏥' },
  { name: 'Transport Charges', icon: '🚗' },
  { name: 'Vehicle Repairs', icon: '🔧' },
  { name: 'Appliance Failures/New Purchase', icon: '🧺' },
  { name: 'Savings', icon: '💰' },
  { name: 'Vacation', icon: '🏖️' },
];

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetTables, setBudgetTables] = useState({});
  const [expenseForms, setExpenseForms] = useState({});
  const [editState, setEditState] = useState({ category: null, index: null });
  const [totalSalary, setTotalSalary] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryBudgetInput, setCategoryBudgetInput] = useState('');

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setCategoryBudgetInput(budgetTables[categoryName]?.budget?.toString() || '');
  };

  const handleSetCategoryBudget = () => {
    const value = parseInt(categoryBudgetInput);
    if (!isNaN(value)) {
      setBudgetTables(prev => ({
        ...prev,
        [selectedCategory]: {
          budget: value,
          expenses: prev[selectedCategory]?.expenses || []
        }
      }));
      setExpenseForms(prev => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory] || { date: '', note: '', amount: '' }
      }));
      setSelectedCategory(null);
      setCategoryBudgetInput('');
    }
  };

  const handleDeleteCategoryBudget = (category) => {
    const updated = { ...budgetTables };
    delete updated[category];
    setBudgetTables(updated);
  };

  const handleExpenseChange = (category, field, value) => {
    setExpenseForms(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleExpenseAdd = (e, category) => {
    e.preventDefault();
    const form = expenseForms[category];
    const newExpense = {
      date: form.date,
      note: form.note,
      amount: parseInt(form.amount)
    };
    setBudgetTables(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        expenses: [...prev[category].expenses, newExpense]
      }
    }));
    setExpenseForms(prev => ({
      ...prev,
      [category]: { date: '', note: '', amount: '' }
    }));
  };

  const updateExpenseField = (category, index, field, value) => {
    setBudgetTables(prev => {
      const updatedExpenses = [...prev[category].expenses];
      updatedExpenses[index] = {
        ...updatedExpenses[index],
        [field]: field === 'amount' ? parseInt(value) : value
      };
      return {
        ...prev,
        [category]: {
          ...prev[category],
          expenses: updatedExpenses
        }
      };
    });
  };

  const handleDeleteExpense = (category, index) => {
    setBudgetTables(prev => {
      const updatedExpenses = [...prev[category].expenses];
      updatedExpenses.splice(index, 1);
      return {
        ...prev,
        [category]: {
          ...prev[category],
          expenses: updatedExpenses
        }
      };
    });
  };

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

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Dashboard</h1>

      {/* Chart + Salary Editor Side-by-Side */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-start mb-6 gap-4">
        <DonutChart budgetTables={budgetTables} totalSalary={totalSalary} />
        <SalaryEditor totalSalary={totalSalary} setTotalSalary={setTotalSalary} />
      </div>

      <CategoryGrid categories={categories} onClick={handleCategoryClick} />

      {/* Inline Budget Input with Add Button */}
      {selectedCategory && (
        <div className="max-w-md mx-auto mb-6 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Set Budget for {selectedCategory}</h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={categoryBudgetInput}
              onChange={(e) => setCategoryBudgetInput(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter budget (₹)"
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleSetCategoryBudget}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {Object.entries(budgetTables).map(([category, data]) => (
        <div key={category} className="bg-white shadow rounded p-4 mb-6">
          <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
            {category}
            <CategoryBudgetEditor
              category={category}
              budget={data.budget}
              onEdit={handleCategoryClick}
              onDelete={handleDeleteCategoryBudget}
            />
          </h2>

          <ExpenseForm
            form={expenseForms[category]}
            onChange={(field, value) => handleExpenseChange(category, field, value)}
            onSubmit={(e) => handleExpenseAdd(e, category)}
          />

          <ExpenseTable
            category={category}
            data={data}
            isEditing={editState.category === category}
            editIndex={editState.index}
            onEdit={(index) => setEditState({ category, index })}
            onCancel={() => setEditState({ category: null, index: null })}
            onSave={() => setEditState({ category: null, index: null })}
            onDelete={(index) => handleDeleteExpense(category, index)}
            onFieldChange={(index, field, value) => updateExpenseField(category, index, field, value)}
          />
        </div>
      ))}

      {/* Legacy Transaction Table */}
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
                    <td className="px-4 py-2">
                      {tx.date
                        ? new Date(tx.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>
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