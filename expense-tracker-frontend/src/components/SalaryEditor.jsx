import React, { useState } from 'react';

export default function SalaryEditor({ totalSalary, setTotalSalary }) {
  const [editing, setEditing] = useState(totalSalary === 0);
  const [inputValue, setInputValue] = useState(totalSalary.toString());

  const handleSave = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setTotalSalary(value);
      setEditing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">Total Monthly Salary (₹)</label>
      {editing ? (
        <div className="flex gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter your salary"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSave}
          >
            Add
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">₹{totalSalary}</span>
          <button className="text-blue-600 hover:underline" onClick={() => setEditing(true)}>Edit</button>
          <button className="text-red-600 hover:underline" onClick={() => setTotalSalary(0)}>Delete</button>
        </div>
      )}
    </div>
  );
}
