import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark } = useTheme()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
    setIsOpen(false)
  }

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  const handleDashboardClick = () => {
    if (role === 'candidate') navigate('/candidate-dashboard')
    else if (role === 'recruiter' || role === 'admin') navigate('/recruiter-dashboard')
    setIsOpen(false)
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled
        ? isDark
          ? 'py-2 bg-[#060B18]/90 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'py-2 bg-white/95 backdrop-blur-xl border-b border-black/8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
        : 'py-4 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg blur-md opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">HireLens</span>          </button>

          <div className="hidden md:flex items-center gap-1">
            {[['Home', '#home'], ['About', '#about'], ['Contact', '#contact']].map(([label, href]) => (
              <a key={label} href={href} onClick={(e) => handleNavClick(e, href)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-black/5 ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900'
                }`}>
                {label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {token ? (
              <>
                <button onClick={handleDashboardClick} className={`px-4 py-2 text-sm font-medium rounded-lg transition border ${isDark ? 'text-blue-400 border-blue-500/30 hover:bg-blue-500/10' : 'text-blue-600 border-blue-400/40 hover:bg-blue-50'}`}>Dashboard</button>
                <button onClick={handleLogout} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-black/5'}`}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/candidate-login')} className={`px-4 py-2 text-sm font-medium rounded-lg transition border ${isDark ? 'text-slate-300 border-white/10 hover:bg-white/5 hover:border-white/20' : 'text-slate-700 border-black/10 hover:bg-black/5'}`}>Candidate Login</button>
                <button onClick={() => navigate('/admin-login')} className="px-5 py-2 text-sm bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-lg font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">Admin Login</button>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-80' : 'max-h-0'}`}>
        <div className={`px-4 py-3 space-y-1 backdrop-blur-xl border-t ${
          isDark ? 'bg-[#0A1020]/95 border-white/5' : 'bg-white/98 border-black/8'
        }`}>
          {[['Home', '#home'], ['About', '#about'], ['Contact', '#contact']].map(([label, href]) => (
            <a key={label} href={href} onClick={(e) => handleNavClick(e, href)}
              className={`block px-3 py-2 rounded-lg transition text-sm font-medium ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
              }`}>{label}</a>
          ))}
          <div className="pt-2 border-t border-white/5 space-y-2">
            <div className="px-1 pb-1"><ThemeToggle /></div>
            {token ? (
              <>
                <button onClick={handleDashboardClick} className={`w-full text-left px-3 py-2 rounded-lg transition text-sm font-medium border ${isDark ? 'text-blue-400 border-blue-500/30 hover:bg-blue-500/10' : 'text-blue-600 border-blue-400/30 hover:bg-blue-50'}`}>Dashboard</button>
                <button onClick={handleLogout} className={`w-full text-left px-3 py-2 rounded-lg transition text-sm font-medium ${isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-black/5'}`}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/candidate-login')} className={`w-full text-left px-3 py-2 rounded-lg transition text-sm font-medium border ${isDark ? 'text-slate-300 border-white/10 hover:bg-white/5' : 'text-slate-700 border-black/10 hover:bg-black/5'}`}>Candidate Login</button>
                <button onClick={() => navigate('/admin-login')} className="w-full text-left px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white transition text-sm font-semibold">Admin Login</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
