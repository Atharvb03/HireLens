import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminService } from '../services/adminService';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await adminService.login(credentials);
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminData', JSON.stringify(response.admin));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
