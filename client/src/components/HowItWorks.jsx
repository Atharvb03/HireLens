import React, { useState, useEffect, useRef } from 'react'

const steps = [
  {
    number: 1,
    title: 'Resume Upload',
    description: 'Candidate submits their resume to the HireLens platform through a simple, intuitive interface.',
    icon: '📤',
    details: ['Drag & drop support', 'Multiple formats', 'Instant processing'],
    color: 'from-blue-500 to-blue-600',
    glow: 'rgba(59,130,246,0.4)',
    border: 'border-blue-500/30',
  },
  {
    number: 2,
    title: 'AI Analysis',
    description: 'Advanced NLP algorithms analyze and extract skills, experience, education, and qualifications.',
    icon: '🔍',
    details: ['Skill extraction', 'Experience parsing', 'Education mapping'],
    color: 'from-violet-500 to-violet-600',
    glow: 'rgba(139,92,246,0.4)',
    border: 'border-violet-500/30',
  },
  {
    number: 3,
    title: 'Job Matching',
    description: 'System intelligently matches candidate profile with job requirements and calculates compatibility.',
    icon: '🎯',
    details: ['Skill alignment', 'Experience fit', 'Compatibility score'],
    color: 'from-cyan-500 to-blue-500',
    glow: 'rgba(34,211,238,0.4)',
    border: 'border-cyan-500/30',
  },
  {
    number: 4,
    title: 'AI Interview',
    description: 'Autonomous interview bot conducts adaptive technical and behavioral screening interviews.',
    icon: '💬',
    details: ['Adaptive questions', 'Real-time evaluation', 'Response analysis'],
    color: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.4)',
    border: 'border-emerald-500/30',
  },
  {
    number: 5,
    title: 'Evaluation Report',
    description: 'Platform generates comprehensive evaluation reports with insights to support hiring decisions.',
    icon: '📋',
    details: ['Detailed analytics', 'Candidate scorecard', 'Recommendations'],
    color: 'from-orange-500 to-amber-500',
    glow: 'rgba(249,115,22,0.4)',
    border: 'border-orange-500/30',
  }
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true) }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % steps.length), 3500)
    return () => clearInterval(t)
  }, [])

  const active = steps[activeStep]

  return (
    <section ref={ref} className="py-28 bg-[#040810] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-25"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-6">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            <span className="text-cyan-400 text-sm font-medium">Process Flow</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            How HireLens
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 mt-1">
              Works in 5 Steps
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Experience a seamless recruitment workflow powered by artificial intelligence and intelligent automation.
          </p>
        </div>

        {/* Desktop: horizontal pipeline */}
        <div className="hidden lg:block">
          {/* Step selectors */}
          <div className="relative flex items-center justify-between mb-12 px-8">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-8 right-8 h-px bg-white/5 -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 left-8 h-px bg-gradient-to-r from-blue-500 to-violet-500 -translate-y-1/2 transition-all duration-700"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`relative z-10 flex flex-col items-center gap-3 group transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 border ${
                    activeStep === i
                      ? `bg-gradient-to-br ${step.color} border-transparent scale-110`
                      : 'bg-white/5 border-white/10 group-hover:bg-white/8 group-hover:scale-105'
                  }`}
                  style={{ boxShadow: activeStep === i ? `0 0 25px ${step.glow}` : 'none' }}
                >
                  {step.icon}
                </div>
                <span className={`text-xs font-semibold transition-colors duration-300 ${activeStep === i ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>

          {/* Active step detail */}
          <div className={`relative rounded-2xl overflow-hidden border ${active.border} transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${active.color} opacity-5`}></div>
            <div className="relative grid md:grid-cols-2 gap-0">
              <div className="p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${active.color} flex items-center justify-center text-2xl`}
                    style={{ boxShadow: `0 0 25px ${active.glow}` }}>
                    {active.icon}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Step {active.number} of {steps.length}</div>
                    <h3 className="text-2xl font-bold text-white">{active.title}</h3>
                  </div>
                </div>
                <p className="text-slate-400 leading-relaxed mb-8">{active.description}</p>
                <div className="space-y-3">
                  {active.details.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${active.color} flex items-center justify-center flex-shrink-0`}>
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-300 text-sm font-medium">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-10 border-l border-white/5 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br ${active.color} mb-4`}>
                    {active.number}
                  </div>
                  <div className="text-slate-500 text-sm mb-6">of {steps.length} steps</div>
                  {/* Progress dots */}
                  <div className="flex gap-2 justify-center">
                    {steps.map((_, i) => (
                      <button key={i} onClick={() => setActiveStep(i)}
                        className={`rounded-full transition-all duration-300 ${i === activeStep ? `w-6 h-2 bg-gradient-to-r ${active.color}` : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="lg:hidden space-y-4">
          {steps.map((step, i) => (
            <div
              key={i}
              onClick={() => setActiveStep(i)}
              className={`relative rounded-xl border cursor-pointer transition-all duration-500 overflow-hidden ${
                activeStep === i ? `${step.border} bg-white/5` : 'border-white/5 bg-white/2'
              } ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-4 p-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all duration-300 ${
                  activeStep === i ? `bg-gradient-to-br ${step.color}` : 'bg-white/5'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">{step.title}</h3>
                    <span className="text-xs text-slate-500">Step {step.number}</span>
                  </div>
                  <p className={`text-sm mt-1 transition-colors ${activeStep === i ? 'text-slate-300' : 'text-slate-500'}`}>{step.description}</p>
                </div>
              </div>
              {activeStep === i && (
                <div className="px-5 pb-5 flex flex-wrap gap-2">
                  {step.details.map((d, j) => (
                    <span key={j} className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${step.color} text-white`}>{d}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 mb-5 text-sm">Experience the future of recruitment today</p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]"
          >
            Start Your Free Trial
          </button>
        </div>
      </div>
    </section>
  )
}
