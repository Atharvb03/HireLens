import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const floatingCards = [
  { label: 'Resume Parsed', value: '2.4s', icon: '⚡', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20', top: '8%', left: '-5%', delay: '0s' },
  { label: 'Match Score', value: '94%', icon: '🎯', color: 'from-violet-500/20 to-violet-600/10', border: 'border-violet-500/20', top: '55%', left: '-8%', delay: '1.5s' },
  { label: 'AI Interview', value: 'Live', icon: '🤖', color: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/20', top: '15%', right: '-5%', delay: '0.8s' },
  { label: 'Bias Score', value: '0.0%', icon: '⚖️', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20', top: '65%', right: '-8%', delay: '2s' },
]

const stats = [
  { value: '10x', label: 'Faster Screening', icon: '⚡' },
  { value: '95%', label: 'Accuracy Rate', icon: '🎯' },
  { value: '24/7', label: 'AI Interviews', icon: '🤖' },
]

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const num = parseFloat(target)
        const duration = 1500
        const steps = 40
        const increment = num / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= num) { setCount(num); clearInterval(timer) }
          else setCount(Math.floor(current))
        }, duration / steps)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{isNaN(parseFloat(target)) ? target : count}{suffix}</span>
}

export default function Hero() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-[#060B18]">
      {/* Background layers */}
      <div className="absolute inset-0 node-bg opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#060B18]"></div>

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-[150px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-400 text-sm font-medium">Next-Gen Hiring Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.08]">
              AI-Powered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400">
                Autonomous
              </span>
              <br />Recruitment
            </h1>

            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl">
              HireLens helps HR teams reduce manual effort and identify the best candidates faster. Our platform combines advanced NLP with intelligent automation to transform your recruitment process.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <button
                onClick={() => navigate('/candidate-login')}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[0_0_45px_rgba(59,130,246,0.55)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-xl font-semibold text-slate-300 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/8 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See How It Works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
              {stats.map((s, i) => (
                <div key={i} className="group">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-lg">{s.icon}</span>
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Dashboard Visual */}
          <div className={`hidden lg:flex justify-center items-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative w-full max-w-md">
              {/* Floating cards */}
              {floatingCards.map((card, i) => (
                <div
                  key={i}
                  className={`absolute z-20 px-4 py-3 rounded-xl border ${card.border} bg-gradient-to-br ${card.color} backdrop-blur-md animate-float`}
                  style={{
                    top: card.top,
                    left: card.left,
                    right: card.right,
                    animationDelay: card.delay,
                    animationDuration: `${5 + i}s`
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{card.icon}</span>
                    <div>
                      <div className="text-xs text-slate-400">{card.label}</div>
                      <div className="text-sm font-bold text-white">{card.value}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Main dashboard card */}
              <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.15)]">
                {/* Header bar */}
                <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5 bg-white/3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <div className="flex-1 mx-4 h-5 rounded-md bg-white/5 flex items-center px-3">
                    <span className="text-xs text-slate-500">hirelens.ai/dashboard</span>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-6 space-y-4">
                  {/* Candidate pipeline */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">Candidate Pipeline</span>
                    <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">Live</span>
                  </div>

                  {/* Pipeline stages */}
                  {[
                    { stage: 'Applied', count: 248, pct: 100, color: 'bg-slate-600' },
                    { stage: 'AI Screened', count: 186, pct: 75, color: 'bg-blue-500' },
                    { stage: 'Interviewed', count: 94, pct: 38, color: 'bg-violet-500' },
                    { stage: 'Shortlisted', count: 31, pct: 13, color: 'bg-cyan-500' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">{item.stage}</span>
                        <span className="text-slate-300 font-medium">{item.count}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }}></div>
                      </div>
                    </div>
                  ))}

                  {/* Skill tags */}
                  <div className="pt-2 border-t border-white/5">
                    <div className="text-xs text-slate-500 mb-2">Top Skills Detected</div>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Python', 'Node.js', 'ML', 'AWS', 'SQL'].map((skill) => (
                        <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">{skill}</span>
                      ))}
                    </div>
                  </div>

                  {/* AI Score bar */}
                  <div className="pt-2 border-t border-white/5">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">Top Candidate AI Score</span>
                      <span className="text-emerald-400 font-bold">94 / 100</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[94%] bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow under card */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-blue-600/20 blur-2xl rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
