// src/pages/Landing.jsx
import { Link } from 'react-router-dom';
import {
  container,
  logo,
  heading,
  subtext,
  button,
  link
} from '../styles/landingStyles';

export default function Landing() {
  return (
    <div className={container}>
      <img src="/logo.jpg" alt="Logo" className={logo} />
      <h1 className={heading}>Welcome to Expense Tracker</h1>
      <p className={subtext}>
        Track your income, budget your spending, and stay financially empowered.
      </p>
      <div className="space-x-4">
        <Link to="/register" className={button}>Get Started</Link>
        <Link to="/login" className={link}>Log In</Link>
      </div>
    </div>
  );
}
