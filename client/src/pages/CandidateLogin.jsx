import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function CandidateLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/auth/login', { email, password, role: 'candidate' })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userId', response.data.user.id)
      localStorage.setItem('email', response.data.user.email)
      localStorage.setItem('role', response.data.user.role)
      navigate('/candidate-dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            HireLens
          </h1>
          <p className="text-gray-400 mb-4">Recruitment Intelligence</p>
          <p className="text-blue-300 font-semibold">Candidate Login</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          Don't have an account? <a href="/candidate-register" className="text-blue-400 hover:text-cyan-400 transition">Register as Candidate</a>
        </p>
      </div>
    </div>
  )
}
