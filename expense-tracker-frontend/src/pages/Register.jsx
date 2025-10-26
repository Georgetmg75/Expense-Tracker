// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';


export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/register', { name, email, password });
      navigate('/login'); // ✅ Redirect to login after success on to login
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)} className="input" />
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} className="input" />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} className="input" />
        <button type="submit" className="btn">Register</button>
      </form>
    </div>
  );
}
