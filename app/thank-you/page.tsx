"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Phone, Package, Clock } from "lucide-react"

function ThankYouContent() {
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(10)

  // Get order details from URL params
  const productName = searchParams.get('product') || 'Product'
  const color = searchParams.get('color') || ''
  const quantity = searchParams.get('quantity') || '1'
  const total = searchParams.get('total') || ''
  const whatsappUrl = searchParams.get('whatsapp') || ''

  useEffect(() => {
    // Fire analytics events
    if (typeof window !== 'undefined') {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: Date.now().toString(),
          value: parseFloat(total),
          currency: 'NGN',
          items: [{
            item_name: productName,
            item_variant: color,
            quantity: parseInt(quantity),
            price: parseFloat(total)
          }]
        })
      }

      // Facebook Pixel
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: parseFloat(total),
          currency: 'NGN',
          content_name: productName,
          content_type: 'product',
          contents: [{
            id: productName,
            quantity: parseInt(quantity)
          }]
        })
      }

      // Google Tag Manager
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: Date.now().toString(),
            value: parseFloat(total),
            currency: 'NGN',
            items: [{
              item_name: productName,
              item_variant: color,
              quantity: parseInt(quantity),
              price: parseFloat(total)
            }]
          }
        })
      }
    }
  }, [productName, color, quantity, total])

  useEffect(() => {
    if (countdown <= 0 && whatsappUrl) {
      window.location.href = whatsappUrl
      return
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, whatsappUrl])

  const progressPercentage = ((10 - countdown) / 10) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background py-10 px-5">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Received!</h1>
          <p className="text-muted-foreground">Thank you for your order. We&apos;ve received your request.</p>
        </div>

        {/* Order Summary Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product:</span>
                <span className="font-semibold">{productName}</span>
              </div>
              {color && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color:</span>
                  <span className="font-semibold">{color}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-semibold">{quantity}</span>
              </div>
              {total && (
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-primary text-lg">₦{parseInt(total).toLocaleString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps Card */}
        <Card className="mb-6 border-primary/30">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-4">What Happens Next?</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp Confirmation</h3>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll be redirected to WhatsApp to confirm your order with our team
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Payment Details</h3>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll send you our bank account details via WhatsApp for payment
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Your order ships within 24 hours of payment confirmation
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Countdown Card */}
        {whatsappUrl && (
          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-primary" />
                <p className="font-semibold">Redirecting to WhatsApp in {countdown} seconds...</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <a
                href={whatsappUrl}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Phone className="w-5 h-5" />
                Continue to WhatsApp Now
              </a>
            </CardContent>
          </Card>
        )}

        {/* Trust Badge */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>🔒 Your information is secure and will never be shared</p>
          <p className="mt-2">Join 500+ satisfied customers across Nigeria</p>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4 animate-pulse">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}

// Type declarations for analytics
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: (...args: any[]) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: any[]
  }
}
