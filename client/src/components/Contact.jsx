import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const contactInfo = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'support@hirelens.com',
    sub: "We'll respond within 24 hours",
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Phone',
    value: '+1 (555) 123-4567',
    sub: 'Mon-Fri, 9am-6pm EST',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Office',
    value: 'San Francisco, CA',
    sub: 'Visit us for a demo',
    color: 'from-emerald-500 to-teal-500',
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true) }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const validate = () => {
    const e = {}
    if (!formData.name.trim() || formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Please enter a valid email address'
    if (!formData.message.trim() || formData.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    else if (formData.message.trim().length > 1000) e.message = 'Message must not exceed 1000 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    setStatus('')
    try {
      const res = await axios.post('/api/contact', formData, { headers: { 'Content-Type': 'application/json' } })
      if (res.status === 201) {
        setStatus({ type: 'success', message: "Thank you! Your message has been sent successfully. We'll get back to you soon." })
        setFormData({ name: '', email: '', message: '' })
        setErrors({})
        setTimeout(() => setStatus(''), 5000)
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to send message. Please try again later.' })
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (field) => `w-full px-4 py-3.5 rounded-xl bg-white/5 border transition-all duration-300 text-white placeholder-slate-600 focus:outline-none focus:ring-0 ${
    errors[field]
      ? 'border-red-500/50 focus:border-red-500 bg-red-500/5'
      : 'border-white/10 focus:border-blue-500/50 focus:bg-white/8'
  }`

  return (
    <section id="contact" ref={ref} className="py-28 bg-[#060B18] relative overflow-hidden">
      <div className="absolute inset-0 node-bg opacity-40"></div>
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="text-orange-400 text-sm font-medium">Get in Touch</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Contact Us
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-blue-400 to-violet-400 mt-1">
              We'd Love to Hear From You
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Have questions about HireLens? Want to schedule a demo? Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Left: Info */}
          <div className={`space-y-5 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {contactInfo.map((info, i) => (
              <div key={i} className="group flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/4 hover:bg-white/6 hover:border-white/15 transition-all duration-300">
                <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">{info.label}</div>
                  <div className="text-white font-semibold">{info.value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{info.sub}</div>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="pt-4 border-t border-white/5">
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">Follow Us</div>
              <div className="flex gap-3">
                {[
                  { label: 'f', title: 'Facebook' },
                  { label: '𝕏', title: 'Twitter' },
                  { label: 'in', title: 'LinkedIn' },
                  { label: '📷', title: 'Instagram' },
                ].map((s, i) => (
                  <a key={i} href="#" title={s.title}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-sm font-bold text-slate-400 hover:text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-violet-600 hover:border-transparent transition-all duration-300 hover:scale-110">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* AI availability badge */}
            <div className="relative rounded-2xl overflow-hidden p-6 border border-blue-500/20 bg-blue-500/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-sm">🤖</div>
                <span className="text-white font-semibold text-sm">AI Support Available</span>
                <span className="ml-auto text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">24/7</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">Our AI assistant can answer common questions instantly. For complex inquiries, our team responds within 24 hours.</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative rounded-2xl border border-white/10 bg-white/4 backdrop-blur-xl p-8 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                      placeholder="John Doe" className={`${inputClass('name')} pl-11`} />
                  </div>
                  {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="john@example.com" className={`${inputClass('email')} pl-11`} />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message</label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-slate-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <textarea name="message" value={formData.message} onChange={handleChange}
                      placeholder="Tell us about your inquiry..." rows={5}
                      className={`${inputClass('message')} pl-11 resize-none`} />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    {errors.message ? <p className="text-xs text-red-400">{errors.message}</p> : <span />}
                    <p className="text-xs text-slate-600">{formData.message.length}/1000</p>
                  </div>
                </div>

                {/* Status */}
                {status && (
                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
                  }`}>
                    <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className={`text-sm ${status.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>{status.message}</p>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-600 text-center">We respect your privacy. Your information will only be used to respond to your inquiry.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
