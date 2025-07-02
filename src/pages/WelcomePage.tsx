import React from 'react'
import { useLocation } from 'wouter'
import { Mic, Brain, BarChart3, Zap, Star, Users } from 'lucide-react'

export function WelcomePage() {
  const [, setLocation] = useLocation()

  const features = [
    {
      icon: Mic,
      title: 'Voice Recording',
      description: 'Record your sales pitches with professional audio quality'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Get instant feedback powered by GPT-4o and Whisper AI'
    },
    {
      icon: BarChart3,
      title: 'Performance Scoring',
      description: 'Detailed scores for tone, clarity, and structure'
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Receive actionable coaching tips in seconds'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Sales Manager',
      company: 'TechCorp',
      quote: 'PitchPal AI improved my team\'s closing rate by 40% in just 2 months!'
    },
    {
      name: 'Michael Torres',
      role: 'Sales Rep',
      company: 'Growth Inc',
      quote: 'The instant feedback helped me perfect my pitch. My confidence is through the roof!'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            PitchPal AI
          </h1>
          <p className="text-2xl text-blue-600 font-semibold mb-2">
            PITCH SMARTER. WIN FASTER.
          </p>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Voice-based AI coaching that analyzes your sales pitches and provides instant feedback on tone, clarity, and structure.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => setLocation('/dashboard')}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Free Trial
          </button>
          <button
            onClick={() => setLocation('/pricing')}
            className="px-8 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            View Pricing
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Trusted by Sales Professionals Worldwide
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Pitches Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-gray-600">Improvement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Companies</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="text-sm">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-blue-600 text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Sales Game?
          </h2>
          <p className="text-xl mb-6">
            Join thousands of sales professionals already using PitchPal AI
          </p>
          <button
            onClick={() => setLocation('/dashboard')}
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Started Now - Free Trial
          </button>
        </div>
      </div>
    </div>
  )
}