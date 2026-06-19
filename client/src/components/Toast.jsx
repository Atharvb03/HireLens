import { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const styles = {
    success: 'bg-green-500/90 border-green-400',
    error: 'bg-red-500/90 border-red-400',
    info: 'bg-blue-500/90 border-blue-400',
    warning: 'bg-yellow-500/90 border-yellow-400'
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  }

  return (
    <div className={`fixed top-20 right-4 z-50 animate-slide-in-right`}>
      <div className={`${styles[type]} border-2 rounded-lg shadow-2xl p-4 min-w-[300px] max-w-md backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-white font-bold">
            {icons[type]}
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">{message.title}</p>
            {message.body && (
              <p className="text-white/90 text-sm mt-1">{message.body}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
