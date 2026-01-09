"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Gift,
  Shield,
  Clock,
  Cloud,
  Moon,
  CheckCircle2,
  ChevronDown,
  Phone,
  Loader2,
  ShoppingCart,
  Package
} from "lucide-react"

export default function GiftBundlePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('Navy Blue')
  const [selectedRelationship, setSelectedRelationship] = useState<string>('Husband')
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  // Stock status flag - change to true when product is out of stock
  const isOutOfStock = false

  const bundlePrice = 79000

  const calculatePrice = () => {
    if (quantity === 1) {
      return { total: bundlePrice, display: "₦79,000", discount: null, savings: null }
    } else if (quantity === 2) {
      const total = Math.round(bundlePrice * 2 * 0.85) // 15% off
      const savings = (bundlePrice * 2) - total
      return { total, display: `₦${total.toLocaleString()}`, discount: "15% OFF!", savings }
    } else {
      const total = Math.round(bundlePrice * quantity * 0.7) // 30% off
      const savings = (bundlePrice * quantity) - total
      return { total, display: `₦${total.toLocaleString()}`, discount: "30% OFF!", savings }
    }
  }

  const colorOptions = [
    { name: 'Navy Blue', color: '#1B3A5F', images: ['15', '3'], note: 'Most popular for gifts' },
    { name: 'Classic Black', color: '#1A1A1A', images: ['18', '4'], note: 'Timeless & versatile' },
    { name: 'Pure White', color: '#F5F5F5', images: ['16', '1'], note: 'Modern & clean' },
    { name: 'Teal', color: '#40E0D0', images: ['17', '2'], note: 'Bold statement' }
  ]

  const relationships = ['Husband', 'Boyfriend', 'Fiancé', 'Father', 'Brother', 'Friend']

  const bundleItems: Array<{ name: string; value: number; description: string; highlighted: boolean; priceless?: boolean }> = [
    { name: 'MEGIR Chronograph Watch in Gift Box', value: 65000, description: 'The star of the show. Bold design, working chronograph, stainless steel case. Choose from 4 colors - Navy Blue is our most popular for gifts.', highlighted: false },
    { name: 'Luxury Gift Wrapping', value: 5000, description: 'Premium paper, satin ribbon, tissue paper, wax seal. When he sees this package, he\'ll know something special is inside. No wrapping stress for you.', highlighted: true },
    { name: 'Handwritten Personalized Card', value: 3000, description: 'Tell him how you feel - in YOUR words. We write it by hand on a premium card. Personal. Meaningful. Impossible to forget.', highlighted: true },
    { name: 'Premium Cufflinks Set', value: 10000, description: 'Brushed metal finish in velvet-lined box. For weddings, owambes, important meetings - elevates the gift from "nice watch" to "complete gentleman\'s set."', highlighted: false },
    { name: 'Designer-Style Cologne Sample', value: 8000, description: 'A 10ml sample of sophisticated men\'s fragrance. The unexpected luxury touch that makes him think "She really thought about this."', highlighted: false },
    { name: 'Pre-Delivery Video Confirmation', value: 0, description: 'See exactly what he\'ll receive BEFORE we ship. The watch, the wrapped package, your card - you approve it, then we send. Complete peace of mind.', highlighted: true, priceless: true },
    { name: '1-Year Warranty + 7-Day Exchange', value: 8000, description: 'If anything goes wrong, we fix it. If he\'d prefer a different color, let us know within 7 days - we\'ll swap it. Zero risk.', highlighted: false }
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
        const windowHeight = window.innerHeight

        // Show button when hero is scrolled past and form is not yet visible or partially visible
        setShowFloatingButton(heroBottom < 0 && formTop > windowHeight * 0.2)
      }
    }

    handleScroll() // Check on mount
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const formQuantity = parseInt(formData.get('quantity') as string) || quantity
    const priceData = calculatePrice()
    const yourName = formData.get('yourName')
    const phone = formData.get('phone')
    const email = formData.get('email') || ''
    const state = formData.get('state')
    const address = formData.get('address')
    const hisName = formData.get('hisName')
    const relationship = formData.get('relationship')
    const color = formData.get('color')
    const cardMessage = formData.get('cardMessage') || 'No message'
    const occasion = formData.get('occasion') || ''
    const deliveryDate = formData.get('deliveryDate') || ''

    const orderData = {
      full_name: yourName,
      phone: phone,
      email: email,
      state: state,
      address: address,
      product_name: 'MEGIR Perfect Gift Bundle',
      color: color,
      quantity: formQuantity,
      price: bundlePrice,
      total_price: priceData.total,
      discount: priceData.discount,
      discount_amount: priceData.savings,
      metadata: {
        gift_recipient: hisName,
        gift_relationship: relationship,
        gift_message: cardMessage,
        occasion: occasion,
        delivery_date: deliveryDate
      },
      stockStatus: isOutOfStock ? 'out-of-stock' : 'in-stock'
    }

    try {
      console.log('📦 Submitting order data:', orderData)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()
      console.log('📬 API Response:', result)

      if (!response.ok) {
        console.error('❌ Failed to save order:', result)
        alert(`Failed to save order: ${result.error || 'Unknown error'}`)
      } else {
        console.log('✅ Order saved successfully! Order ID:', result.order_id)
      }

      const productUrl = window.location.origin + window.location.pathname;
      const message = `🎁 *NEW PERFECT GIFT BUNDLE ORDER*

*Quantity:* ${formQuantity} gift${formQuantity > 1 ? 's' : ''}
${priceData.discount ? `*Discount:* ${priceData.discount} (Save ₦${priceData.savings?.toLocaleString()})` : ''}

*Gift Recipient:* ${hisName}
*Relationship:* ${relationship}
*Watch Color:* ${color}

*Your Name:* ${yourName}
*Phone:* ${phone}
*Address:* ${address}, ${state}

*Card Message:* ${cardMessage || '(To be confirmed)'}

*Bundle Price:* ₦${bundlePrice.toLocaleString()} each
*Total:* ${priceData.display}${priceData.savings ? ` (You save ₦${priceData.savings.toLocaleString()})` : ''} + Delivery

🔗 *Product Link:* ${productUrl}

Ready to create the perfect gift${formQuantity > 1 ? 's' : ''}! Please send payment details.`

      const whatsappURL = `https://wa.me/2348062605012?text=${encodeURIComponent(message)}`
      const thankYouURL = `/thank-you?product=MEGIR+Perfect+Gift+Bundle&color=${encodeURIComponent(color as string)}&quantity=${formQuantity}&total=${priceData.total}&phone=${phone}&whatsapp=${encodeURIComponent(whatsappURL)}&stockStatus=${isOutOfStock ? 'out-of-stock' : 'in-stock'}`

      window.location.href = thankYouURL

    } catch (error) {
      console.error('Error submitting order:', error)
      setIsSubmitting(false)
      const formQuantity = parseInt((new FormData(e.currentTarget)).get('quantity') as string) || quantity
      const priceData = calculatePrice()
      const productUrl = window.location.origin + window.location.pathname;
      const message = `🎁 *NEW PERFECT GIFT BUNDLE ORDER*

*Quantity:* ${formQuantity} gift${formQuantity > 1 ? 's' : ''}
${priceData.discount ? `*Discount:* ${priceData.discount}` : ''}

Gift From: ${yourName}
Gift For: ${hisName} (${relationship})
Watch Color: ${color}

*Total:* ${priceData.display} + Delivery

🔗 *Product Link:* ${productUrl}

Ready to create the perfect gift${formQuantity > 1 ? 's' : ''}!`

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
        <span className="animate-pulse">🎁 Perfect For His Special Day</span>
      </div>

      {/* Hero Section */}
      <section className="py-10 md:py-16 px-5 text-center bg-gradient-to-b from-muted/30 to-background relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-block bg-destructive text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            🎁 Perfect For His Special Day
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            The Gift He&apos;ll <span className="text-primary">Never Forget</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            A stunning timepiece, beautifully wrapped, with a personal message from you - delivered to your door, ready to give.
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

          {/* Hero Gift Visual */}
          <div className="max-w-md mx-auto mb-8 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg">
            <img
              src="/products/megir/MEGIR Chronograph Watch 5.jpeg"
              alt="MEGIR watch in premium gift box"
              className="w-full h-auto object-cover"
            />
            <div className="bg-primary/10 p-3 text-center">
              <p className="text-sm font-semibold text-primary">Premium Gift Box Included</p>
            </div>
          </div>

          {/* Price Section */}
          <Card className="max-w-lg mx-auto mb-5">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Complete Gift Bundle</p>
                <p className="text-lg text-muted-foreground line-through mb-2">Value: ₦148,000</p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <p className="text-5xl font-bold text-primary">{calculatePrice().display}</p>
                  {calculatePrice().discount && (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {calculatePrice().discount}
                    </span>
                  )}
                </div>
                {calculatePrice().savings && (
                  <p className="text-sm font-semibold text-green-600 mb-2">
                    You save ₦{calculatePrice().savings?.toLocaleString()}!
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Ready to give. No wrapping needed.</p>
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

          {/* Trust Badges */}
          <div className="flex justify-center gap-6 md:gap-8 mt-8 flex-wrap text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Video preview before shipping
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              1-year warranty
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              7-day exchange
            </div>
          </div>
        </div>
      </section>

      {/* Empathy Section */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6 max-w-2xl mx-auto text-center text-lg leading-relaxed">
            <p className="text-muted-foreground">Let&apos;s be honest.</p>
            <p className="text-2xl font-semibold text-primary italic">Shopping for him is hard.</p>
            <p className="text-muted-foreground">
              He says &quot;I don&apos;t need anything&quot; but you know he deserves something special. You browse online for hours. Nothing feels right.
            </p>
            <p className="text-muted-foreground">
              You&apos;ve given clothes he never wore. Gadgets that collected dust. Gift cards that felt... impersonal.
            </p>
            <p className="text-muted-foreground">
              This year, you want different. You want to see his face light up.
            </p>

            <Card className="bg-primary text-primary-foreground border-none shadow-lg mt-12">
              <CardContent className="pt-6">
                <p className="text-2xl font-semibold leading-relaxed">
                  That gift exists.<br />And you just found it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Makes This Different */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            This Isn&apos;t Just a <span className="text-primary">Watch</span>
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            It&apos;s a complete gift experience - ready the moment it arrives.
          </p>

          <Card className="max-w-2xl mx-auto text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Gift className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Ready to Give, Right Out of the Box</h3>
              <p className="text-muted-foreground leading-relaxed">
                Most gifts require work - wrapping paper, hunting for a card, hoping it looks presentable. Not this one. The Perfect Gift Bundle arrives at YOUR door completely ready to hand to HIM. Premium wrapping. Ribbon and tissue. A handwritten card with YOUR message. All you do is smile when he opens it.
              </p>
            </CardContent>
          </Card>

          {/* Unboxing - All Colors Available */}
          <div className="max-w-2xl mx-auto mt-6">
            <h3 className="text-xl font-bold text-center mb-4 text-primary">Choose Any Color - All Beautifully Packaged</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { img: '1', color: 'Pure White' },
                { img: '2', color: 'Teal' },
                { img: '3', color: 'Navy Blue' },
                { img: '4', color: 'Classic Black' }
              ].map((item) => (
                <div key={item.img} className="relative rounded-lg overflow-hidden border border-border shadow-md hover:shadow-lg transition-shadow">
                  <img
                    src={`/products/megir/MEGIR Chronograph Watch ${item.img}.jpeg`}
                    alt={`${item.color} MEGIR watch`}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-semibold text-center">{item.color}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why He'll Love It */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why He&apos;ll Love This <span className="text-primary">Watch</span>
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Thoughtful details that show you understand him.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: Clock,
                title: "Working Chronograph",
                description: "All 3 subdials actually function - he can time workouts, track meetings, feel like he's wearing a serious instrument. Men notice these details."
              },
              {
                icon: Cloud,
                title: "Built for Nigerian Weather",
                description: "The silicone strap handles humidity and heat without cracking like leather. A practical choice that shows you understand his daily life."
              },
              {
                icon: Moon,
                title: "Luminous Hands",
                description: "He can check time during early mornings or late nights without reaching for his phone. Thoughtful touches like this make a gift feel special."
              },
              {
                icon: Shield,
                title: "Built to Last",
                description: "Stainless steel case, Japanese movement - this watch will still look great a year from now. He'll be thanking you for a long time."
              }
            ].map((feature, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 flex gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* See the Quality Up Close */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            See the <span className="text-primary">Quality</span> Up Close
          </h2>
          <p className="text-center text-muted-foreground mb-10">Premium craftsmanship in every detail.</p>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              { img: '6', caption: 'Precision Engineering' },
              { img: '7', caption: 'Detailed Chronograph' },
              { img: '9', caption: 'Elegant Design' },
              { img: '10', caption: 'Premium Materials' }
            ].map((item) => (
              <div key={item.img} className="rounded-xl overflow-hidden border border-border shadow-md hover:shadow-xl transition-shadow">
                <img
                  src={`/products/megir/MEGIR Chronograph Watch ${item.img}.jpeg`}
                  alt={item.caption}
                  className="w-full aspect-square object-cover"
                />
              </div>
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
          <p className="text-center text-muted-foreground mb-10">A complete luxury gift experience.</p>

          {/* Bundle Flat Lay - Premium Presentation */}
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-xl font-bold text-center mb-4 text-primary">Premium Presentation - Every Detail Matters</h3>
            <div className="aspect-video rounded-xl border-2 border-dashed border-primary/30 bg-muted/30 flex items-center justify-center">
              <div className="text-center p-6">
                <Package className="w-12 h-12 text-primary/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Product tray image will be added here</p>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">Each bundle arrives in a premium gift box with ribbon, tissue paper, and wax seal</p>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            {bundleItems.map((item, i) => (
              <Card key={i} className={`hover:shadow-lg transition-shadow relative ${item.highlighted ? 'bg-linear-to-r from-primary/10 to-primary/5 border-2 border-primary/30' : ''}`}>
                <CardContent className="p-5 pr-16">
                  <div className="absolute top-4 right-4 w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <span className="font-bold text-sm text-primary">{i + 1}</span>
                  </div>
                  <div className="mb-2">
                    <h4 className="font-bold text-base md:text-lg mb-1">{item.name}</h4>
                    <p className="text-xs font-semibold text-primary">
                      {item.priceless ? 'Priceless' : `₦${item.value.toLocaleString()} value`}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Total Value Box */}
          <Card className="max-w-2xl mx-auto mt-8 border-2 border-primary">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Total Gift Value</p>
                <p className="text-2xl font-bold line-through text-muted-foreground mb-2">₦148,000</p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <p className="text-5xl font-bold text-primary">{calculatePrice().display}</p>
                  {calculatePrice().discount && (
                    <span className="bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                      {calculatePrice().discount}
                    </span>
                  )}
                </div>
                {calculatePrice().savings && quantity > 1 && (
                  <p className="text-base font-semibold text-green-600 mb-2">
                    You save ₦{calculatePrice().savings?.toLocaleString()} on {quantity} gifts!
                  </p>
                )}
                <p className="text-base text-muted-foreground italic mb-4">The easiest &quot;wow&quot; gift you&apos;ll ever give.</p>
              </div>
              <a href="#order-form" onClick={scrollToOrderForm} className="cursor-pointer block mt-6">
                <Button size="lg" className="w-full font-bold">
                  Order {quantity > 1 ? `${quantity} Gifts` : 'His Gift'} Now
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
            Choose <span className="text-primary">His Watch Color</span>
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

      {/* Perfect Gift Promise Guarantee Section */}
      <section className="py-16 px-5 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
            Our &quot;Perfect Gift&quot; <span className="text-white/90">Promise</span>
          </h2>
          <p className="text-center text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            We&apos;ve removed all the risk from gift-giving.
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              {
                title: "Video Preview",
                description: "See exactly what he'll receive before we ship"
              },
              {
                title: "7-Day Color Exchange",
                description: "He'd prefer black? We'll swap it free"
              },
              {
                title: "1-Year Warranty",
                description: "Any manufacturing issue, we fix or replace"
              },
              {
                title: "Physical Store",
                description: "Real business in Abeokuta you can visit or video call"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5 flex items-start gap-3">
                <div className="w-7 h-7 bg-primary-foreground rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-primary-foreground/80 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What Other Women <span className="text-primary">Say</span>
          </h2>
          <p className="text-center text-muted-foreground mb-10">Real gift-givers. Real reactions.</p>

          <div className="space-y-6 max-w-2xl mx-auto">
            {[
              {
                text: "I was nervous ordering a gift online, but the video they sent before shipping made me feel so much better. When my husband opened it on his birthday, his face just lit up. He keeps telling people about the watch AND the way it was wrapped. I looked like a gift-giving genius. 😂",
                author: "Chidinma A.",
                location: "Lagos",
                occasion: "Husband's 40th",
                initials: "CA"
              },
              {
                text: "I've bought my boyfriend so many things he never uses. This watch? He wears it every single day. He's already asked me to get him the black one next. The cufflinks were a nice surprise too - he wore them to his sister's wedding.",
                author: "Blessing O.",
                location: "Abuja",
                occasion: "Boyfriend's Promotion",
                initials: "BO"
              },
              {
                text: "I didn't have time to shop properly for Father's Day. Found this, ordered it, and it arrived beautifully wrapped with the card message I wrote. My dad was so touched. He said it was the most thoughtful gift he's received in years.",
                author: "Adaeze N.",
                location: "Port Harcourt",
                occasion: "Father's Day",
                initials: "AN"
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
                    <div className="w-12 h-12 bg-linear-to-br from-primary to-primary/70 rounded-full flex items-center justify-center font-bold text-primary-foreground">
                      {testimonial.initials}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm">{testimonial.author}</h5>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                    <div className="bg-muted px-3 py-1 rounded-full">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide">{testimonial.occasion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Our Physical Store */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Visit Our <span className="text-primary">Physical Store</span>
          </h2>
          <p className="text-center text-muted-foreground mb-10">Real business you can visit or video call</p>

          {/* Store Photos - 3 images */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              { src: '/Store full building picture.jpeg', alt: 'BaaWA Store Building' },
              { src: '/Store front with bill board.jpg', alt: 'Store Front' },
              { src: '/Baawa store table.png', alt: 'Store Interior' }
            ].map((photo, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border shadow-md">
                <img src={photo.src} alt={photo.alt} className="w-full aspect-video object-cover" />
              </div>
            ))}
          </div>

          {/* Store Videos - 2 videos */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              { src: '/Store shelf.mp4', label: 'Product Display' },
              { src: '/Store table.mp4', label: 'Store Walkthrough' }
            ].map((video, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border shadow-md">
                <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    controls
                    playsInline
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <Card className="max-w-lg mx-auto text-center">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-3">BaaWA Accessories</h3>
              <p className="text-sm text-muted-foreground mb-2">📍 Abeokuta, Ogun State, Nigeria</p>
              <p className="text-sm mb-2">
                <a href="https://wa.me/2348062605012" className="text-primary hover:underline font-semibold">
                  WhatsApp: +234-806-260-5012
                </a>
              </p>
              <p className="text-sm">
                <a href="mailto:Sales@baawa.ng" className="text-primary hover:underline">
                  Sales@baawa.ng
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Perfect Occasions */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Perfect For <span className="text-primary">These Moments</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { emoji: '🎂', occasion: 'Birthday' },
              { emoji: '💍', occasion: 'Anniversary' },
              { emoji: '❤️', occasion: "Valentine's Day" },
              { emoji: '🎄', occasion: 'Christmas' },
              { emoji: '👔', occasion: "Father's Day" },
              { emoji: '🎉', occasion: 'Promotion' }
            ].map((item, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
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
            Questions Gift-Givers <span className="text-primary">Ask</span>
          </h2>

          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              {
                question: "What if I don't know his wrist size?",
                answer: "No worries - the silicone strap is adjustable and fits most wrist sizes (16-22cm). The pin buckle allows for precise fitting. This is NOT a bracelet-style watch that requires exact sizing."
              },
              {
                question: "What if he doesn't like the color I choose?",
                answer: "We offer a 7-day color exchange. If he'd prefer a different color, contact us within 7 days of delivery and we'll arrange a swap. No hassle."
              },
              {
                question: "How do I write the card message?",
                answer: "After you place your order, you'll receive a WhatsApp message asking for your personalized card text. Just tell us what you want to say - we'll write it by hand on a premium card."
              },
              {
                question: "Will it arrive in time?",
                answer: "Lagos: 1-2 days. Abuja/Port Harcourt: 2-3 days. Other states: 3-5 days. For guaranteed delivery by a specific date, order at least 5 days in advance."
              },
              {
                question: "Can I send it directly to him?",
                answer: "Absolutely! Just enter HIS address as the delivery address. We'll make sure the thank-you card for you isn't visible to him - only the gift and his personalized card."
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
      <section id="order-form" className="py-16 px-5 bg-linear-to-b from-muted/30 to-background relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <Card className="max-w-lg mx-auto border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-center">Order His Perfect Gift</CardTitle>
              <CardDescription className="text-center">We&apos;ll confirm your card message via WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="hisName" className="block mb-2 font-semibold text-sm">His Name (for the card) *</label>
                  <input
                    type="text"
                    id="hisName"
                    name="hisName"
                    placeholder="e.g. Chukwudi"
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
                  <label htmlFor="color" className="block mb-2 font-semibold text-sm">His Watch Color *</label>
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
                      <option key={option.name} value={option.name}>{option.name} - {option.note}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="occasion" className="block mb-2 font-semibold text-sm">Special Occasion</label>
                  <select
                    id="occasion"
                    name="occasion"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%23888888'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center'
                    }}
                  >
                    <option value="">Select occasion</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="valentines">Valentine&apos;s Day</option>
                    <option value="christmas">Christmas</option>
                    <option value="fathers-day">Father&apos;s Day</option>
                    <option value="promotion">Promotion / New Job</option>
                    <option value="just-because">Just Because</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="deliveryDate" className="block mb-2 font-semibold text-sm">When should he receive it? *</label>
                  <input
                    type="date"
                    id="deliveryDate"
                    name="deliveryDate"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="yourName" className="block mb-2 font-semibold text-sm">Your Full Name *</label>
                  <input
                    type="text"
                    id="yourName"
                    name="yourName"
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-2 font-semibold text-sm">Your WhatsApp Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="e.g. 08012345678"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 font-semibold text-sm">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block mb-2 font-semibold text-sm">Delivery Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Your address or his (if sending directly)"
                    required
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
                    <option value="">Select state</option>
                    {['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'].map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="cardMessage" className="block mb-2 font-semibold text-sm">Card Message (optional - we&apos;ll confirm via WhatsApp)</label>
                  <textarea
                    id="cardMessage"
                    name="cardMessage"
                    rows={3}
                    placeholder="e.g. Happy Birthday my love! You deserve the world. - Your wife"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">How many gifts? *</label>
                  <div className="flex items-center gap-4 mb-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center font-bold transition-colors"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-3xl font-bold text-primary">{quantity}</span>
                      <span className="block text-xs text-muted-foreground mt-1">
                        {quantity === 1 ? 'gift' : 'gifts'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Bulk Discount Visual Feedback */}
                  {quantity >= 2 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-sm font-bold text-green-700">{calculatePrice().discount}</p>
                      <p className="text-xs text-green-600">Save ₦{calculatePrice().savings?.toLocaleString()} on {quantity} gifts</p>
                    </div>
                  )}

                  {/* Discount Tier Info */}
                  {quantity === 1 && (
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        💡 Buy 2 gifts and save 15% | Buy 3+ and save 30%
                      </p>
                    </div>
                  )}

                  <input type="hidden" name="quantity" value={quantity} />
                </div>

                <Card>
                  <CardContent className="pt-5 space-y-2">
                    <div className="text-xs uppercase tracking-wider text-primary font-bold mb-3">Your Order</div>

                    {/* Quantity Display */}
                    <div className="flex justify-between text-sm mb-2 pb-2 border-b border-border">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-semibold">{quantity} gift{quantity > 1 ? 's' : ''}</span>
                    </div>

                    {/* Items Included */}
                    <div className="text-sm text-muted-foreground">MEGIR Chronograph Watch</div>
                    <div className="text-sm text-green-600">✓ Luxury Gift Wrapping</div>
                    <div className="text-sm text-green-600">✓ Handwritten Personal Card</div>
                    <div className="text-sm text-green-600">✓ Premium Cufflinks Set</div>
                    <div className="text-sm text-green-600">✓ Cologne Sample</div>
                    <div className="text-sm text-green-600">✓ Video Preview Before Shipping</div>
                    <div className="text-sm text-green-600">✓ 1-Year Warranty</div>

                    {/* Pricing Breakdown */}
                    <div className="pt-3 border-t border-border mt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {quantity}x ₦{bundlePrice.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          ₦{(bundlePrice * quantity).toLocaleString()}
                        </span>
                      </div>

                      {calculatePrice().discount && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600 font-semibold">{calculatePrice().discount}</span>
                          <span className="text-green-600 font-semibold">
                            -₦{calculatePrice().savings?.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-lg text-primary">
                          {calculatePrice().display} + Delivery
                        </span>
                      </div>
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
                    <strong className="text-foreground">What happens next:</strong> We&apos;ll WhatsApp you to confirm your card message and show you a video preview of the complete gift before shipping. Bank transfer details sent via WhatsApp.
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
            This Is the Year You Give<br />the <span className="text-primary">Perfect Gift{quantity > 1 ? 's' : ''}</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            No more guessing. No more settling. Just {quantity > 1 ? 'their smiles' : 'his smile'} when {quantity > 1 ? 'they open them' : 'he opens it'}.
          </p>

          {/* Show savings reminder if bulk order */}
          {calculatePrice().discount && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-green-700 font-bold">{calculatePrice().discount}</p>
              <p className="text-sm text-green-600">You&apos;re saving ₦{calculatePrice().savings?.toLocaleString()} on {quantity} gifts!</p>
            </div>
          )}

          <a href="#order-form" onClick={scrollToOrderForm} className="cursor-pointer">
            <Button size="lg" className="text-sm md:text-base font-bold py-5 md:py-7 px-4 md:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <span className="flex items-center justify-center gap-2">
                <Gift className="w-5 h-5" />
                Order {quantity > 1 ? `${quantity} Gifts` : 'His Gift'} - {calculatePrice().display}
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
                  <span className="flex items-center gap-2">
                    {quantity > 1 ? `${quantity} Gifts` : 'Perfect Gift Bundle'}
                    {calculatePrice().discount && (
                      <span className="ml-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                        {calculatePrice().discount}
                      </span>
                    )}
                    <span className="ml-1">- {calculatePrice().display}</span>
                  </span>
                </span>
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
