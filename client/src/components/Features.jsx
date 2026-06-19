import React, { useState, useEffect, useRef } from 'react'

const features = [
  {
    title: 'AI Resume Intelligence',
    description: 'Automatically extracts candidate information including skills, education, and experience using advanced natural language processing.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    gradient: 'from-blue-500 to-blue-600',
    glow: 'rgba(59,130,246,0.3)',
    benefits: ['NLP Analysis', 'Skill Extraction', 'Experience Parsing'],
    span: 'lg:col-span-1'
  },
  {
    title: 'Skill Matching Engine',
    description: 'Compares candidate profiles with job requirements to calculate compatibility scores and identify perfect fits.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    gradient: 'from-violet-500 to-violet-600',
    glow: 'rgba(139,92,246,0.3)',
    benefits: ['Compatibility Score', 'Job Alignment', 'Ranking'],
    span: 'lg:col-span-1'
  },
  {
    title: 'Autonomous AI Interviewer',
    description: 'Conducts technical and behavioral interviews using adaptive questioning and real-time evaluation. Available 24/7 without scheduling constraints.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    gradient: 'from-cyan-500 to-blue-500',
    glow: 'rgba(34,211,238,0.3)',
    benefits: ['Adaptive Questions', 'Real-time Eval', 'Scoring'],
    span: 'lg:col-span-1'
  },
  {
    title: 'Skill Gap Analysis',
    description: 'Identifies missing skills in candidates and provides personalized improvement suggestions for development.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.3)',
    benefits: ['Gap Detection', 'Recommendations', 'Development Path'],
    span: 'lg:col-span-1'
  },
  {
    title: 'Bias-Free Recruitment',
    description: 'Ensures fair and objective hiring decisions by focusing exclusively on skills and performance metrics.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    gradient: 'from-orange-500 to-amber-500',
    glow: 'rgba(249,115,22,0.3)',
    benefits: ['Fair Evaluation', 'Objective Scoring', 'Compliance'],
    span: 'lg:col-span-1'
  },
  {
    title: 'Data-Driven Reports',
    description: 'Generates comprehensive analytics and structured candidate scorecards for informed HR decision-making.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-pink-500 to-rose-500',
    glow: 'rgba(236,72,153,0.3)',
    benefits: ['Analytics', 'Scorecards', 'Insights'],
    span: 'lg:col-span-1'
  }
]

function FeatureCard({ feature, index, isVisible }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`group relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${feature.span}`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow on hover */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{ background: `linear-gradient(135deg, ${feature.glow}, transparent)` }}
      ></div>

      <div className="relative h-full rounded-2xl border border-white/8 bg-white/4 backdrop-blur-xl p-7 overflow-hidden transition-all duration-500 group-hover:border-white/15 group-hover:bg-white/6 group-hover:-translate-y-1">
        {/* Shimmer on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 animate-shimmer"></div>
        </div>

        {/* Icon */}
        <div className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 bg-gradient-to-br ${feature.gradient} transition-all duration-300 group-hover:scale-110`}
          style={{ boxShadow: hovered ? `0 0 20px ${feature.glow}` : 'none' }}>
          <div className="text-white">{feature.icon}</div>
        </div>

        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
          {feature.title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed mb-5">
          {feature.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {feature.benefits.map((b, i) => (
            <span key={i} className={`text-xs px-2.5 py-1 rounded-full bg-gradient-to-r ${feature.gradient} bg-opacity-10 text-white/70 border border-white/10`}>
              {b}
            </span>
          ))}
        </div>

        {/* Corner decoration */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-full blur-2xl transition-opacity duration-500`}></div>
      </div>
    </div>
  )
}

export default function Features() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true) }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" ref={ref} className="py-28 bg-[#060B18] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/8 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-blue-400 text-sm font-medium">Core Capabilities</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Powerful AI Features
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 mt-1">
              for Modern Recruitment
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Leverage cutting-edge artificial intelligence to transform your hiring process and make better talent decisions faster.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
