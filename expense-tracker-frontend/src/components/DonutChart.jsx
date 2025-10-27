import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({ budgetTables, totalSalary }) {
  const categories = Object.keys(budgetTables);
  const expenses = categories.map(cat =>
    budgetTables[cat].expenses.reduce((sum, e) => sum + e.amount, 0)
  );

  const data = {
    labels: categories,
    datasets: [
      {
        data: expenses,
        backgroundColor: [
          '#4ade80', '#60a5fa', '#f472b6', '#facc15', '#a78bfa',
          '#fb923c', '#34d399', '#f87171', '#c084fc', '#2dd4bf'
        ],
        borderWidth: 1,
      },
    ],
  };

  const centerText = {
    id: 'centerText',
    beforeDraw(chart) {
      const { width } = chart;
      const ctx = chart.ctx;
      ctx.save();
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#333';
      ctx.fillText(`Total Salary: ₹${totalSalary}`, width / 2, chart.height / 2);
    },
  };

  return (
    <div className="w-full sm:w-1/2 p-2">
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-md font-semibold mb-2 text-left">Expense Distribution</h3>
        <Doughnut data={data} plugins={[centerText]} />
      </div>
    </div>
  );
}
