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
  ShoppingCart,
  Award,
  Package
} from "lucide-react"

export default function SuccessBundlePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('Navy Blue')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  const bundlePrice = 79000
  const originalValue = 148000

  const colorOptions = [
    { name: 'Navy Blue', color: '#1B3A5F', images: ['15', '3'] },
    { name: 'Classic Black', color: '#1A1A1A', images: ['18', '4'] },
    { name: 'Pure White', color: '#F5F5F5', images: ['16', '1'] },
    { name: 'Teal', color: '#40E0D0', images: ['17', '2'] }
  ]

  const bundleItems = [
    { name: 'MEGIR Executive Chronograph Watch', value: 65000, description: 'Japanese Quartz movement, working chronograph, stainless steel case, weather-proof silicone strap' },
    { name: 'Premium Leather Slim Bifold Wallet', value: 20000, description: 'Genuine leather bifold wallet for the modern executive' },
    { name: 'Executive Metal Pen', value: 12000, description: 'Weighted metal pen perfect for signing important documents' },
    { name: 'Watch Care & Maintenance Kit', value: 8000, description: 'Microfiber cloth, mini screwdriver set, velvet travel pouch' },
    { name: '"Power Presence" Digital Style Guide', value: 15000, description: 'Learn how to dress for authority and control first impressions' },
    { name: 'Extra Silicone Strap (Your Choice)', value: 10000, description: 'Alternative strap in your choice of color for variety' },
    { name: 'Premium Cufflinks Set', value: 8000, description: 'Brushed metal cufflinks for formal occasions' },
    { name: 'Extended 2-Year Warranty', value: 10000, description: 'Free repair or replacement for any manufacturing issues' }
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
    const colorSelect = document.getElementById('color') as HTMLSelectElement
    if (colorSelect) {
      colorSelect.value = colorName
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('section')
      const orderForm = document.getElementById('order-form')

      if (heroSection && orderForm) {
        const heroBottom = heroSection.getBoundingClientRect().bottom
        const formTop = orderForm.getBoundingClientRect().top
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
    const fullName = formData.get('fullName')
    const phone = formData.get('phone')
    const email = formData.get('email') || ''
    const state = formData.get('state')
    const address = formData.get('address')
    const color = formData.get('color')

    const orderData = {
      full_name: fullName,
      phone: phone,
      email: email,
      state: state,
      address: address,
      product_name: 'MEGIR Success Bundle (8 Items)',
      color: color,
      quantity: 1,
      price: bundlePrice,
      total_price: bundlePrice,
      discount: '47% OFF'
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()
      if (!response.ok) {
        console.error('Failed to save order:', result)
      }

      const message = `🛍️ *NEW ORDER - MEGIR SUCCESS BUNDLE*

👤 *Customer Details:*
Name: ${fullName}
Phone: ${phone}
Email: ${email || 'Not provided'}

📍 *Delivery Info:*
State: ${state}
Address: ${address}

⌚ *Order Details:*
Product: MEGIR Success Bundle (8 Items)
- MEGIR Chronograph Watch (${color})
- Premium Leather Wallet
- Executive Metal Pen
- Watch Care Kit
- Power Presence Style Guide
- Extra Silicone Strap
- Premium Cufflinks
- 2-Year Extended Warranty

💰 *Total: ₦79,000 (47% OFF - Save ₦69,000!) + Delivery*

I'm ready to complete my order. Please send payment details.`

      const whatsappURL = `https://wa.me/2348062605012?text=${encodeURIComponent(message)}`
      const thankYouURL = `/thank-you?product=MEGIR+Success+Bundle&color=${encodeURIComponent(color as string)}&quantity=1&total=${bundlePrice}&phone=${phone}&whatsapp=${encodeURIComponent(whatsappURL)}`

      window.location.href = thankYouURL

    } catch (error) {
      console.error('Error submitting order:', error)
      setIsSubmitting(false)
      const message = `🛍️ *NEW ORDER - MEGIR SUCCESS BUNDLE*

👤 *Customer Details:*
Name: ${fullName}
Phone: ${phone}
Email: ${email || 'Not provided'}

📍 *Delivery Info:*
State: ${state}
Address: ${address}

⌚ *Order Details:*
Product: MEGIR Success Bundle (8 Items)
Watch Color: ${color}

💰 *Total: ₦79,000 (47% OFF) + Delivery*

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
      {/* Urgency Banner */}
      <div className="bg-destructive text-primary-foreground text-center py-3 px-5 font-semibold text-sm">
        <span className="animate-pulse">⚡ Only 47 Success Bundles Remaining - Limited Stock!</span>
      </div>

      {/* Hero Section */}
      <section className="py-10 md:py-16 px-5 text-center bg-gradient-to-b from-muted/30 to-background relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-block bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            Success Bundle
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Stop Wearing Watches That <span className="text-destructive">Embarrass You</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            The executive timepiece Nigerian professionals are switching to — without paying Rolex prices.
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
                <span className="text-2xl text-muted-foreground line-through">₦148,000</span>
                <span className="text-4xl font-bold text-primary">₦79,000</span>
                <span className="bg-destructive/10 text-destructive px-3 py-1.5 rounded-md text-sm font-bold">
                  SAVE ₦69,000
                </span>
              </div>

              <div className="pt-4 border-t border-border text-center">
                <p className="text-primary font-semibold mb-2">
                  <Package className="w-5 h-5 inline mr-2" />
                  Complete 8-Item Success Bundle
                </p>
                <p className="text-sm text-muted-foreground">Everything you need to command respect</p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <a href="#order-form" onClick={scrollToOrderForm} className="cursor-pointer">
            <Button size="lg" className="w-full max-w-lg text-sm md:text-base font-bold mb-3 py-5 md:py-7 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <span className="flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Order Success Bundle Now
              </span>
            </Button>
          </a>
          <p className="text-sm text-muted-foreground">Pay via Bank Transfer • Delivery in 2-5 Days</p>

          {/* Trust Badges */}
          <div className="flex justify-center gap-6 md:gap-8 mt-8 flex-wrap text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              2 Year Warranty
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Physical Store in Abeokuta
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              8 Premium Items
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Sound <span className="text-primary">Familiar?</span>
          </h2>

          <div className="space-y-5 max-w-2xl mx-auto">
            {[
              "Your watch stopped working after 2-3 months and you're back to square one",
              "That leather strap cracked from Lagos heat and harmattan dust",
              "You can't justify spending ₦500,000 on a watch right now",
              "You've been scammed before buying \"original\" watches online"
            ].map((problem, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-destructive/5 border-l-4 border-destructive rounded-r-xl">
                <X className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{problem}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-2xl mx-auto p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20 text-center">
            <p className="text-lg">
              <strong>We understand.</strong> That&apos;s exactly why we created the Success Bundle — everything you need to look and feel successful, without breaking the bank.
            </p>
          </div>
        </div>
      </section>

      {/* Product Introduction */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Introducing the MEGIR <span className="text-primary">Success Chronograph</span>
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Get the premium watch look for a fraction of the price. Plus 7 essential accessories to complete your executive image.
          </p>

          {/* Image Gallery */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img src="/products/megir/MEGIR Chronograph Watch 8.jpeg" alt="MEGIR Executive Chronograph" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img src="/products/megir/MEGIR Chronograph Watch 7.jpeg" alt="MEGIR Chronograph detail" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Features */}
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
                description: "Check time in the dark. Perfect for early mornings or late nights."
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

      {/* Bundle Value Stack */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What&apos;s Inside The <span className="text-primary">Success Bundle</span>
          </h2>
          <p className="text-center text-muted-foreground mb-10">8 premium items that complete your professional image</p>

          <div className="space-y-4 max-w-2xl mx-auto">
            {bundleItems.map((item, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-primary font-bold text-sm">{i + 1}</span>
                        </div>
                        <h4 className="font-bold text-sm md:text-base">{item.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground ml-10">{item.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">₦{item.value.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Total Value Box */}
          <Card className="max-w-2xl mx-auto mt-8 border-2 border-primary">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground mb-2">Total Value If Bought Separately</p>
                <p className="text-3xl font-bold line-through text-muted-foreground mb-2">₦148,000</p>
                <p className="text-sm text-muted-foreground mb-4">Your Success Bundle Price Today</p>
                <p className="text-5xl font-bold text-primary mb-2">₦79,000</p>
                <p className="text-xl font-semibold text-green-600">You Save ₦69,000 (47% OFF!)</p>
              </div>
              <a href="#order-form" onClick={scrollToOrderForm} className="cursor-pointer block mt-6">
                <Button size="lg" className="w-full font-bold">
                  Claim Your Success Bundle Now
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Color Options */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Watch <span className="text-primary">Color</span>
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
                  alt={`${option.name} MEGIR watch`}
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

      {/* Guarantee Section */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-green-500/5 to-transparent border-2 border-green-600/30">
            <CardContent className="pt-10 text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Our "Respect Guaranteed" Promise</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We stand behind every Success Bundle. If you&apos;re not completely satisfied, we make it right.
              </p>
              <ul className="text-left max-w-md mx-auto space-y-3">
                {[
                  "Physical store you can visit in Abeokuta - we're real people, not ghosts",
                  "WhatsApp video call anytime - see your watch before you pay",
                  "Pre-shipment photo confirmation - know exactly what you're getting",
                  "48-hour damage protection - any shipping damage, we replace it free",
                  "2-year extended warranty - free repair or replacement"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            What <span className="text-primary">Customers</span> Say
          </h2>

          <div className="space-y-6 max-w-2xl mx-auto">
            {[
              {
                text: "I bought the Success Bundle and wow! The watch alone is worth it, but the wallet and pen? Chef's kiss. My colleagues keep asking where I got everything.",
                author: "Tunde A.",
                location: "Lagos",
                initials: "TA"
              },
              {
                text: "Skeptical at first, but BaaWA delivered! Everything came in perfect condition. The 2-year warranty gives me peace of mind. Already recommended to my brother.",
                author: "Ibrahim K.",
                location: "Abuja",
                initials: "IK"
              },
              {
                text: "Got this as a gift for my husband. He's been wearing the watch daily for 6 months now - still perfect! The bundle extras were a pleasant surprise.",
                author: "Chioma N.",
                location: "Port Harcourt",
                initials: "CN"
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

      {/* Store Section */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Visit Our <span className="text-primary">Physical Store</span> in Abeokuta
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            We&apos;re not just online - come see our products in person and experience our quality firsthand
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img src="/Store full building picture.jpeg" alt="BaaWA store building" className="w-full h-full object-cover aspect-video" />
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img src="/Store front with bill board.jpg" alt="BaaWA store front" className="w-full h-full object-cover aspect-video" />
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img src="/Baawa store table.png" alt="BaaWA store display" className="w-full h-full object-cover aspect-video" />
            </div>
          </div>

          <Card className="max-w-2xl mx-auto border-2 border-primary/30">
            <CardContent className="pt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center md:text-left">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                    <Store className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">BaaWA Accessories</h3>
                  <p className="text-primary font-semibold mb-3">📍 Abeokuta, Ogun State, Nigeria</p>
                  <p className="text-sm text-muted-foreground mb-4">Visit anytime to see our products before buying.</p>
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Order Form Section */}
      <section id="order-form" className="py-16 px-5 bg-gradient-to-b from-muted/30 to-background relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <Card className="max-w-lg mx-auto border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-center">Order Your Success Bundle</CardTitle>
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

                <Card>
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bundle Price</span>
                      <span className="font-semibold">₦79,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Value</span>
                      <span className="font-semibold line-through">₦148,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">You Save</span>
                      <span className="font-semibold text-green-600">₦69,000 (47%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-semibold">Calculated after</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-lg text-primary">₦79,000 + Delivery</span>
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
            One Year From Today, You&apos;ll <span className="text-primary">Thank Yourself</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            For investing in quality. For choosing respect. For getting the Success Bundle.
          </p>
          <a href="#order-form" onClick={scrollToOrderForm} className="cursor-pointer">
            <Button size="lg" className="text-sm md:text-base font-bold py-5 md:py-7 px-4 md:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <span className="flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                Get Success Bundle - ₦79,000
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

      {/* Floating Order Button */}
      {showFloatingButton && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border shadow-2xl animate-in slide-in-from-bottom">
          <div className="max-w-4xl mx-auto px-5 py-4">
            <a href="#order-form" onClick={scrollToOrderForm} className="cursor-pointer block">
              <Button size="lg" className="w-full text-sm md:text-base font-bold py-5 md:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <span className="flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Bundle - ₦79,000 (Save ₦69k!)
                </span>
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
