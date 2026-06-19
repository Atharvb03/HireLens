import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Contact Us', href: '#contact' },
  ]

  const authLinks = [
    { label: 'Candidate Login', href: '/candidate-login' },
    { label: 'Admin Login', href: '/admin-login' },
  ]

  const companyLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
  ]

  const socialLinks = [
    { label: 'Facebook', icon: 'f' },
    { label: 'Twitter', icon: '𝕏' },
    { label: 'LinkedIn', icon: 'in' },
    { label: 'Instagram', icon: '📷' },
  ]

  return (
    <footer className="relative bg-[#040810] overflow-hidden">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

      {/* Background */}
      <div className="absolute inset-0 node-bg opacity-20"></div>
      <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-blue-600/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-violet-600/5 rounded-full blur-[100px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 mb-5 group">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg blur-md opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">HireLens</div>
                <div className="text-xs text-slate-600">Recruitment Intelligence</div>
              </div>
            </button>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              An AI-powered recruitment intelligence platform that helps organizations hire better talent faster with HireLens.
            </p>
            <div>
              <div className="text-xs text-slate-600 font-medium uppercase tracking-wider mb-3">Follow Us</div>
              <div className="flex gap-2">
                {socialLinks.map((s, i) => (
                  <a key={i} href="#" title={s.label}
                    className="w-9 h-9 rounded-lg border border-white/8 bg-white/4 flex items-center justify-center text-xs font-bold text-slate-500 hover:text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-violet-600 hover:border-transparent transition-all duration-300 hover:scale-110">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}
                    className="text-slate-500 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Access Portal */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full"></span>
              Access Portal
            </h4>
            <ul className="space-y-3">
              {authLinks.map((link, i) => (
                <li key={i}>
                  <button onClick={() => navigate(link.href)}
                    className="text-slate-500 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group text-left">
                    <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full"></span>
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href}
                    className="text-slate-500 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-slate-600 text-sm">© 2026 HireLens. All rights reserved.</p>
              <p className="text-slate-700 text-xs mt-1">Transforming recruitment through artificial intelligence</p>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-700">
              {['Status', 'Support', 'Documentation'].map((item) => (
                <a key={item} href="#" className="hover:text-slate-400 transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <p className="text-center text-slate-700 text-xs mt-6">Made with ❤️ by the HireLens team</p>
        </div>
      </div>
    </footer>
  )
}
