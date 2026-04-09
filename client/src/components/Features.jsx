import React, { useState, useEffect } from 'react'

const features = [
  {
    title: 'AI Resume Intelligence',
    description: 'Automatically extracts candidate information including skills, education, and experience using advanced natural language processing.',
    icon: '📄',
    color: 'from-blue-500 to-blue-600',
    lightColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    benefits: ['NLP Analysis', 'Skill Extraction', 'Experience Parsing']
  },
  {
    title: 'Skill Matching Engine',
    description: 'Compares candidate profiles with job requirements to calculate compatibility scores and identify perfect fits.',
    icon: '🎯',
    color: 'from-purple-500 to-purple-600',
    lightColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    benefits: ['Compatibility Score', 'Job Alignment', 'Ranking']
  },
  {
    title: 'Autonomous AI Interviewer',
    description: 'Conducts technical and behavioral interviews using adaptive questioning and real-time evaluation.',
    icon: '🤖',
    color: 'from-pink-500 to-pink-600',
    lightColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    benefits: ['Adaptive Questions', 'Real-time Eval', 'Scoring']
  },
  {
    title: 'Skill Gap Analysis',
    description: 'Identifies missing skills in candidates and provides personalized improvement suggestions for development.',
    icon: '📊',
    color: 'from-green-500 to-green-600',
    lightColor: 'bg-green-50',
    borderColor: 'border-green-200',
    benefits: ['Gap Detection', 'Recommendations', 'Development Path']
  },
  {
    title: 'Bias-Free Recruitment',
    description: 'Ensures fair and objective hiring decisions by focusing exclusively on skills and performance metrics.',
    icon: '⚖️',
    color: 'from-orange-500 to-orange-600',
    lightColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    benefits: ['Fair Evaluation', 'Objective Scoring', 'Compliance']
  },
  {
    title: 'Data-Driven Reports',
    description: 'Generates comprehensive analytics and structured candidate scorecards for informed HR decision-making.',
    icon: '📈',
    color: 'from-red-500 to-red-600',
    lightColor: 'bg-red-50',
    borderColor: 'border-red-200',
    benefits: ['Analytics', 'Scorecards', 'Insights']
  }
]

export default function Features() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

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
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-primary px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold">Core Capabilities</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Powerful AI Features
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              for Modern Recruitment
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leverage cutting-edge artificial intelligence to transform your hiring process and make better talent decisions faster.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative transition-all duration-500 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } ${hoveredIndex === index ? 'scale-105' : 'scale-100'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>

              {/* Card Border */}
              <div className={`absolute inset-0 border-2 ${feature.borderColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {/* Card Content */}
              <div className={`relative p-8 rounded-2xl transition-all duration-500 ${
                hoveredIndex === index
                  ? `${feature.lightColor} shadow-2xl`
                  : 'bg-white shadow-lg hover:shadow-xl'
              }`}>
                {/* Icon Container */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 transition-all duration-500 ${
                  hoveredIndex === index
                    ? `bg-gradient-to-br ${feature.color} text-white shadow-lg transform scale-110`
                    : `${feature.lightColor} text-3xl`
                }`}>
                  {hoveredIndex === index ? (
                    <span className="text-2xl">{feature.icon}</span>
                  ) : (
                    <span className="text-3xl">{feature.icon}</span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits Tags */}
                <div className="flex flex-wrap gap-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {feature.benefits.map((benefit, i) => (
                    <span
                      key={i}
                      className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${feature.color} text-white`}
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

                {/* Decorative element */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-full blur-2xl transition-opacity duration-500`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
