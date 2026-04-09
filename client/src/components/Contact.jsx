import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message must not exceed 1000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setStatus('')
      return
    }

    setIsLoading(true)
    setStatus('')

    try {
      const response = await axios.post('/api/contact', formData, {
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.status === 201) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.'
        })
        setFormData({ name: '', email: '', message: '' })
        setErrors({})
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setStatus(''), 5000)
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send message. Please try again later.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold">Get in Touch</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Contact Us
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              We'd Love to Hear From You
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about HireLens? Want to schedule a demo? Or just want to say hello? 
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Container */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Information */}
          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="space-y-8">
              {/* Info Card 1 */}
              <div className="group p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">Email</h3>
                    <p className="text-gray-600 mt-1">support@hirelens.com</p>
                    <p className="text-sm text-gray-500 mt-2">We'll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Info Card 2 */}
              <div className="group p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">Phone</h3>
                    <p className="text-gray-600 mt-1">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500 mt-2">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>
              </div>

              {/* Info Card 3 */}
              <div className="group p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">Office</h3>
                    <p className="text-gray-600 mt-1">San Francisco, CA</p>
                    <p className="text-sm text-gray-500 mt-2">Visit us for a demo</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-8 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: 'f', label: 'Facebook' },
                    { icon: 't', label: 'Twitter' },
                    { icon: 'in', label: 'LinkedIn' }
                  ].map((social, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center hover:shadow-lg transition-all transform hover:scale-110"
                    >
                      <span className="font-bold text-sm">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                      errors.name
                        ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-200 bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 17.586l-6.687-6.687a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none ${
                      errors.email
                        ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-200 bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 17.586l-6.687-6.687a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your inquiry..."
                    rows="5"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none resize-none ${
                      errors.message
                        ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-200 bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.message && (
                      <p className="text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 17.586l-6.687-6.687a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
                        </svg>
                        {errors.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 ml-auto">
                      {formData.message.length}/1000
                    </p>
                  </div>
                </div>

                {/* Status Messages */}
                {status && (
                  <div className={`p-4 rounded-lg flex items-start transition-all duration-300 ${
                    status.type === 'success'
                      ? 'bg-green-50 border-2 border-green-200'
                      : 'bg-red-50 border-2 border-red-200'
                  }`}>
                    <svg className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                      status.type === 'success' ? 'text-green-600' : 'text-red-600'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className={status.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                      {status.message}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>

                {/* Privacy Notice */}
                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. Your information will only be used to respond to your inquiry.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
