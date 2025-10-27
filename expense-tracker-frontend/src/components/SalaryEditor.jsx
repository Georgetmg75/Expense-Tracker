import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SalaryEditor({ totalSalary, setTotalSalary, budgetTables }) {
  const [editing, setEditing] = useState(totalSalary === 0);
  const [inputValue, setInputValue] = useState(totalSalary.toString());

  const handleSave = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setTotalSalary(value);
      setEditing(false);
    }
  };

  // Calculate monthly expenses from budgetTables
  const monthlyExpenses = Array(12).fill(0); // Jan to Dec

  Object.values(budgetTables).forEach(category => {
    category.expenses.forEach(exp => {
      const date = new Date(exp.date);
      const month = date.getMonth(); // 0 = Jan, 11 = Dec
      monthlyExpenses[month] += exp.amount;
    });
  });

  const remainingByMonth = monthlyExpenses.map(exp => totalSalary - exp);

  const salaryTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Remaining Balance',
        data: remainingByMonth,
        fill: true,
        backgroundColor: 'rgba(34,197,94,0.2)',
        borderColor: '#22c55e',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto mb-6 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Total Monthly Salary (₹)
      </label>

      {editing ? (
        <div className="flex gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Enter your salary"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={handleSave}
          >
            Add
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">₹{totalSalary}</span>
          <button
            className="text-blue-600 dark:text-blue-400 hover:underline"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <button
            className="text-red-600 dark:text-red-400 hover:underline"
            onClick={() => setTotalSalary(0)}
          >
            Delete
          </button>
        </div>
      )}

      {/* Line Chart */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow transition-colors duration-300 h-72">
        <Line
          data={salaryTrendData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: {
                ticks: { color: '#888' },
              },
              y: {
                ticks: { color: '#888' },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
