import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const options = [
  { value: 'light',  label: 'Light',  icon: '☀️' },
  { value: 'dark',   label: 'Dark',   icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
]

export default function ThemeToggle({ compact = false }) {
  const { theme, setTheme, isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = options.find(o => o.value === theme) || options[1]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        title="Change theme"
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${isDark
            ? 'text-slate-400 hover:text-white hover:bg-white/5 border border-white/10'
            : 'text-slate-600 hover:text-slate-900 hover:bg-black/5 border border-black/10'
          }`}
      >
        <span className="text-base leading-none">{current.icon}</span>
        {!compact && <span className="hidden sm:inline">{current.label}</span>}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className={`absolute right-0 top-full mt-2 w-36 rounded-xl border shadow-2xl overflow-hidden z-50
          ${isDark
            ? 'bg-[#0A1020] border-white/10'
            : 'bg-white border-black/10'
          }`}>
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setTheme(opt.value); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                ${theme === opt.value
                  ? isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                  : isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'
                }`}
            >
              <span className="text-base">{opt.icon}</span>
              <span className="font-medium">{opt.label}</span>
              {theme === opt.value && (
                <svg className="w-3.5 h-3.5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
