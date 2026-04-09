import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
    setIsOpen(false)
  }

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsOpen(false)
  }

  const handleDashboardClick = () => {
    if (role === 'candidate') {
      navigate('/candidate-dashboard')
    } else if (role === 'recruiter' || role === 'admin') {
      navigate('/recruiter-dashboard')
    }
    setIsOpen(false)
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg' 
        : 'bg-white/95 backdrop-blur-sm shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HireLens
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="px-3 py-2 text-gray-700 hover:text-primary transition font-medium"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, '#about')}
              className="px-3 py-2 text-gray-700 hover:text-primary transition font-medium"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="px-3 py-2 text-gray-700 hover:text-primary transition font-medium"
            >
              Contact Us
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {token ? (
              <>
                <button
                  onClick={handleDashboardClick}
                  className="px-4 py-2 text-blue-300 border-2 border-blue-400 rounded-lg hover:bg-blue-500/10 transition font-semibold"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/candidate-login')}
                  className="px-4 py-2 text-blue-300 border-2 border-blue-400 rounded-lg hover:bg-blue-500/10 transition font-semibold"
                >
                  Candidate Login
                </button>
                <button
                  onClick={() => navigate('/admin-login')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition font-semibold"
                >
                  Admin Login
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 transition"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 border-t border-gray-200' : 'max-h-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50 transition font-medium"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, '#about')}
            className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50 transition font-medium"
          >
            About
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="block px-3 py-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50 transition font-medium"
          >
            Contact Us
          </a>

          <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
            {token ? (
              <>
                <button
                  onClick={handleDashboardClick}
                  className="w-full text-left px-3 py-2 rounded-md text-blue-300 border-2 border-blue-400 hover:bg-blue-500/10 transition font-semibold"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-gray-300 bg-slate-700 hover:bg-slate-600 transition font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/candidate-login')}
                  className="w-full text-left px-3 py-2 rounded-md text-blue-300 border-2 border-blue-400 hover:bg-blue-500/10 transition font-semibold"
                >
                  Candidate Login
                </button>
                <button
                  onClick={() => navigate('/admin-login')}
                  className="w-full text-left px-3 py-2 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg transition font-semibold"
                >
                  Admin Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
