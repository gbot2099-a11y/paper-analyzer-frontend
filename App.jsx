import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { FileText, CheckCircle, AlertCircle, Upload, Settings, Crown, Play, Target } from 'lucide-react'
import AnalysisDemo from './components/AnalysisDemo.jsx'
import MCQAnalysis from './components/MCQAnalysis.jsx'
import StripePayment from './components/StripePayment.jsx'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null) // null = not logged in

  const subscriptionPlans = [
    {
      name: 'Free',
      price: '$0',
      duration: '7 days',
      pages: '200',
      features: ['Basic mistake detection', 'Grammar & spelling check', 'Limited language support', '200 pages analysis']
    },
    {
      name: 'Basic',
      price: '$10',
      duration: 'per month',
      pages: '1,500',
      features: ['Advanced mistake detection', 'Multiple languages', 'Grammar & spelling check', 'Email support', '1,500 pages analysis']
    },
    {
      name: 'Standard',
      price: '$22',
      duration: 'per month',
      pages: '5,000',
      features: ['All Basic features', '200 MCQ analysis', 'Priority processing', 'Detailed reports', 'Phone support', '5,000 pages analysis']
    },
    {
      name: 'Premium',
      price: '$30',
      duration: 'per month',
      pages: '10,000',
      features: ['All Standard features', '500 MCQ analysis', 'Answer key comparison', 'Bulk processing', 'API access', '24/7 support', '10,000 pages analysis']
    }
  ]

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Paper Analyzer</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Badge variant="outline" className="text-sm">
                    {user.plan} Plan
                  </Badge>
                  <Button variant="outline" onClick={() => setCurrentPage('dashboard')}>
                    Dashboard
                  </Button>
                  <Button variant="ghost" onClick={() => setUser(null)}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setCurrentPage('demo')}>
                    <Play className="h-4 w-4 mr-2" />
                    Try Demo
                  </Button>
                  <Button variant="ghost" onClick={() => setCurrentPage('login')}>
                    Login
                  </Button>
                  <Button onClick={() => setCurrentPage('signup')}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Document Analysis for Teachers
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Analyze papers, detect mistakes, and provide detailed feedback with our advanced AI technology. 
            Support for multiple languages and customizable analysis options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3" onClick={() => setCurrentPage('demo')}>
              <Play className="h-5 w-5 mr-2" />
              Try Demo
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3" onClick={() => setCurrentPage('mcq')}>
              <Target className="h-5 w-5 mr-2" />
              MCQ Analysis
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3" onClick={() => setCurrentPage('pricing')}>
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Educators
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Smart Mistake Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced AI detects grammar, spelling, and contextual errors with high accuracy.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Settings className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Customizable Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Choose analysis type (grammar, spelling, or both) and select from multiple languages.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Upload className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Bulk Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Upload multiple documents and analyze thousands of pages efficiently.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )

  const DemoPage = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Paper Analyzer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setCurrentPage('home')}>
                ← Back to Home
              </Button>
              <Button onClick={() => setCurrentPage('signup')}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8">
        <AnalysisDemo />
      </div>
    </div>
  )

  const PricingPage = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600">Select the perfect plan for your teaching needs</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subscriptionPlans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.name === 'Standard' ? 'border-blue-500 shadow-lg' : ''}`}>
              {plan.name === 'Standard' && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                {plan.name === 'Premium' && <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />}
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-blue-600">
                  {plan.price}
                  <span className="text-sm text-gray-500 font-normal">/{plan.duration}</span>
                </div>
                <CardDescription className="text-lg font-semibold">
                  {plan.pages} pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.name === 'Standard' ? 'default' : 'outline'}
                  onClick={() => {
                    if (!user) {
                      setCurrentPage('signup')
                    } else {
                      alert(`Upgrading to ${plan.name} plan...`)
                    }
                  }}
                >
                  {plan.name === 'Free' ? 'Start Free Trial' : `Choose ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => setCurrentPage('home')}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  )

  const MCQPage = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Paper Analyzer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setCurrentPage('home')}>
                ← Back to Home
              </Button>
              {user ? (
                <Badge variant="outline" className="text-sm">
                  {user.plan} Plan
                </Badge>
              ) : (
                <Button onClick={() => setCurrentPage('signup')}>
                  Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="py-8">
        <MCQAnalysis userPlan={user?.plan || 'free'} />
      </div>
    </div>
  )

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'demo':
        return <DemoPage />
      case 'pricing':
        return <PricingPage />
      case 'mcq':
        return <MCQPage />
      default:
        return <HomePage />
    }
  }

  return renderPage()
}

export default App

