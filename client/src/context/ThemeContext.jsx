import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('hl-theme') || 'dark')

  // Resolve 'system' to actual dark/light
  const getResolved = (t) => {
    if (t === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    return t
  }

  const applyTheme = (t) => {
    const resolved = getResolved(t)
    const html = document.documentElement
    html.classList.remove('light', 'dark')
    html.classList.add(resolved)
  }

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem('hl-theme', theme)

    // Listen for system preference changes when in 'system' mode
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => { if (theme === 'system') applyTheme('system') }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const isDark = getResolved(theme) === 'dark'

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
