import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()
  const [hoveredSocial, setHoveredSocial] = useState(null)

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const socialLinks = [
    { name: 'Facebook', icon: 'f', url: '#' },
    { name: 'Twitter', icon: '𝕏', url: '#' },
    { name: 'LinkedIn', icon: 'in', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' }
  ]

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Contact Us', href: '#contact' }
  ]

  const authLinks = [
    { label: 'User Login', href: '/login' },
    { label: 'Admin Login', href: '/login' }
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  HireLens
                </h3>
                <p className="text-xs text-gray-400">Recruitment Intelligence</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              An AI-powered recruitment intelligence platform that helps organizations hire better talent faster with HireLens.
            </p>
            
            {/* Social Media Links */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-300">Follow Us</p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    onMouseEnter={() => setHoveredSocial(social.name)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center text-sm font-bold hover:from-primary hover:to-secondary hover:border-transparent transition-all transform hover:scale-110 group"
                    title={social.name}
                  >
                    <span className="group-hover:text-white">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Authentication Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></span>
              Access Portal
            </h4>
            <ul className="space-y-3">
              {authLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center group text-left"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></span>
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="text-center md:text-left mb-6 md:mb-0">
            <p className="text-gray-400 text-sm">
              © 2026 HireLens. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Transforming recruitment through artificial intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>Made with ❤️ by the HireLens team</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Status</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
