import { useEffect, useState, useRef } from 'react';
import API from '../services/api';
import DashboardBuild from '../components/DashboardBuild';

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
  const dashboardRef = useRef(null);

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

    // Trigger smooth scroll to budget section
    setTimeout(() => {
      dashboardRef.current?.scrollToBudget();
    }, 100);
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
    <DashboardBuild
      ref={dashboardRef}
      categories={categories}
      budgetTables={budgetTables}
      totalSalary={totalSalary}
      setTotalSalary={setTotalSalary}
      selectedCategory={selectedCategory}
      categoryBudgetInput={categoryBudgetInput}
      setCategoryBudgetInput={setCategoryBudgetInput}
      handleSetCategoryBudget={handleSetCategoryBudget}
      handleCategoryClick={handleCategoryClick}
      handleDeleteCategoryBudget={handleDeleteCategoryBudget}
      expenseForms={expenseForms}
      handleExpenseChange={handleExpenseChange}
      handleExpenseAdd={handleExpenseAdd}
      editState={editState}
      setEditState={setEditState}
      updateExpenseField={updateExpenseField}
      handleDeleteExpense={handleDeleteExpense}
      transactions={transactions}
      loading={loading}
    />
  );
}
