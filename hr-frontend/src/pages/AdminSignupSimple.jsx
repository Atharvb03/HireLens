import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminSignupSimple = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', companyName: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/admin/signup', formData);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminData', JSON.stringify(data.admin));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Signup</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSignup}>
          <input type="text" name="name" placeholder="Full Name" className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.password} onChange={handleChange} required />
          <input type="text" name="companyName" placeholder="Company Name" className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.companyName} onChange={handleChange} required />
          <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 transition">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignupSimple;
