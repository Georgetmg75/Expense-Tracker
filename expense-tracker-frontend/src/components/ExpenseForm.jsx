import React from 'react';

export default function ExpenseForm({ form, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-wrap gap-4 mb-4">
      <input
        type="date"
        value={form.date}
        onChange={(e) => onChange('date', e.target.value)}
        className="px-4 py-2 border rounded w-full sm:w-auto"
        required
      />
      <input
        type="text"
        placeholder="Note"
        value={form.note}
        onChange={(e) => onChange('note', e.target.value)}
        className="px-4 py-2 border rounded w-full sm:w-auto"
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => onChange('amount', e.target.value)}
        className="px-4 py-2 border rounded w-full sm:w-auto"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add Expense
      </button>
    </form>
  );
}
