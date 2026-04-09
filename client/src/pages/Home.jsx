import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import ValueProposition from '../components/ValueProposition'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Features />
      <ValueProposition />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}
