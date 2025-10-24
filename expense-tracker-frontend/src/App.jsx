import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import jwtDecode from 'jwt-decode';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) throw new Error('Token expired');
    return children;
  } catch {
    return <Navigate to="/login" />;
  }
}

function App() {
  return (
    <div style={{ padding: '2rem', fontSize: '2rem', textAlign: 'center' }}>
      ✅ React is rendering!
    </div>
  );
}

export default App;
