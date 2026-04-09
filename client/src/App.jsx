import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import CandidateLogin from './pages/CandidateLogin'
import AdminLogin from './pages/AdminLogin'
import CandidateRegister from './pages/CandidateRegister'
import AdminRegister from './pages/AdminRegister'
import CandidateDashboard from './pages/CandidateDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import InterviewPage from './pages/InterviewPage'

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  
  if (!token) return <Navigate to="/login" />
  if (requiredRole && role !== requiredRole) return <Navigate to="/" />
  
  return children
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/candidate-login" element={<CandidateLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/candidate-register" element={<CandidateRegister />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute requiredRole="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute requiredRole="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/:token"
          element={
            <ProtectedRoute requiredRole="candidate">
              <InterviewPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}
