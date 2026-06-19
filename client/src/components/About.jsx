import React, { useState, useEffect, useRef } from 'react'

const timeline = [
  {
    phase: 'The Problem',
    title: 'Broken Hiring Systems',
    description: 'HR teams spend countless hours manually reviewing resumes, conducting repetitive interviews, and making subjective decisions prone to bias. Top talent is lost while processes drag on for weeks.',
    icon: '⚠️',
    color: 'from-red-500 to-orange-500',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    items: ['Manual resume screening', 'Repetitive interviews', 'Biased decision-making', 'Weeks-long hiring cycles']
  },
  {
    phase: 'The Solution',
    title: 'HireLens AI Platform',
    description: 'We built an intelligent recruitment platform that automates the entire hiring pipeline — from resume parsing to AI interviews — delivering objective, data-driven hiring decisions at scale.',
    icon: '🤖',
    color: 'from-blue-500 to-violet-500',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    items: ['AI-powered resume analysis', 'Autonomous 24/7 interviews', 'Objective skill scoring', 'Instant candidate ranking']
  },
  {
    phase: 'The Impact',
    title: 'Transforming Recruitment',
    description: 'Organizations using HireLens hire 70% faster, with 95% accuracy and zero bias. HR teams reclaim their time to focus on what matters — building great teams.',
    icon: '🚀',
    color: 'from-emerald-500 to-cyan-500',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    items: ['70% faster hiring cycles', '95% match accuracy', '100% bias-free evaluation', '80% reduction in manual work']
  }
]

const values = [
  { title: 'Intelligence', description: 'Leveraging cutting-edge AI to make smarter hiring decisions', icon: '🧠', color: 'from-blue-500 to-cyan-500' },
  { title: 'Fairness', description: 'Ensuring unbiased and equitable evaluation for all candidates', icon: '⚖️', color: 'from-violet-500 to-purple-500' },
  { title: 'Efficiency', description: 'Streamlining recruitment to save time and resources', icon: '⚡', color: 'from-amber-500 to-orange-500' },
  { title: 'Innovation', description: 'Continuously advancing recruitment technology', icon: '🚀', color: 'from-emerald-500 to-teal-500' },
]

export default function About() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('mission')
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true) }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={ref} className="py-28 bg-[#060B18] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/8 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-6">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-400 text-sm font-medium">Our Story</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            About HireLens
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 mt-1">
              Transforming Recruitment
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            We're on a mission to revolutionize how organizations hire by combining artificial intelligence with intelligent recruitment workflows.
          </p>
        </div>

        {/* Mission Card */}
        <div className={`mb-16 relative rounded-2xl overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-cyan-600/10"></div>
          <div className="absolute inset-0 border border-white/10 rounded-2xl"></div>
          <div className="relative p-10 md:p-14">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Our Mission</h3>
            <p className="text-slate-300 text-lg leading-relaxed text-center max-w-3xl mx-auto mb-10">
              To build a smarter, fairer, and more efficient hiring ecosystem for modern organizations by combining artificial intelligence with intelligent recruitment workflows.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🎯', title: 'Smarter Hiring', desc: 'Data-driven decisions powered by advanced AI' },
                { icon: '⚖️', title: 'Fair Evaluation', desc: 'Objective assessment free from bias' },
                { icon: '⚡', title: 'Efficient Process', desc: 'Faster hiring cycles and better outcomes' },
              ].map((item, i) => (
                <div key={i} className="text-center p-6 rounded-xl bg-white/4 border border-white/8 hover:bg-white/6 hover:border-white/15 transition-all duration-300">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="font-bold text-white mb-1">{item.title}</div>
                  <div className="text-slate-400 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex justify-center gap-3 mb-12">
          {[['mission', 'The Problem'], ['solution', 'Our Solution'], ['values', 'Our Values']].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  : 'text-slate-400 border border-white/10 bg-white/3 hover:bg-white/6 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Timeline (Problem / Solution / Impact) */}
        {(activeTab === 'mission' || activeTab === 'solution') && (
          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="grid md:grid-cols-3 gap-6">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl border ${item.border} ${item.bg} p-7 transition-all duration-500 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {/* Phase badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${item.color} bg-opacity-10 mb-5`}>
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-xs font-bold text-white">{item.phase}</span>
                  </div>

                  {/* Step number connector */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                    {i + 1}
                  </div>

                  <h4 className="text-lg font-bold text-white mb-3">{item.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-5">{item.description}</p>

                  <ul className="space-y-2">
                    {item.items.map((point, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color} flex-shrink-0`}></div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Values */}
        {activeTab === 'values' && (
          <div className={`grid md:grid-cols-2 gap-5 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {values.map((v, i) => (
              <div
                key={i}
                className={`group relative rounded-2xl border border-white/8 bg-white/4 p-7 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-white/15 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start gap-5">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300`}>
                    {v.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{v.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{v.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vision Banner */}
        <div className="mt-16 relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-90"></div>
          <div className="absolute inset-0 node-bg opacity-20"></div>
          <div className="relative p-10 md:p-14 text-center">
            <h3 className="text-2xl font-bold text-white mb-5">Our Vision for the Future</h3>
            <p className="text-white/85 text-lg leading-relaxed max-w-3xl mx-auto mb-4">
              We envision a world where recruitment is intelligent, fair, and efficient. Where AI and human judgment work together to identify the best talent. Where every candidate receives objective evaluation regardless of background.
            </p>
            <p className="text-white/70 font-semibold">This is the future of recruitment. This is HireLens.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
