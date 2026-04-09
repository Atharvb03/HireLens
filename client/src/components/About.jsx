import React, { useState, useEffect } from 'react'

const problems = [
  {
    title: 'Manual Resume Screening',
    description: 'HR teams spend countless hours manually reviewing resumes, leading to fatigue and missed talent.',
    icon: '📋',
    color: 'from-red-500 to-red-600'
  },
  {
    title: 'Repetitive Interviews',
    description: 'Scheduling and conducting multiple rounds of interviews is time-consuming and resource-intensive.',
    icon: '⏰',
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'Biased Decision-Making',
    description: 'Subjective evaluations lead to unconscious bias, resulting in unfair hiring outcomes.',
    icon: '⚠️',
    color: 'from-yellow-500 to-yellow-600'
  }
]

const solutions = [
  {
    title: 'AI-Powered Analysis',
    description: 'Intelligent algorithms analyze resumes and extract relevant information automatically.',
    icon: '🤖',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Automated Interviews',
    description: 'Autonomous AI conducts screening interviews 24/7, eliminating scheduling constraints.',
    icon: '💬',
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Objective Evaluation',
    description: 'Data-driven scoring ensures fair, unbiased assessment of all candidates.',
    icon: '✓',
    color: 'from-green-500 to-green-600'
  }
]

const values = [
  {
    title: 'Intelligence',
    description: 'Leveraging cutting-edge AI to make smarter hiring decisions',
    icon: '🧠'
  },
  {
    title: 'Fairness',
    description: 'Ensuring unbiased and equitable evaluation for all candidates',
    icon: '⚖️'
  },
  {
    title: 'Efficiency',
    description: 'Streamlining recruitment to save time and resources',
    icon: '⚡'
  },
  {
    title: 'Innovation',
    description: 'Continuously advancing recruitment technology',
    icon: '🚀'
  }
]

export default function About() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('mission')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-600 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold">Our Story</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About HireLens
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Transforming Recruitment
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to revolutionize how organizations hire by combining artificial intelligence 
            with intelligent recruitment workflows.
          </p>
        </div>

        {/* Mission Statement */}
        <div className={`mb-20 p-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl border-2 border-primary/20 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h3>
            <p className="text-xl text-gray-700 leading-relaxed text-center mb-8">
              To build a smarter, fairer, and more efficient hiring ecosystem for modern organizations by 
              combining artificial intelligence with intelligent recruitment workflows.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="font-bold text-gray-900 mb-2">Smarter Hiring</h4>
                <p className="text-gray-600">Data-driven decisions powered by advanced AI</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">⚖️</div>
                <h4 className="font-bold text-gray-900 mb-2">Fair Evaluation</h4>
                <p className="text-gray-600">Objective assessment free from bias</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h4 className="font-bold text-gray-900 mb-2">Efficient Process</h4>
                <p className="text-gray-600">Faster hiring cycles and better outcomes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'mission'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
            }`}
          >
            The Problem
          </button>
          <button
            onClick={() => setActiveTab('solution')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'solution'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
            }`}
          >
            Our Solution
          </button>
          <button
            onClick={() => setActiveTab('values')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'values'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
            }`}
          >
            Our Values
          </button>
        </div>

        {/* The Problem */}
        {activeTab === 'mission' && (
          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                The Challenge Organizations Face
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {problems.map((problem, index) => (
                  <div
                    key={index}
                    className={`group relative transition-all duration-500 transform ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Card */}
                    <div className="relative p-8 rounded-2xl bg-white border-2 border-gray-200 group-hover:border-red-500 transition-all duration-500 h-full">
                      <div className="text-5xl mb-4">{problem.icon}</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">{problem.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{problem.description}</p>
                      
                      {/* Decorative element */}
                      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${problem.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Impact */}
            <div className="p-8 bg-red-50 border-2 border-red-200 rounded-2xl">
              <h4 className="text-2xl font-bold text-red-900 mb-4">The Impact</h4>
              <ul className="space-y-3 text-red-800">
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 font-bold">•</span>
                  <span>Hiring cycles take weeks or months, delaying critical business needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 font-bold">•</span>
                  <span>Top talent is lost to competitors while evaluations drag on</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 font-bold">•</span>
                  <span>Biased hiring practices lead to legal and reputational risks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 font-bold">•</span>
                  <span>HR teams are overwhelmed with repetitive, low-value tasks</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Our Solution */}
        {activeTab === 'solution' && (
          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                How HireLens Solves It
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {solutions.map((solution, index) => (
                  <div
                    key={index}
                    className={`group relative transition-all duration-500 transform ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Card */}
                    <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${solution.color} text-white border-2 border-transparent group-hover:border-white/50 transition-all duration-500 h-full shadow-lg group-hover:shadow-2xl`}>
                      <div className="text-5xl mb-4">{solution.icon}</div>
                      <h4 className="text-xl font-bold mb-3">{solution.title}</h4>
                      <p className="text-white/90 leading-relaxed">{solution.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution Benefits */}
            <div className="p-8 bg-green-50 border-2 border-green-200 rounded-2xl">
              <h4 className="text-2xl font-bold text-green-900 mb-4">The Results</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <span className="text-green-600 mr-3 font-bold text-2xl">✓</span>
                  <div>
                    <p className="font-bold text-green-900">70% Faster Hiring</p>
                    <p className="text-green-800">Reduce time-to-hire from weeks to days</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-3 font-bold text-2xl">✓</span>
                  <div>
                    <p className="font-bold text-green-900">95% Accuracy</p>
                    <p className="text-green-800">Data-driven decisions eliminate guesswork</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-3 font-bold text-2xl">✓</span>
                  <div>
                    <p className="font-bold text-green-900">100% Fair Evaluation</p>
                    <p className="text-green-800">Objective assessment free from bias</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-3 font-bold text-2xl">✓</span>
                  <div>
                    <p className="font-bold text-green-900">80% Time Saved</p>
                    <p className="text-green-800">HR teams focus on strategic decisions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Our Values */}
        {activeTab === 'values' && (
          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Core Values That Drive Us
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={`group relative transition-all duration-500 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Card */}
                  <div className="relative p-8 rounded-2xl bg-white border-2 border-gray-200 group-hover:border-primary transition-all duration-500 h-full">
                    <div className="flex items-start">
                      <div className="text-5xl mr-6">{value.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                          {value.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vision Statement */}
        <div className="mt-20 p-12 bg-gradient-to-r from-primary to-secondary rounded-3xl shadow-2xl text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">Our Vision for the Future</h3>
            <p className="text-xl leading-relaxed mb-8">
              We envision a world where recruitment is intelligent, fair, and efficient. Where AI and human 
              judgment work together to identify the best talent. Where every candidate receives objective 
              evaluation regardless of background. Where HR teams focus on building great teams instead of 
              drowning in administrative tasks.
            </p>
            <p className="text-lg text-white/90">
              This is the future of recruitment. This is HireLens.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
