import React from 'react'
import { useLocation } from 'wouter'
import { ArrowLeft, Check, Star, Users, Crown } from 'lucide-react'

export function PricingPage() {
  const [, setLocation] = useLocation()

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      icon: Star,
      features: [
        '3 sessions per day',
        'Basic AI feedback',
        '7-day history',
        'Mobile & desktop access',
        'Email support'
      ],
      limitations: [
        'Limited daily sessions',
        'Basic analysis only',
        'Short history retention'
      ],
      buttonText: 'Current Plan',
      buttonAction: () => setLocation('/dashboard'),
      popular: false,
      color: 'gray'
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      icon: Crown,
      features: [
        'Unlimited daily sessions',
        'Advanced AI feedback with GPT-4o',
        'Unlimited history',
        'Progress tracking & analytics',
        'Custom pitch templates',
        'Export transcripts & reports',
        'Priority email support'
      ],
      limitations: [],
      buttonText: 'Upgrade to Pro',
      buttonAction: () => alert('Stripe integration coming soon!'),
      popular: true,
      color: 'blue'
    },
    {
      name: 'Team',
      price: '$49.99',
      period: 'per month',
      icon: Users,
      features: [
        'Everything in Pro',
        'Up to 10 team members',
        'Team dashboard & analytics',
        'Group training modules',
        'Admin management tools',
        'Bulk session analysis',
        'Team performance reports',
        'Dedicated account manager'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonAction: () => window.open('mailto:sales@pitchpal.ai?subject=Team Plan Inquiry'),
      popular: false,
      color: 'purple'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <button
              onClick={() => setLocation('/dashboard')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
              <p className="text-gray-600">Upgrade to unlock advanced features and unlimited access</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Pricing Grid */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-blue-500 relative' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <Icon className={`h-12 w-12 mx-auto mb-4 text-${plan.color}-600`} />
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={plan.buttonAction}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : plan.name === 'Free'
                        ? 'bg-gray-100 text-gray-600 cursor-default'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    disabled={plan.name === 'Free'}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied, contact support for a full refund.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What AI models do you use?
              </h3>
              <p className="text-gray-600">
                We use OpenAI's latest GPT-4o for analysis and Whisper for speech-to-text transcription, ensuring the highest quality feedback.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Absolutely. All recordings are encrypted in transit and at rest. We never share your data with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-xl mb-6">
            We offer enterprise plans with custom features, integrations, and dedicated support.
          </p>
          <button
            onClick={() => window.open('mailto:enterprise@pitchpal.ai?subject=Enterprise Plan Inquiry')}
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Enterprise Sales
          </button>
        </div>
      </div>
    </div>
  )
}