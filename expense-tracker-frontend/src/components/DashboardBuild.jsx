// src/components/DashboardBuild.jsx
import { useRef, forwardRef, useImperativeHandle } from 'react';
import DonutChart from './DonutChart';
import SalaryEditor from './SalaryEditor';
import CategoryGrid from './CategoryGrid';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';
import CategoryBudgetEditor from './CategoryBudgetEditor';

const DashboardBuild = forwardRef(({
  categories,
  budgetTables,
  totalSalary,
  setTotalSalary,
  selectedCategory,
  categoryBudgetInput,
  setCategoryBudgetInput,
  handleSetCategoryBudget,
  handleCategoryClick,
  handleDeleteCategoryBudget,
  expenseForms,
  handleExpenseChange,
  handleExpenseAdd,
  editState,
  setEditState,
  updateExpenseField,
  handleDeleteExpense,
  transactions,
  loading
}, ref) => {
  const budgetRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToBudget: () => {
      if (budgetRef.current) {
        budgetRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">Dashboard</h1>

      {/* Horizontally Divided Top Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Salary Editor */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          <SalaryEditor totalSalary={totalSalary} setTotalSalary={setTotalSalary} />
        </div>

        {/* Right: Donut Chart */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
          <DonutChart budgetTables={budgetTables} totalSalary={totalSalary} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-6">
        {/* Category Icons */}
        <CategoryGrid categories={categories} onClick={handleCategoryClick} />

        {/* Budget Input */}
        {selectedCategory && (
          <div ref={budgetRef} className="max-w-md w-full bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Set Budget for {selectedCategory}</h3>
            <div className="flex gap-2">
              <input
                type="number"
                value={categoryBudgetInput}
                onChange={(e) => setCategoryBudgetInput(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter budget (₹)"
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={handleSetCategoryBudget}
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Category Budget Cards */}
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {Object.entries(budgetTables).map(([category, data]) => (
            <div key={category} className="bg-white shadow rounded p-4">
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
        </div>
      </div>

      {/* Transaction Table */}
      <div className="mt-8">
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
    </div>
  );
});

export default DashboardBuild;
