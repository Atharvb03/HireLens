import React, { useState, useEffect } from 'react'

const steps = [
  {
    number: 1,
    title: 'Resume Upload',
    description: 'Candidate submits their resume to the HireLens platform through a simple, intuitive interface.',
    icon: '📤',
    details: ['Drag & drop support', 'Multiple formats', 'Instant processing'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    number: 2,
    title: 'AI Analysis',
    description: 'Advanced NLP algorithms analyze and extract skills, experience, education, and qualifications.',
    icon: '🔍',
    details: ['Skill extraction', 'Experience parsing', 'Education mapping'],
    color: 'from-purple-500 to-purple-600'
  },
  {
    number: 3,
    title: 'Job Matching',
    description: 'System intelligently matches candidate profile with job requirements and calculates compatibility.',
    icon: '🎯',
    details: ['Skill alignment', 'Experience fit', 'Compatibility score'],
    color: 'from-pink-500 to-pink-600'
  },
  {
    number: 4,
    title: 'AI Interview',
    description: 'Autonomous interview bot conducts adaptive technical and behavioral screening interviews.',
    icon: '💬',
    details: ['Adaptive questions', 'Real-time evaluation', 'Response analysis'],
    color: 'from-green-500 to-green-600'
  },
  {
    number: 5,
    title: 'Evaluation Report',
    description: 'Platform generates comprehensive evaluation reports with insights to support hiring decisions.',
    icon: '📋',
    details: ['Detailed analytics', 'Candidate scorecard', 'Recommendations'],
    color: 'from-orange-500 to-orange-600'
  }
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-secondary opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-secondary px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold">Process Flow</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            How HireLens
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Works in 5 Steps
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience a seamless recruitment workflow powered by artificial intelligence and intelligent automation.
          </p>
        </div>

        {/* Desktop Timeline View */}
        <div className="hidden lg:block mb-20">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-pink-500 transform -translate-y-1/2"></div>

            {/* Steps */}
            <div className="grid grid-cols-5 gap-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className="relative cursor-pointer group"
                >
                  {/* Step Circle */}
                  <div className={`relative z-10 flex items-center justify-center w-20 h-20 mx-auto rounded-full transition-all duration-500 transform ${
                    activeStep === index
                      ? `bg-gradient-to-br ${step.color} text-white shadow-2xl scale-125`
                      : 'bg-white border-4 border-gray-200 text-gray-600 group-hover:border-primary'
                  }`}>
                    <span className="text-2xl">{step.icon}</span>
                  </div>

                  {/* Step Number */}
                  <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                    activeStep === index
                      ? `bg-gradient-to-br ${step.color} text-white shadow-lg`
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.number}
                  </div>

                  {/* Step Title */}
                  <h3 className={`text-center mt-4 font-semibold transition-all duration-300 ${
                    activeStep === index ? 'text-primary text-lg' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Active Step Details */}
          <div className={`mt-16 p-8 bg-gradient-to-br ${steps[activeStep].color} rounded-2xl shadow-2xl transition-all duration-500 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-6xl mb-4">{steps[activeStep].icon}</div>
                <h3 className="text-3xl font-bold text-white mb-4">{steps[activeStep].title}</h3>
                <p className="text-white/90 text-lg mb-6">{steps[activeStep].description}</p>
                <div className="space-y-3">
                  {steps[activeStep].details.map((detail, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white font-medium">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">Step {activeStep + 1}</div>
                  <p className="text-white/80">of {steps.length}</p>
                  <div className="mt-6 w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Vertical Timeline */}
        <div className="lg:hidden">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className={`relative cursor-pointer transition-all duration-500 transform ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Vertical Line */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-10 top-24 w-1 h-16 bg-gradient-to-b from-primary to-secondary"></div>
                )}

                {/* Step Card */}
                <div className={`flex gap-6 transition-all duration-500 ${
                  activeStep === index ? 'scale-105' : 'scale-100'
                }`}>
                  {/* Circle */}
                  <div className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl transition-all duration-500 ${
                    activeStep === index
                      ? `bg-gradient-to-br ${step.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                  }`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 p-6 rounded-xl transition-all duration-500 ${
                    activeStep === index
                      ? `bg-gradient-to-br ${step.color} text-white shadow-lg`
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        activeStep === index
                          ? 'bg-white/20'
                          : 'bg-gray-200'
                      }`}>
                        Step {step.number}
                      </span>
                    </div>
                    <p className={`mb-4 ${activeStep === index ? 'text-white/90' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                    {activeStep === index && (
                      <div className="space-y-2 pt-4 border-t border-white/20">
                        {step.details.map((detail, i) => (
                          <div key={i} className="flex items-center space-x-2 text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-gray-600 mb-6 text-lg">Experience the future of recruitment today</p>
          <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </section>
  )
}
