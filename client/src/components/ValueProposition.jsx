import React, { useState, useEffect, useRef } from 'react'

const comparisonData = [
  { feature: 'Resume Storage', icon: '📁', traditional: 'Basic file storage', hirelens: 'Intelligent extraction & analysis' },
  { feature: 'Candidate Screening', icon: '🔍', traditional: 'Manual review process', hirelens: 'AI-powered automated screening' },
  { feature: 'Interview Process', icon: '💬', traditional: 'Scheduled by recruiters', hirelens: 'Autonomous AI interviews 24/7' },
  { feature: 'Skill Assessment', icon: '📊', traditional: 'Subjective evaluation', hirelens: 'Objective AI-driven analysis' },
  { feature: 'Bias Mitigation', icon: '⚖️', traditional: 'Prone to human bias', hirelens: 'Fair & objective evaluation' },
  { feature: 'Decision Support', icon: '🎯', traditional: 'Limited insights', hirelens: 'Data-driven recommendations' },
]

const benefits = [
  { title: 'Reduce Recruitment Time', description: 'Cut hiring cycles from weeks to days with automated screening and interviews', icon: '⚡', stat: '70%', statLabel: 'Faster hiring', color: 'from-blue-500 to-cyan-500', glow: 'rgba(59,130,246,0.2)' },
  { title: 'Improve Accuracy', description: 'Make objective decisions based on comprehensive AI analysis and structured data', icon: '🎯', stat: '95%', statLabel: 'Accuracy rate', color: 'from-violet-500 to-purple-500', glow: 'rgba(139,92,246,0.2)' },
  { title: 'Ensure Fair Hiring', description: 'Eliminate unconscious bias by focusing purely on skills and performance metrics', icon: '⚖️', stat: '100%', statLabel: 'Bias-free', color: 'from-emerald-500 to-teal-500', glow: 'rgba(16,185,129,0.2)' },
  { title: 'Reduce Manual Work', description: 'Automate repetitive tasks and let HR teams focus on strategic decisions', icon: '🤖', stat: '80%', statLabel: 'Time saved', color: 'from-orange-500 to-amber-500', glow: 'rgba(249,115,22,0.2)' },
]

const keyStats = [
  { value: '10x', label: 'Faster Screening', sub: 'Automated AI reduces hiring cycles from weeks to days' },
  { value: '95%', label: 'Accuracy', sub: 'Data-driven decisions eliminate subjective bias' },
  { value: '24/7', label: 'AI Availability', sub: 'Continuous screening and interviews without breaks' },
]

export default function ValueProposition() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('comparison')
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true) }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-28 bg-[#040810] relative overflow-hidden">
      <div className="absolute inset-0 node-bg opacity-30"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-violet-600/6 rounded-full blur-[100px] -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-[100px] -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-6">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
            <span className="text-violet-400 text-sm font-medium">Why Choose HireLens</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Beyond Traditional
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 mt-1">
              Recruitment Systems
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            While traditional ATS systems focus on storing resumes and managing applications, HireLens introduces intelligent automation that transforms how you hire.
          </p>
        </div>

        {/* Tab Nav */}
        <div className="flex justify-center gap-3 mb-12">
          {[['comparison', 'Feature Comparison'], ['benefits', 'Key Benefits']].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  : 'text-slate-400 border border-white/10 bg-white/3 hover:bg-white/6 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Comparison */}
        {activeTab === 'comparison' && (
          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Column headers */}
            <div className="grid grid-cols-3 gap-4 mb-4 px-2">
              <div className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider">Feature</div>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  Traditional ATS
                </span>
              </div>
              <div className="text-center">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  HireLens AI
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {comparisonData.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-4 rounded-xl overflow-hidden border border-white/5 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  {/* Feature */}
                  <div className="p-4 bg-white/3 flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-semibold text-slate-300">{item.feature}</span>
                  </div>
                  {/* Traditional */}
                  <div className="p-4 bg-red-500/5 flex items-center">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-red-500/60 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      <span className="text-sm text-slate-500">{item.traditional}</span>
                    </div>
                  </div>
                  {/* HireLens */}
                  <div className="p-4 bg-blue-500/5 flex items-center">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm text-white font-medium">{item.hirelens}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {activeTab === 'benefits' && (
          <div className={`grid md:grid-cols-2 gap-5 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {benefits.map((b, i) => (
              <div
                key={i}
                className={`group relative rounded-2xl border border-white/8 bg-white/4 backdrop-blur-xl p-7 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-white/15 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${b.glow}, transparent 70%)` }}></div>

                <div className="relative flex items-start justify-between mb-5">
                  <span className="text-3xl">{b.icon}</span>
                  <div className="text-right">
                    <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${b.color}`}>{b.stat}</div>
                    <div className="text-xs text-slate-500 font-medium">{b.statLabel}</div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Key Stats Banner */}
        <div className="mt-16 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-cyan-600/20"></div>
          <div className="absolute inset-0 border border-white/10 rounded-2xl"></div>
          <div className="relative grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 p-2">
            {keyStats.map((s, i) => (
              <div key={i} className="text-center py-8 px-6">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 mb-1">{s.value}</div>
                <div className="text-white font-semibold mb-2">{s.label}</div>
                <div className="text-slate-400 text-sm">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
