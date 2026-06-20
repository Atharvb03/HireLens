import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'
import './index.css'

// Set base URL for all axios requests.
// Uses VITE_API_URL env var if set, otherwise falls back to the Render backend URL.
// In local dev the Vite proxy handles /api/* so relative paths still work.
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '' : 'https://hirelens-t23q.onrender.com')

if (API_BASE) {
  axios.defaults.baseURL = API_BASE
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
