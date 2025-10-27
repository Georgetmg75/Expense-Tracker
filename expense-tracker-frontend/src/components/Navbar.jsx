import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = storedTheme === 'dark';
    document.documentElement.classList.toggle('dark', prefersDark);
    setIsDark(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    setIsDark(newMode); // ✅ Sync state with DOM
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center text-gray-800 dark:text-gray-100">
      {/* App Name */}
      <Link to="/" className="text-xl font-bold text-green-900 dark:text-green-400 hover:text-green-600">
        Expense Tracker
      </Link>
      {/* Navigation Links */}
      <nav className="flex gap-6 font-medium">
        <a href="/dashboard" className="text-xl font-bold text-green-900 dark:text-green-400 hover:text-green-600">Dashboard</a>
        <a href="/register" className="text-xl font-bold text-green-900 dark:text-green-400 hover:text-green-600">Create New Account</a>
        <a href="/login" className="text-xl font-bold text-green-900 dark:text-green-400 hover:text-green-600">Login New Account</a>
      </nav>

      {/* User Info + Dark Mode Toggle */}
      <div className="flex items-center gap-4">
        <span className="text-m">{user?.name || 'Guest'}</span>
        <img
          src={user?.avatar ? user.avatar : '/logo.jpg'}
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
        /> 

        {/* Dark Mode Label */}
        <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>

        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isDark}
            onChange={toggleDarkMode}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-500 dark:peer-focus:ring-green-400 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-600 transition-all"></div>
          <div className="absolute left-1 top-1 bg-white dark:bg-gray-300 w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
        </label>
      </div>
    </header>
  );
}
