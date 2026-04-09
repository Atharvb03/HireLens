import React, { useState } from 'react'
import HRDashboard from './pages/HRDashboard'
import CandidateUpload from './pages/CandidateUpload'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div>
      <nav className="navbar">
        <h1>AI Resume Matcher</h1>
        <div className="navbar-links">
          <button onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'active' : ''}>Home</button>
          <button onClick={() => setCurrentPage('hr')} className={currentPage === 'hr' ? 'active' : ''}>HR Dashboard</button>
          <button onClick={() => setCurrentPage('candidate')} className={currentPage === 'candidate' ? 'active' : ''}>Upload Resume</button>
        </div>
      </nav>

      {currentPage === 'home' && (
        <div className="container">
          <div className="card" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2>Welcome to AI Resume Matcher</h2>
            <p style={{ fontSize: '1.1rem', color: '#7f8c8d', marginTop: '1rem' }}>
              An intelligent system that matches resumes with job descriptions using NLP
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => setCurrentPage('hr')} style={{ padding: '1rem 2rem' }}>
                HR Dashboard
              </button>
              <button className="btn btn-success" onClick={() => setCurrentPage('candidate')} style={{ padding: '1rem 2rem' }}>
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'hr' && <HRDashboard />}
      {currentPage === 'candidate' && <CandidateUpload />}
    </div>
  )
}

export default App
