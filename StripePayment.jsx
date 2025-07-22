import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { CheckCircle, AlertCircle, CreditCard } from 'lucide-react'

// Initialize Stripe (you'll need to replace with your publishable key)
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE')

const CheckoutForm = ({ plan, onSuccess, onError }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)

    try {
      // Create payment method
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: 'Customer Name', // You can get this from a form
        },
      })

      if (paymentError) {
        setError(paymentError.message)
        setIsProcessing(false)
        return
      }

      // Send payment method to your backend
      const response = await fetch('http://localhost:5001/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          plan_id: plan.stripe_price_id,
          plan_name: plan.name
        }),
      })

      const result = await response.json()

      if (result.error) {
        setError(result.error)
      } else {
        onSuccess(result)
      }
    } catch (err) {
      setError('Payment failed. Please try again.')
      onError(err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Subscribe to {plan.name} - {plan.price}/month
          </>
        )}
      </Button>
    </form>
  )
}

const StripePayment = ({ plan, onSuccess, onCancel }) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleSuccess = (result) => {
    setPaymentSuccess(true)
    onSuccess(result)
  }

  const handleError = (error) => {
    console.error('Payment error:', error)
  }

  if (paymentSuccess) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600 mb-4">
            Welcome to the {plan.name} plan. You can now enjoy all the premium features.
          </p>
          <Button onClick={() => window.location.reload()}>
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Subscribe to {plan.name}</span>
          </CardTitle>
          <CardDescription>
            Complete your subscription to unlock premium features
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Plan Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{plan.name} Plan</span>
              <Badge variant="outline">{plan.price}/month</Badge>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              {plan.pages} pages analysis per month
            </div>
            <ul className="space-y-1">
              {plan.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm
              plan={plan}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </Elements>

          <div className="text-center mt-4">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StripePayment

