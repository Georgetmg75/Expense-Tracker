// src/pages/Landing.jsx
import { Link } from 'react-router-dom';
import {
  logo,
  heading,
  subtext,
  button,
  link
} from '../styles/landingStyles';

export default function Landing() {
  return (
    <div
      className="fixed inset-0 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* Black tint overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-6 min-h-screen">
        <img src="/logo.jpg" alt="Logo" className={`${logo} mx-auto mb-6`} />
        <h1 className={`${heading} text-white`}>Welcome to Expense Tracker</h1>
        <p className={`${subtext} text-gray-200 max-w-xl mx-auto`}>
          Track your income, budget your spending, and stay financially empowered.
        </p>
        <div className="space-x-4 mt-6">
          <Link to="/register" className={`${button} bg-green-500 hover:bg-green-600 text-white`}>
            Get Started
          </Link>
          <Link to="/login" className={`${link} text-white underline`}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
