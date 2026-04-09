import React, { useEffect, useState } from 'react'
import geminiImage from '../assets/gemini-hero.png'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section id="home" className="pt-32 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              AI-Powered
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Autonomous Recruitment
              </span>
              Platform
            </h1>

            {/* Subheading */}
            <h2 className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed font-medium">
              Streamline hiring with intelligent resume analysis, automated candidate screening, AI-driven interviews, and data-driven hiring insights.
            </h2>

            {/* Description Paragraph */}
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              HireLens helps HR teams reduce manual effort and identify the best candidates faster using artificial intelligence. 
              Our platform combines advanced NLP with intelligent automation to transform your recruitment process.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-400">10x</div>
                <div className="text-sm text-gray-400">Faster Screening</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-cyan-400">95%</div>
                <div className="text-sm text-gray-400">Accuracy Rate</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-300">24/7</div>
                <div className="text-sm text-gray-400">AI Interviews</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const element = document.getElementById('about')
                  if (element) element.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 py-4 border-2 border-blue-400 text-blue-300 rounded-lg font-semibold hover:bg-blue-500/10 transition-all transform hover:scale-105 active:scale-95"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Side - Gemini Generated Image */}
          <div className={`hidden md:flex justify-center items-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} -translate-y-20`}>
            <div className="relative w-full h-96 flex items-center justify-center">
              {/* Image Container with white background removal */}
              <img 
                src={geminiImage} 
                alt="HireLens AI Recruitment" 
                className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                style={{ 
                  filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.5))',
                  mixBlendMode: 'lighten',
                  opacity: 0.95
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
