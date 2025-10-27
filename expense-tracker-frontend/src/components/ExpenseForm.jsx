import React from 'react';

export default function ExpenseForm({ form, onChange, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-wrap gap-4 mb-4 text-gray-800 dark:text-gray-100 transition-colors duration-300"
    >
      <input
        type="date"
        value={form.date}
        onChange={(e) => onChange('date', e.target.value)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded w-full sm:w-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        required
      />
      <input
        type="text"
        placeholder="Note"
        value={form.note}
        onChange={(e) => onChange('note', e.target.value)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded w-full sm:w-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => onChange('amount', e.target.value)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded w-full sm:w-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300"
      >
        Add Expense
      </button>
    </form>
  );
}
