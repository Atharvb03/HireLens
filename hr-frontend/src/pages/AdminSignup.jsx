import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminService } from '../services/adminService';

const AdminSignup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', companyName: '', role: 'admin' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await adminService.signup(formData);
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminData', JSON.stringify(response.admin));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Signup</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          <input type="text" placeholder="Company Name" className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />
          <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 transition">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="text-purple-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
