import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate'
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/auth/register', formData)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userId', response.data.user.id)
      localStorage.setItem('role', response.data.user.role)
      
      if (response.data.user.role === 'candidate') {
        navigate('/candidate-dashboard')
      } else {
        navigate('/recruiter-dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Join HireLens
          </h1>
          <p className="text-gray-400">Recruitment Intelligence</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Register as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          Already have an account? <a href="/login" className="text-blue-400 hover:text-cyan-400 transition">Login</a>
        </p>
      </div>
    </div>
  )
}
