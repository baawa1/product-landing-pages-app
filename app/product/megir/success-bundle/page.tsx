"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Gift,
  Shield,
  MapPin,
  Lock,
  Clock,
  Cloud,
  Moon,
  CheckCircle2,
  X,
  Star,
  ChevronDown,
  Store,
  Phone,
  Mail,
  Loader2,
  ShoppingCart
} from "lucide-react"

export default function MegirWatchPage() {
  const [quantity, setQuantity] = useState(1)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('Navy Blue')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  // Stock status flag - change to true when product is out of stock
  const isOutOfStock = false

  const pricePerUnit = 57000

  const colorOptions = [
    { name: 'Navy Blue', color: '#1B3A5F', images: ['15', '3'] },
    { name: 'Classic Black', color: '#1A1A1A', images: ['18', '4'] },
    { name: 'Pure White', color: '#F5F5F5', images: ['16', '1'] },
    { name: 'Teal', color: '#40E0D0', images: ['17', '2'] }
  ]

  const scrollToOrderForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const orderForm = document.getElementById('order-form')
    if (orderForm) {
      orderForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName)
    // Auto-select in order form dropdown
    const colorSelect = document.getElementById('color') as HTMLSelectElement
    if (colorSelect) {
      colorSelect.value = colorName
    }
  }

  const calculatePrice = () => {
    if (quantity === 1) {
      return { total: pricePerUnit, display: '₦57,000', discount: null }
    } else if (quantity === 2) {
      const total = Math.round(pricePerUnit * 2 * 0.7)
      return { total, display: `₦${total.toLocaleString()}`, discount: '30% OFF!' }
    } else {
      const total = Math.round(pricePerUnit * quantity * 0.6)
      return { total, display: `₦${total.toLocaleString()}`, discount: '40% OFF!' }
    }
  }

  const price = calculatePrice()

  // Handle scroll for floating button visibility
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('section')
      const orderForm = document.getElementById('order-form')

      if (heroSection && orderForm) {
        const heroBottom = heroSection.getBoundingClientRect().bottom
        const formTop = orderForm.getBoundingClientRect().top

        // Show button when scrolled past hero, hide when at order form
        setShowFloatingButton(heroBottom < 0 && formTop > 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string
    const email = (formData.get('email') as string) || ''
    const state = formData.get('state') as string
    const address = formData.get('address') as string
    const color = formData.get('color') as string

    // Client-side validation for better UX
    if (!fullName || fullName.trim().length < 2) {
      alert("Please enter your full name (at least 2 characters)")
      setIsSubmitting(false)
      return
    }

    if (!/^[a-zA-Z\s'-]+$/.test(fullName)) {
      alert("Name can only contain letters, spaces, hyphens, and apostrophes")
      setIsSubmitting(false)
      return
    }

    if (!phone || phone.trim().length < 10) {
      alert("Please enter a valid Nigerian phone number")
      setIsSubmitting(false)
      return
    }

    if (email && email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address")
        setIsSubmitting(false)
        return
      }
    }

    if (!address || address.trim().length < 10) {
      alert("Please enter a complete delivery address (at least 10 characters)")
      setIsSubmitting(false)
      return
    }

    if (/<script|javascript:|onerror=/i.test(address)) {
      alert("Address contains invalid characters")
      setIsSubmitting(false)
      return
    }

    // Prepare order data
    const orderData = {
      full_name: fullName,
      phone: phone,
      email: email,
      state: state,
      address: address,
      product_name: 'MEGIR Chronograph Watch',
      color: color,
      quantity: quantity,
      price: pricePerUnit,
      total_price: price.total,
      discount: price.discount,
      stockStatus: isOutOfStock ? 'out-of-stock' : 'in-stock'
    }

    try {
      // Save order to database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (!response.ok) {
        // Show user-friendly error message
        const errorMessage = result.message || "Failed to submit order. Please try again."
        alert(errorMessage)
        setIsSubmitting(false)
        return
      }

      const orderId = result.order_id || Date.now().toString();
      console.log('✅ Order created with ID:', orderId);

      // Create WhatsApp message
      const productUrl = window.location.origin + window.location.pathname;
      const message = `🛍️ *NEW ORDER - MEGIR CHRONOGRAPH WATCH*

👤 *Customer Details:*
Name: ${fullName}
Phone: ${phone}
Email: ${email || 'Not provided'}

📍 *Delivery Info:*
State: ${state}
Address: ${address}

⌚ *Order Details:*
Product: MEGIR Chronograph Watch
Color: ${color}
Quantity: ${quantity}
Free Gift: Premium Cufflinks ✓

💰 *Total: ${price.display}${price.discount ? ' (' + price.discount + ')' : ''} + Delivery*

🔗 *Product Link:* ${productUrl}

I'm ready to complete my order. Please send payment details.`

      const whatsappURL = `https://wa.me/2348062605012?text=${encodeURIComponent(message)}`

      // Redirect to thank you page with order details
      const thankYouURL = `/thank-you?product=MEGIR+Chronograph+Watch&color=${encodeURIComponent(color as string)}&quantity=${quantity}&total=${price.total}&phone=${phone}&whatsapp=${encodeURIComponent(whatsappURL)}&stockStatus=${isOutOfStock ? 'out-of-stock' : 'in-stock'}&order_id=${orderId}`

      window.location.href = thankYouURL

    } catch (error) {
      console.error('Error submitting order:', error)
      setIsSubmitting(false)
      // Fallback to direct WhatsApp if database fails
      const productUrl = window.location.origin + window.location.pathname;
      const message = `🛍️ *NEW ORDER - MEGIR CHRONOGRAPH WATCH*

👤 *Customer Details:*
Name: ${fullName}
Phone: ${phone}
Email: ${email || 'Not provided'}

📍 *Delivery Info:*
State: ${state}
Address: ${address}

⌚ *Order Details:*
Product: MEGIR Chronograph Watch
Color: ${color}
Quantity: ${quantity}
Free Gift: Premium Cufflinks ✓

💰 *Total: ${price.display}${price.discount ? ' (' + price.discount + ')' : ''} + Delivery*

🔗 *Product Link:* ${productUrl}

I'm ready to complete my order. Please send payment details.`

      const whatsappURL = `https://wa.me/2348062605012?text=${encodeURIComponent(message)}`
      window.open(whatsappURL, '_blank')
    }
  }

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-3 px-5 font-semibold text-sm">
        <span className="animate-pulse">🎁 FREE Premium Cufflinks With Every Order Today!</span>
      </div>

      {/* Hero Section */}
      <section className="py-10 md:py-16 px-5 text-center bg-gradient-to-b from-muted/30 to-background relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-block bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            New Arrival
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            The Watch That Gets You <span className="text-primary">Noticed</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            MEGIR Chronograph - Bold design. Premium quality. Made for Nigerian professionals who refuse to blend in.
          </p>

          {/* Video Container */}
          <div className="max-w-md mx-auto mb-8 rounded-2xl overflow-hidden border border-border shadow-lg">
            <div className="relative bg-black" style={{ aspectRatio: '464/624' }}>
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src="/products/megir/MEGIR Chronograph Watch 19.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Price Section */}
          <Card className="max-w-lg mx-auto mb-5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4 flex-wrap mb-4">
                <span className="text-2xl text-muted-foreground line-through">₦65,000</span>
                <span className="text-4xl font-bold text-primary">₦57,000</span>
                <span className="bg-destructive/10 text-destructive px-3 py-1.5 rounded-md text-sm font-bold">
                  SAVE ₦8,000
                </span>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-center gap-2.5 text-primary font-semibold">
                <Gift className="w-6 h-6" />
                FREE Premium Cufflinks Included (Worth ₦5,000)
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <a href="#order-form" onClick={scrollToOrderForm} className="cursor-pointer">
            <Button size="lg" className="w-full max-w-lg text-sm md:text-base font-bold mb-3 py-5 md:py-7 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <span className="flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Order Now on WhatsApp
              </span>
            </Button>
          </a>
          <p className="text-sm text-muted-foreground">Pay via Bank Transfer • Delivery in 2-5 Days</p>

          {/* Trust Badges */}
          <div className="flex justify-center gap-6 md:gap-8 mt-8 flex-wrap text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              1 Year Warranty
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Physical Store in Abeokuta
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Secure Payment
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Does This Sound <span className="text-primary">Familiar?</span>
          </h2>

          <div className="space-y-5 max-w-2xl mx-auto">
            {[
              "You're tired of cheap watches that stop working after 2 months",
              "You want to look successful but can't spend ₦500k on a Rolex",
              "You've been scammed before buying \"original\" watches online",
              "Your current watch can't handle Lagos humidity and harmattan dust"
            ].map((problem, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-destructive/5 border-l-4 border-destructive rounded-r-xl">
                <X className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{problem}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-2xl mx-auto p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20 text-center">
            <p className="text-lg">
              <strong>Good news.</strong> The MEGIR Chronograph solves all of this at a price that won&apos;t break your account.
            </p>
          </div>
        </div>
      </section>

      {/* Image Gallery 1 */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            See It <span className="text-primary">Up Close</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="aspect-square rounded-xl overflow-hidden border border-border">
              <img src="/products/megir/MEGIR Chronograph Watch 6.jpeg" alt="MEGIR watch on wrist" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden border border-border">
              <img src="/products/megir/MEGIR Chronograph Watch 7.jpeg" alt="MEGIR chronograph face detail" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden border border-border">
              <img src="/products/megir/MEGIR Chronograph Watch 9.jpeg" alt="MEGIR watch angle view" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden border border-border">
              <img src="/products/megir/MEGIR Chronograph Watch 10.jpeg" alt="MEGIR watch side angle" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            What Makes This Watch <span className="text-primary">Special</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Working Chronograph",
                description: "All 3 subdials actually work. Time events, track hours, and check dates."
              },
              {
                icon: Cloud,
                title: "Weather-Proof Strap",
                description: "Silicone strap handles heat, humidity, and sweat without cracking."
              },
              {
                icon: Moon,
                title: "Luminous Hands",
                description: "Check time in the dark. Perfect for those early morning runs or late nights."
              },
              {
                icon: Shield,
                title: "Stainless Steel Case",
                description: "Scratch-resistant. Durable. Built to last beyond your expectations."
              }
            ].map((feature, i) => (
              <Card key={i} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-15 h-15 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-5">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2.5">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* More Product Details */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Every <span className="text-primary">Detail</span> Matters
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img src="/products/megir/MEGIR Chronograph Watch 11.jpeg" alt="MEGIR watch detail shot" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img src="/products/megir/MEGIR Chronograph Watch 12.jpeg" alt="MEGIR watch craftsmanship" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Color Options */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="text-primary">Color</span>
          </h2>
          <p className="text-muted-foreground mb-8">4 Bold Colors. Pick the one that matches your style.</p>

          <div className="grid grid-cols-4 gap-2 md:gap-5 max-w-xl mx-auto mb-10">
            {colorOptions.map((option) => (
              <div key={option.name} className="flex flex-col items-center gap-1.5 md:gap-2.5">
                <button
                  onClick={() => handleColorSelect(option.name)}
                  className={`w-14 h-14 md:w-20 md:h-20 rounded-full border-3 md:border-4 transition-all relative ${
                    selectedColor === option.name
                      ? 'border-primary scale-110 shadow-lg'
                      : 'border-border hover:border-primary/50 hover:scale-105'
                  }`}
                  style={{ backgroundColor: option.color }}
                  aria-label={option.name}
                >
                  {selectedColor === option.name && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-lg" fill="currentColor" />
                    </div>
                  )}
                </button>
                <span className={`text-[10px] md:text-sm transition-all text-center ${
                  selectedColor === option.name
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground'
                }`}>
                  {option.name}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            {colorOptions.map((option) => (
              <div
                key={option.name}
                className={`aspect-square rounded-xl overflow-hidden transition-all cursor-pointer relative ${
                  selectedColor === option.name
                    ? 'border-4 border-primary shadow-2xl scale-105'
                    : 'border border-border hover:border-primary/50 hover:scale-102'
                }`}
                onClick={() => handleColorSelect(option.name)}
              >
                <img
                  src={`/products/megir/MEGIR Chronograph Watch ${option.images[0]}.jpeg`}
                  alt={`${option.name} MEGIR watch in box`}
                  className="w-full h-full object-cover"
                />
                {selectedColor === option.name && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Full <span className="text-primary">Specifications</span>
          </h2>

          <Card className="max-w-2xl mx-auto mb-8">
            <CardContent className="p-0">
              {[
                { label: 'Brand', value: 'MEGIR (Est. 2008)' },
                { label: 'Movement', value: 'Japanese Quartz' },
                { label: 'Case Material', value: 'Stainless Steel' },
                { label: 'Strap Material', value: 'Silicone Rubber' },
                { label: 'Case Diameter', value: '44mm' },
                { label: 'Water Resistance', value: '30M (Splash Proof)' },
                { label: 'Features', value: 'Chronograph, Date, Luminous' },
                { label: 'Closure', value: 'Pin Buckle' }
              ].map((spec, i) => (
                <div
                  key={i}
                  className={`flex justify-between p-4 ${i % 2 === 0 ? 'bg-muted/30' : ''} ${i !== 7 ? 'border-b border-border' : ''}`}
                >
                  <span className="text-sm text-muted-foreground">{spec.label}</span>
                  <span className="text-sm font-semibold text-right">{spec.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-border">
            <img src="/products/megir/MEGIR Chronograph Watch 8.jpeg" alt="MEGIR watch features diagram" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Color Comparison */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Compare <span className="text-primary">Colors</span> Side by Side
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img src="/products/megir/MEGIR Chronograph Watch 13.jpeg" alt="MEGIR watches color comparison 1" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img src="/products/megir/MEGIR Chronograph Watch 14.jpeg" alt="MEGIR watches color comparison 2" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-border shadow-lg">
            <img src="/products/megir/MEGIR Chronograph Watch 5.jpeg" alt="MEGIR watch in premium gift box" className="w-full h-full object-cover" />
          </div>
          <p className="text-center text-muted-foreground mt-4">Comes in original MEGIR packaging - perfect for gifting</p>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            This Watch Is <span className="text-primary">For You</span> If...
          </h2>

          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              {
                title: "🎯 The Ambitious Professional",
                text: "You have meetings, presentations, and networking events. First impressions matter. This watch tells people \"I pay attention to details\" before you even speak."
              },
              {
                title: "💼 The Smart Spender",
                text: "You want quality without emptying your account. You know the difference between \"expensive\" and \"valuable.\" This watch is valuable."
              },
              {
                title: "🎁 The Gift Giver",
                text: "Looking for a perfect gift for him? This comes in a premium MEGIR box with gift bag. Ready to unwrap. Ready to impress."
              },
              {
                title: "⚡ The Style-Conscious Man",
                text: "You don't follow trends - you set them. Five unique colors mean you can match your mood, outfit, or occasion. Stand out, don't blend in."
              }
            ].map((persona, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <h4 className="text-lg font-bold mb-3 text-primary">{persona.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{persona.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Why Nigerian Men <span className="text-primary">Love</span> This Watch
          </h2>

          <div className="space-y-5 max-w-2xl mx-auto">
            {[
              {
                title: "Built for Nigerian Weather",
                text: "The silicone strap won't crack in harmattan or get sticky in Lagos humidity. It survives where leather fails."
              },
              {
                title: "Compliment Magnet",
                text: "\"Where did you get that watch?\" - prepare to answer this question a lot. The bold design commands attention."
              },
              {
                title: "Office to Owambe Ready",
                text: "Professional enough for the boardroom. Stylish enough for the party. One watch for every occasion."
              },
              {
                title: "Premium Unboxing Experience",
                text: "Comes in original MEGIR branded box with gift bag. Perfect for gifting or treating yourself."
              }
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5.5 h-5.5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1.5">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Packaging Section */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Premium <span className="text-primary">Packaging</span> & Unboxing
          </h2>
          <p className="text-center text-muted-foreground mb-10">Every watch comes in an original MEGIR gift box - ready to impress</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <div className="relative bg-black" style={{ aspectRatio: '720/1280' }}>
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                >
                  <source src="/products/megir/MEGIR Chronograph Watch 20.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <div className="relative bg-black" style={{ aspectRatio: '720/1280' }}>
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                >
                  <source src="/products/megir/MEGIR Chronograph Watch 21.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <div className="relative bg-black" style={{ aspectRatio: '720/1280' }}>
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                >
                  <source src="/products/megir/MEGIR Chronograph Watch 22.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            What <span className="text-primary">Customers</span> Say
          </h2>

          <div className="space-y-6 max-w-2xl mx-auto">
            {[
              {
                text: "I was skeptical about buying a watch online in Nigeria. But BaaWA delivered exactly what I saw in the pictures. The quality surprised me for the price. Already planning to get another color!",
                author: "Adebayo O.",
                location: "Lagos",
                initials: "AO"
              },
              {
                text: "Bought the white one for my husband's birthday. He hasn't stopped wearing it! The packaging was impressive too - didn't need to buy a gift box separately.",
                author: "Funke E.",
                location: "Abuja",
                initials: "FE"
              },
              {
                text: "The chronograph actually works! I use it to time my workouts. Very solid build quality. Friends keep asking where I got it from.",
                author: "Chukwuemeka E.",
                location: "Port Harcourt",
                initials: "CE"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="relative">
                <CardContent className="pt-6">
                  <div className="text-7xl font-serif text-primary/20 absolute top-2.5 left-5 leading-none select-none">
                    &ldquo;
                  </div>
                  <p className="text-muted-foreground mb-5 relative z-10 leading-relaxed">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center font-bold text-primary-foreground">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm">{testimonial.author}</h5>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-3.5 h-3.5 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-green-500/5 to-transparent border-2 border-green-600/30">
            <CardContent className="pt-10 text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Promise To You</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We stand behind every watch we sell. If it stops working within 1 year, we&apos;ll repair or replace it - no questions asked.
              </p>
              <ul className="text-left max-w-md mx-auto space-y-3">
                {[
                  "1 Year Warranty on all watches",
                  "Free repair if watch stops working",
                  "Replacement if repair isn't possible",
                  "Real store, real people, real accountability"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Objections Section */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Still Have <span className="text-primary">Questions?</span>
          </h2>

          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              {
                question: "\"Is this watch original?\"",
                answer: "Yes! This is an authentic MEGIR watch with original packaging, box, and gift bag. MEGIR is an established watch brand since 2008, known for affordable chronographs worldwide. We don't sell replicas of other brands - this is the real deal."
              },
              {
                question: "\"How do I know you won't scam me?\"",
                answer: "We have a physical store in Abeokuta you can visit anytime. Our WhatsApp is +234-806-260-5012 - you can video call us to see the exact watch before paying. We've served thousands of customers across Nigeria. You can even ask us to send a video of your specific watch before you transfer."
              },
              {
                question: "\"Why don't you offer Pay on Delivery?\"",
                answer: "Bank transfer allows us to keep prices low. Pay on Delivery adds extra costs that we'd have to pass to you. Plus, we confirm every order via WhatsApp - you chat with us, see the product, and only pay when you're 100% comfortable. We're a registered business with a physical store. Your money is safe."
              },
              {
                question: "\"What if the watch is damaged when it arrives?\"",
                answer: "Every watch is inspected and packaged carefully. But if anything arrives damaged, send us photos within 48 hours and we'll replace it at no extra cost. We're not here to scam anyone - we want you coming back for more!"
              },
              {
                question: "\"How long will delivery take?\"",
                answer: "Lagos gets same-day dispatch. Other states receive their orders within 2-5 business days depending on location. You'll get tracking updates via WhatsApp so you always know where your package is."
              }
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="p-0 overflow-hidden">
                  <div className="bg-primary/10 px-6 py-4 font-semibold text-primary text-sm">
                    {item.question}
                  </div>
                  <div className="px-6 py-5 text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Visit Our <span className="text-primary">Physical Store</span> in Abeokuta
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            We&apos;re not just online - come see our watches in person, try them on, and experience our quality firsthand
          </p>

          {/* Store Images */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img src="/Store full building picture.jpeg" alt="BaaWA Accessories store building in Abeokuta" className="w-full h-full object-cover aspect-video" />
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img src="/Store front with bill board.jpg" alt="BaaWA store front with billboard" className="w-full h-full object-cover aspect-video" />
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img src="/Baawa store table.png" alt="BaaWA store display table" className="w-full h-full object-cover aspect-video" />
            </div>
          </div>

          {/* Store Videos */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src="/Store shelf.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="bg-muted/50 p-3 text-center">
                <p className="text-sm font-semibold">Inside our store - Product displays</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src="/Store table.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="bg-muted/50 p-3 text-center">
                <p className="text-sm font-semibold">Live footage from our store</p>
              </div>
            </div>
          </div>

          {/* Store Contact Card */}
          <Card className="max-w-2xl mx-auto border-2 border-primary/30">
            <CardContent className="pt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center md:text-left">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                    <Store className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">BaaWA Accessories</h3>
                  <p className="text-primary font-semibold mb-3">📍 Abeokuta, Ogun State, Nigeria</p>
                  <p className="text-sm text-muted-foreground mb-4">Walk in anytime to see and try our watches before buying.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Call/WhatsApp</p>
                      <p className="font-semibold">+234-806-260-5012</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-semibold">Sales@baawa.ng</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/30">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-primary font-semibold">Open Daily</p>
                      <p className="font-semibold text-sm">Visit us anytime!</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>

          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              {
                question: "Does the chronograph actually work?",
                answer: "Yes! All three subdials are functional - hour meter, 24-hour display, and small seconds. The chronograph pushers on the side control the stopwatch function."
              },
              {
                question: "Can I swim with this watch?",
                answer: "The watch is 30M water resistant - good for rain and hand washing, but not for swimming or showering. Remove before entering water."
              },
              {
                question: "What payment methods do you accept?",
                answer: "Bank transfer only. After you fill the form, we'll send our account details via WhatsApp. Once payment is confirmed, your order ships immediately."
              },
              {
                question: "Do you deliver nationwide?",
                answer: "Yes! We deliver to all 36 states plus FCT. Lagos orders ship same day. Other locations receive within 2-5 business days."
              },
              {
                question: "What's included in the box?",
                answer: "You get: MEGIR watch, original MEGIR box, branded gift bag, and FREE premium cufflinks (limited offer)."
              }
            ].map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full px-6 py-5 flex justify-between items-center font-semibold text-left hover:bg-muted/30 transition-colors"
                  >
                    {faq.question}
                    <ChevronDown
                      className={`w-5 h-5 text-primary transition-transform ${activeFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {activeFaq === i && (
                    <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section id="order-form" className="py-16 px-5 bg-gradient-to-b from-muted/30 to-background relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <Card className="max-w-lg mx-auto border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-center">Order Your Watch Now</CardTitle>
              <CardDescription className="text-center">Fill the form below. We&apos;ll confirm via WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block mb-2 font-semibold text-sm">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-2 font-semibold text-sm">WhatsApp Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="e.g., 08012345678"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 font-semibold text-sm">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block mb-2 font-semibold text-sm">Delivery State *</label>
                  <select
                    id="state"
                    name="state"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%23888888'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center'
                    }}
                  >
                    <option value="">Select your state</option>
                    {['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'].map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="address" className="block mb-2 font-semibold text-sm">Delivery Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    placeholder="Enter your full delivery address"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block mb-2 font-semibold text-sm">Watch Color *</label>
                  <select
                    id="color"
                    name="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%23888888'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center'
                    }}
                  >
                    {colorOptions.map((option) => (
                      <option key={option.name} value={option.name}>{option.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-11 h-11 bg-input border border-border rounded-lg hover:border-primary transition-colors flex items-center justify-center text-xl font-semibold"
                    >
                      −
                    </button>
                    <span className="text-xl font-bold min-w-[40px] text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-11 h-11 bg-input border border-border rounded-lg hover:border-primary transition-colors flex items-center justify-center text-xl font-semibold"
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-3 bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
                    <p className="text-sm text-primary font-semibold">
                      🔥 Buy 2+ and get <strong>30-40% OFF!</strong>
                    </p>
                  </div>
                </div>

                <Card>
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Watch Price</span>
                      <span className="font-semibold">
                        {price.display} {price.discount && <span className="text-primary ml-1">({price.discount})</span>}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Free Gift</span>
                      <span className="font-semibold text-green-600">Premium Cufflinks ✓</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-semibold">Calculated after</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-lg text-primary">{price.display} + Delivery</span>
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full text-sm md:text-base font-bold py-5 md:py-7 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                  <span className="flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <Phone className="w-5 h-5" />
                        Complete Order on WhatsApp
                      </>
                    )}
                  </span>
                </Button>

                <div className="text-center p-4 bg-destructive/5 border border-destructive/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">⚠️ Important:</strong> Payment confirms your order. We do NOT offer Pay on Delivery. Bank transfer details will be sent via WhatsApp.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-5 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready To <span className="text-primary">Upgrade</span> Your Style?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Stop wearing cheap watches that embarrass you. Get a timepiece that commands respect.
          </p>
          <a href="#order-form" onClick={scrollToOrderForm} className="cursor-pointer">
            <Button size="lg" className="text-sm md:text-base font-bold py-5 md:py-7 px-4 md:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <span className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Order Now - ₦57,000 + Free Gift</span>
                <span className="sm:hidden">Order - ₦57k + Gift</span>
              </span>
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-5 bg-muted/30 border-t border-border text-center">
        <div className="max-w-3xl mx-auto">
          <img
            src="/logo/baawa-logo-brand-color.png"
            alt="BaaWA Accessories"
            className="h-8 md:h-10 mx-auto mb-6"
          />
          <p className="text-sm text-muted-foreground mb-2">
            WhatsApp: <a href="https://wa.me/2348062605012" className="text-primary hover:underline">+234-806-260-5012</a>
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            Email: <a href="mailto:Sales@baawa.ng" className="text-primary hover:underline">Sales@baawa.ng</a>
          </p>
          <p className="text-sm text-muted-foreground mb-5">📍 Abeokuta, Ogun State, Nigeria</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BaaWA Accessories. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Order Button - Stuck to Bottom */}
      {showFloatingButton && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border shadow-2xl animate-in slide-in-from-bottom">
          <div className="max-w-4xl mx-auto px-5 py-4">
            <a href="#order-form" onClick={scrollToOrderForm} className="cursor-pointer block">
              <Button size="lg" className="w-full text-sm md:text-base font-bold py-5 md:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <span className="flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Now - {price.display} {price.discount && `(${price.discount})`}
                </span>
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
