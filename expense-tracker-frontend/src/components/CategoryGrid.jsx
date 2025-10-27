import React from 'react';

export default function CategoryGrid({ categories, onClick }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6 max-w-4xl mx-auto">
      {categories.map(cat => (
        <button
          key={cat.name}
          onClick={() => onClick(cat.name)}
          className="flex flex-col items-center p-4 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 shadow transition-colors duration-300"
        >
          <span className="text-3xl">{cat.icon}</span>
          <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200 text-center">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
