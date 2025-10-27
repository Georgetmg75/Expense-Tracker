import React from 'react';

export default function ExpenseTable({
  category,
  data,
  isEditing,
  editIndex,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onFieldChange
}) {
  const remaining = data.budget - data.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Note</th>
          <th className="px-4 py-2">Amount</th>
          <th className="px-4 py-2">Actions</th>
          <th className="px-4 py-2 text-right">
            Budget: ₹{data.budget} <br />
            <span className={remaining < 0 ? 'text-red-600' : 'text-green-600'}>
              Remaining: ₹{remaining}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.expenses.length === 0 ? (
          <tr>
            <td colSpan="5" className="px-4 py-2 text-gray-500">No expenses yet.</td>
          </tr>
        ) : (
          data.expenses.map((exp, idx) => {
            const editing = isEditing && editIndex === idx;
            return (
              <tr key={idx} className="border-t">
                {editing ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        value={exp.date}
                        onChange={(e) => onFieldChange(idx, 'date', e.target.value)}
                        className="border px-2 py-1 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={exp.note}
                        onChange={(e) => onFieldChange(idx, 'note', e.target.value)}
                        className="border px-2 py-1 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={exp.amount}
                        onChange={(e) => onFieldChange(idx, 'amount', e.target.value)}
                        className="border px-2 py-1 rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button className="text-green-600 hover:underline mr-2" onClick={onSave}>Save</button>
                      <button className="text-gray-600 hover:underline" onClick={onCancel}>Cancel</button>
                    </td>
                    <td></td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{new Date(exp.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-2">{exp.note}</td>
                    <td className="px-4 py-2">₹{exp.amount}</td>
                    <td className="px-4 py-2">
                      <button className="text-blue-600 hover:underline mr-2" onClick={() => onEdit(idx)}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => onDelete(idx)}>Delete</button>
                    </td>
                    <td></td>
                  </>
                )}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
