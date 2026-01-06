"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Gift,
  Shield,
  MapPin,
  Heart,
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
  Package
} from "lucide-react"

export default function GiftBundlePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('Navy Blue')
  const [selectedRelationship, setSelectedRelationship] = useState<string>('Husband')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  const bundlePrice = 79000
  const originalValue = 148000

  const colorOptions = [
    { name: 'Navy Blue', color: '#1B3A5F', images: ['15', '3'], note: 'Most popular for gifts' },
    { name: 'Classic Black', color: '#1A1A1A', images: ['18', '4'], note: 'Timeless & versatile' },
    { name: 'Pure White', color: '#F5F5F5', images: ['16', '1'], note: 'Modern & clean' },
    { name: 'Teal', color: '#40E0D0', images: ['17', '2'], note: 'Bold statement' }
  ]

  const relationships = ['Husband', 'Boyfriend', 'Fiancé', 'Father', 'Brother', 'Friend']

  const bundleItems: Array<{ name: string; value: number; description: string; highlighted: boolean; priceless?: boolean }> = [
    { name: 'MEGIR Executive Chronograph Watch', value: 65000, description: 'Japanese Quartz movement, working chronograph, stainless steel case, weather-proof silicone strap', highlighted: false },
    { name: 'Premium Leather Slim Bifold Wallet', value: 20000, description: 'Genuine leather bifold wallet for the modern executive', highlighted: false },
    { name: 'Executive Metal Pen', value: 12000, description: 'Weighted metal pen perfect for signing important documents', highlighted: false },
    { name: 'Watch Care & Maintenance Kit', value: 8000, description: 'Microfiber cloth, mini screwdriver set, velvet travel pouch', highlighted: false },
    { name: '"Power Presence" Digital Style Guide', value: 15000, description: 'Learn how to dress for authority and control first impressions', highlighted: false },
    { name: 'Extra Silicone Strap (Your Choice)', value: 10000, description: 'Alternative strap in your choice of color for variety', highlighted: false },
    { name: 'Premium Cufflinks Set', value: 8000, description: 'Brushed metal cufflinks for formal occasions', highlighted: false },
    { name: 'Extended 2-Year Warranty', value: 10000, description: 'Free repair or replacement for any manufacturing issues', highlighted: false }
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
    const yourName = formData.get('yourName')
    const phone = formData.get('phone')
    const email = formData.get('email') || ''
    const state = formData.get('state')
    const address = formData.get('address')
    const hisName = formData.get('hisName')
    const relationship = formData.get('relationship')
    const color = formData.get('color')
    const cardMessage = formData.get('cardMessage') || 'No message'

    const orderData = {
      full_name: yourName,
      phone: phone,
      email: email,
      state: state,
      address: address,
      product_name: 'MEGIR Perfect Gift Bundle',
      color: color,
      quantity: 1,
      price: bundlePrice,
      total_price: bundlePrice,
      discount: null,
      gift_recipient: hisName,
      gift_relationship: relationship,
      gift_message: cardMessage
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

      const productUrl = window.location.origin + window.location.pathname;
      const message = `🎁 *NEW GIFT ORDER - MEGIR PERFECT GIFT BUNDLE*

👤 *Gift From:*
Your Name: ${yourName}
Phone: ${phone}
Email: ${email || 'Not provided'}

🎁 *Gift For:*
His Name: ${hisName}
Relationship: ${relationship}

📍 *Delivery Info:*
State: ${state}
Address: ${address}

⌚ *Gift Bundle Details:*
Watch Color: ${color}

Includes:
✓ MEGIR Chronograph Watch in Gift Box
✓ Luxury Gift Wrapping
✓ Handwritten Card: "${cardMessage}"
✓ Premium Cufflinks Set
✓ Cologne Sample
✓ Pre-Delivery Video
✓ 1-Year Warranty + 7-Day Exchange

💰 *Total: ₦79,000 (47% OFF - Save ₦69,000!) + Delivery*

🔗 *Product Link:* ${productUrl}

Ready to create the perfect gift! Please send payment details.`

      const whatsappURL = `https://wa.me/2348062605012?text=${encodeURIComponent(message)}`
      const thankYouURL = `/thank-you?product=MEGIR+Perfect+Gift+Bundle&color=${encodeURIComponent(color as string)}&quantity=1&total=${bundlePrice}&phone=${phone}&whatsapp=${encodeURIComponent(whatsappURL)}`

      window.location.href = thankYouURL

    } catch (error) {
      console.error('Error submitting order:', error)
      setIsSubmitting(false)
      const productUrl = window.location.origin + window.location.pathname;
      const message = `🎁 *NEW GIFT ORDER - MEGIR PERFECT GIFT BUNDLE*

Gift From: ${yourName}
Gift For: ${hisName} (${relationship})
Watch Color: ${color}

Total: ₦79,000 (47% OFF) + Delivery

🔗 *Product Link:* ${productUrl}

Ready to create the perfect gift!`

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
        <span className="animate-pulse">🎁 Complete Gift Package - Ready to Give!</span>
      </div>

      {/* Hero Section */}
      <section className="py-10 md:py-16 px-5 text-center bg-gradient-to-b from-muted/30 to-background relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-block bg-destructive text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            Perfect For His Special Day
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            The Gift He&apos;ll <span className="text-primary">Never Forget</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            A stunning timepiece, beautifully wrapped, with a personal message from you — delivered to your door, ready to give.
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
                  Complete 8-Item Gift Bundle
                </p>
                <p className="text-sm text-muted-foreground">Everything he needs to look successful</p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <a href="#order-form" onClick={scrollToOrderForm} className="cursor-pointer">
            <Button size="lg" className="w-full max-w-lg text-sm md:text-base font-bold mb-3 py-5 md:py-7 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <span className="flex items-center justify-center gap-2">
                <Gift className="w-5 h-5" />
                Order His Perfect Gift Now
              </span>
            </Button>
          </a>
          <p className="text-sm text-muted-foreground">2-Year Warranty • Pay via Bank Transfer • Delivery in 2-5 Days</p>

          {/* Trust Badges */}
          <div className="flex justify-center gap-6 md:gap-8 mt-8 flex-wrap text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              7-Day Exchange
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Gift-Wrapped
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Nationwide Delivery
            </div>
          </div>
        </div>
      </section>

      {/* Empathy Section */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Shopping For Him Is <span className="text-primary">Hard</span>
          </h2>

          <div className="space-y-6 max-w-2xl mx-auto text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
              You&apos;ve given clothes he never wore. Gadgets that collected dust. Cologne that sits unopened.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              You want to give him something <strong className="text-foreground">meaningful</strong>. Something he&apos;ll actually <strong className="text-foreground">use</strong> and <strong className="text-foreground">love</strong>.
            </p>

            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/30">
              <CardContent className="pt-6">
                <p className="text-xl font-semibold leading-relaxed">
                  <span className="text-primary">This is that gift.</span> A watch he&apos;ll wear every day. Beautifully packaged. With a personal touch that shows you really care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Makes This Different */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Ready to Give, <span className="text-primary">Right Out of the Box</span>
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            No wrapping stress for you. No awkward unwrapping for him. Just perfect.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Gift,
                title: "Luxury Gift Wrapping",
                description: "Ribbon, tissue paper, wax seal. Looks like it came from a high-end boutique."
              },
              {
                icon: Heart,
                title: "Your Personal Message",
                description: "We handwrite your message on a beautiful card. He'll know this came from the heart."
              },
              {
                icon: Package,
                title: "Complete Bundle",
                description: "Watch, cufflinks, cologne sample. Everything a man needs in one stunning package."
              },
              {
                icon: Shield,
                title: "Video Preview First",
                description: "We send you a video of the wrapped package before delivery. See it yourself first."
              }
            ].map((feature, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why He'll Love It */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Why He&apos;ll <span className="text-primary">Love</span> It
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Working Chronograph",
                description: "All 3 subdials work. Men love functional details."
              },
              {
                icon: Cloud,
                title: "Built for Nigerian Weather",
                description: "Silicone strap won't crack in harmattan or get sticky in Lagos heat."
              },
              {
                icon: Moon,
                title: "Luminous Hands",
                description: "He can check the time in the dark. Practical and impressive."
              },
              {
                icon: Shield,
                title: "Built to Last",
                description: "Stainless steel case. This isn't another gift that breaks in 3 months."
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

      {/* Everything Included */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything <span className="text-primary">Included</span>
          </h2>
          <p className="text-center text-muted-foreground mb-10">8 premium items worth ₦148,000 for just ₦79,000</p>

          <div className="space-y-4 max-w-2xl mx-auto">
            {bundleItems.map((item, i) => (
              <Card key={i} className={`hover:shadow-lg transition-shadow ${item.highlighted ? 'border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-bold text-sm md:text-base">{item.name}</h4>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {item.priceless ? (
                        <p className="text-sm font-bold text-primary">Priceless</p>
                      ) : (
                        <p className="text-sm font-bold text-primary">₦{item.value.toLocaleString()}</p>
                      )}
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
                <p className="text-sm text-muted-foreground mb-4">Your Complete Gift Bundle Price</p>
                <p className="text-5xl font-bold text-primary mb-2">₦79,000</p>
                <p className="text-xl font-semibold text-green-600">You Save ₦69,000 (47% OFF!)</p>
              </div>
              <a href="#order-form" onClick={scrollToOrderForm} className="cursor-pointer block mt-6">
                <Button size="lg" className="w-full font-bold">
                  Order His Perfect Gift Now
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Color Options */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose <span className="text-primary">His Color</span>
          </h2>
          <p className="text-muted-foreground mb-8">Not sure? Navy Blue is most popular for gifts.</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {colorOptions.map((option) => (
              <Card
                key={option.name}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedColor === option.name
                    ? 'border-2 border-primary shadow-lg'
                    : 'border border-border'
                }`}
                onClick={() => handleColorSelect(option.name)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-16 h-16 rounded-full border-3 ${
                        selectedColor === option.name
                          ? 'border-primary'
                          : 'border-border'
                      }`}
                      style={{ backgroundColor: option.color }}
                    />
                    <div className="text-left flex-1">
                      <h4 className="font-bold mb-1">{option.name}</h4>
                      <p className="text-sm text-muted-foreground">{option.note}</p>
                    </div>
                    {selectedColor === option.name && (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={`/products/megir/MEGIR Chronograph Watch ${option.images[0]}.jpeg`}
                      alt={`${option.name} MEGIR watch`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Gift <span className="text-primary">Stories</span>
          </h2>

          <div className="space-y-6 max-w-2xl mx-auto">
            {[
              {
                text: "When he opened it on his birthday, his face just lit up. The wrapping, the card, everything was perfect. He keeps telling people about the watch AND the way it was wrapped. Thank you for making me look like the best wife ever!",
                author: "Chidinma M.",
                location: "Lagos",
                relationship: "Husband",
                initials: "CM"
              },
              {
                text: "My boyfriend is so hard to shop for. But this? He loved it. Wears it every day. The cologne sample was a nice touch too. Will definitely order again for next occasion.",
                author: "Blessing A.",
                location: "Abuja",
                relationship: "Boyfriend",
                initials: "BA"
              },
              {
                text: "Got this for my dad for Father's Day. He's not usually emotional but you could tell he was moved. The personalized card made it extra special. Best Father's Day gift I've ever given him.",
                author: "Adaeze O.",
                location: "Enugu",
                relationship: "Father",
                initials: "AO"
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
                      <p className="text-xs text-muted-foreground">{testimonial.location} • Gift for {testimonial.relationship}</p>
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

      {/* Perfect Occasions */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Perfect For <span className="text-primary">Any Occasion</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { emoji: '🎂', occasion: 'Birthday' },
              { emoji: '💍', occasion: 'Anniversary' },
              { emoji: '💝', occasion: "Valentine's Day" },
              { emoji: '🎄', occasion: 'Christmas' },
              { emoji: '👔', occasion: "Father's Day" },
              { emoji: '📈', occasion: 'Promotion' }
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <h4 className="font-bold">{item.occasion}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Gift <span className="text-primary">Questions?</span>
          </h2>

          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              {
                question: "What if I don't know his wrist size?",
                answer: "The silicone strap adjusts to fit most wrist sizes (16-22cm). It's designed to be comfortable for most men."
              },
              {
                question: "What if he doesn't like the color?",
                answer: "We offer a 7-day exchange. If he prefers a different color, just let us know within 7 days and we'll exchange it for free."
              },
              {
                question: "What should I write on the card?",
                answer: "Keep it personal and heartfelt. Examples: 'Happy Birthday my love! You deserve the world. — Your wife' or 'To my amazing dad, thanks for everything. Love you! — Your daughter'"
              },
              {
                question: "How long does delivery take?",
                answer: "2-5 business days depending on your location. We'll send you a pre-delivery video so you can see the wrapped package before it ships."
              },
              {
                question: "Can I send it directly to him as a surprise?",
                answer: "Yes! Just provide his delivery address and we'll make sure your card message stays hidden until he opens it."
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
              <CardTitle className="text-2xl md:text-3xl font-bold text-center">Order His Perfect Gift</CardTitle>
              <CardDescription className="text-center">Fill the form below. We&apos;ll confirm via WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="yourName" className="block mb-2 font-semibold text-sm">Your Name *</label>
                  <input
                    type="text"
                    id="yourName"
                    name="yourName"
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="hisName" className="block mb-2 font-semibold text-sm">His Name *</label>
                  <input
                    type="text"
                    id="hisName"
                    name="hisName"
                    placeholder="Enter his name"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">Your Relationship *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {relationships.map((rel) => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => setSelectedRelationship(rel)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedRelationship === rel
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="relationship" value={selectedRelationship} />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-2 font-semibold text-sm">Your WhatsApp Number *</label>
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
                  <label htmlFor="email" className="block mb-2 font-semibold text-sm">Your Email (Optional)</label>
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
                    <option value="">Select delivery state</option>
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
                    placeholder="Enter full delivery address"
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
                      <option key={option.name} value={option.name}>{option.name} — {option.note}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="cardMessage" className="block mb-2 font-semibold text-sm">Your Card Message (Optional)</label>
                  <textarea
                    id="cardMessage"
                    name="cardMessage"
                    rows={3}
                    placeholder="E.g., Happy Birthday my love! You deserve the world. — Your wife"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
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

                <div className="text-center p-4 bg-primary/5 border border-primary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">🎁 Next Step:</strong> We&apos;ll confirm via WhatsApp and send you a video preview before delivery.
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
            This Is the Year You Give the <span className="text-primary">Perfect Gift</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            No more gift stress. No more \"he didn&apos;t like it.\" Just a beautiful, meaningful gift he&apos;ll treasure.
          </p>
          <a href="#order-form" onClick={scrollToOrderForm} className="cursor-pointer">
            <Button size="lg" className="text-sm md:text-base font-bold py-5 md:py-7 px-4 md:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <span className="flex items-center justify-center gap-2">
                <Gift className="w-5 h-5" />
                Order Gift Bundle - ₦79,000
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
                  Order Gift Bundle - ₦79,000 (Save ₦69k!)
                </span>
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
