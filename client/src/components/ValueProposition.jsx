import React, { useState, useEffect } from 'react'

const comparisonData = [
  {
    feature: 'Resume Storage',
    traditional: 'Basic file storage',
    talentai: 'Intelligent extraction & analysis',
    icon: '📁'
  },
  {
    feature: 'Candidate Screening',
    traditional: 'Manual review process',
    talentai: 'AI-powered automated screening',
    icon: '🔍'
  },
  {
    feature: 'Interview Process',
    traditional: 'Scheduled by recruiters',
    talentai: 'Autonomous AI interviews 24/7',
    icon: '💬'
  },
  {
    feature: 'Skill Assessment',
    traditional: 'Subjective evaluation',
    talentai: 'Objective AI-driven analysis',
    icon: '📊'
  },
  {
    feature: 'Bias Mitigation',
    traditional: 'Prone to human bias',
    talentai: 'Fair & objective evaluation',
    icon: '⚖️'
  },
  {
    feature: 'Decision Support',
    traditional: 'Limited insights',
    talentai: 'Data-driven recommendations',
    icon: '🎯'
  }
]

const benefits = [
  {
    title: 'Reduce Recruitment Time',
    description: 'Cut hiring cycles from weeks to days with automated screening and interviews',
    icon: '⚡',
    stat: '70%',
    statLabel: 'Faster hiring'
  },
  {
    title: 'Improve Accuracy',
    description: 'Make objective decisions based on comprehensive AI analysis and structured data',
    icon: '🎯',
    stat: '95%',
    statLabel: 'Accuracy rate'
  },
  {
    title: 'Ensure Fair Hiring',
    description: 'Eliminate unconscious bias by focusing purely on skills and performance metrics',
    icon: '⚖️',
    stat: '100%',
    statLabel: 'Bias-free'
  },
  {
    title: 'Reduce Manual Work',
    description: 'Automate repetitive tasks and let HR teams focus on strategic decisions',
    icon: '🤖',
    stat: '80%',
    statLabel: 'Time saved'
  }
]

export default function ValueProposition() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('comparison')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-pink-600 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold">Why Choose HireLens</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Beyond Traditional
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Recruitment Systems
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            While traditional ATS systems focus on storing resumes and managing applications, HireLens introduces 
            intelligent automation that transforms how you hire.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'comparison'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
            }`}
          >
            Feature Comparison
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'benefits'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
            }`}
          >
            Key Benefits
          </button>
        </div>

        {/* Comparison Table */}
        {activeTab === 'comparison' && (
          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="grid gap-4 mb-8">
              {comparisonData.map((item, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 transform ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="grid md:grid-cols-3 gap-0">
                      {/* Feature Name */}
                      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-r border-gray-200 flex items-center">
                        <span className="text-3xl mr-4">{item.icon}</span>
                        <h3 className="text-lg font-bold text-gray-900">{item.feature}</h3>
                      </div>

                      {/* Traditional */}
                      <div className="p-6 flex items-center">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Traditional ATS</p>
                          <p className="text-gray-700 font-medium">{item.traditional}</p>
                        </div>
                      </div>

                      {/* HireLens */}
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-l border-gray-200 flex items-center">
                        <div>
                          <p className="text-sm text-primary font-semibold mb-2">HireLens</p>
                          <p className="text-gray-900 font-bold text-lg">{item.talentai}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Summary */}
            <div className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border-2 border-primary/20">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Traditional Systems</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>Passive resume storage</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>Manual screening process</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>Limited insights</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-primary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <p className="font-bold text-gray-900">vs</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">HireLens</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Intelligent analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Automated screening</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Data-driven decisions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Benefits Grid */}
        {activeTab === 'benefits' && (
          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`group relative transition-all duration-500 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Card Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Card Content */}
                  <div className="relative p-8 rounded-2xl border-2 border-gray-200 group-hover:border-primary transition-all duration-500 bg-white">
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-5xl">{benefit.icon}</div>
                      <div className="text-right">
                        <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {benefit.stat}
                        </div>
                        <p className="text-sm text-gray-600 font-semibold">{benefit.statLabel}</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>

                    {/* Hover Arrow */}
                    <div className="mt-6 flex items-center text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-2">
                      <span>Learn more</span>
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Differentiators */}
        <div className="mt-20 p-8 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">10x</div>
              <p className="text-lg font-semibold">Faster Screening</p>
              <p className="text-white/80 mt-2">Automated AI reduces hiring cycles from weeks to days</p>
            </div>
            <div className="text-center border-l border-r border-white/20">
              <div className="text-5xl font-bold mb-2">95%</div>
              <p className="text-lg font-semibold">Accuracy</p>
              <p className="text-white/80 mt-2">Data-driven decisions eliminate subjective bias</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">24/7</div>
              <p className="text-lg font-semibold">AI Availability</p>
              <p className="text-white/80 mt-2">Continuous screening and interviews without breaks</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
