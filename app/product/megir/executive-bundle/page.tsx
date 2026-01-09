"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Shield,
  MapPin,
  Clock,
  Cloud,
  Moon,
  CheckCircle2,
  X,
  ChevronDown,
  Loader2,
  Award,
  Gift,
} from "lucide-react";

export default function ExecutiveBundlePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("Navy Blue");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Stock status flag - change to true when product is out of stock
  const isOutOfStock = true;

  const bundlePrice = 79000;

  const calculatePrice = () => {
    if (quantity === 1) {
      return { total: bundlePrice, display: "₦79,000", discount: null };
    } else if (quantity === 2) {
      const total = Math.round(bundlePrice * 2 * 0.85);
      return {
        total,
        display: `₦${total.toLocaleString()}`,
        discount: "15% OFF!",
      };
    } else {
      const total = Math.round(bundlePrice * quantity * 0.7);
      return {
        total,
        display: `₦${total.toLocaleString()}`,
        discount: "30% OFF!",
      };
    }
  };

  const price = calculatePrice();

  const colorOptions = [
    { name: "Navy Blue", color: "#1B3A5F", images: ["15", "3"] },
    { name: "Classic Black", color: "#1A1A1A", images: ["18", "4"] },
    { name: "Pure White", color: "#F5F5F5", images: ["16", "1"] },
    { name: "Teal", color: "#40E0D0", images: ["17", "2"] },
  ];

  const bundleItems = [
    {
      name: "MEGIR Executive Chronograph Watch",
      value: 65000,
      description:
        "Japanese Quartz movement. Working chronograph. Stainless steel case. Weather-proof silicone strap.",
      image: `/products/megir/MEGIR Chronograph Watch ${
        colorOptions.find((c) => c.name === selectedColor)?.images[0] || "15"
      }.webp`,
    },
    {
      name: "Premium Leather Slim Bifold Wallet",
      value: 20000,
      description:
        "Your watch makes the first impression. Your wallet makes the second. Genuine leather bifold.",
      image: "/products/megir/bifold wallet.webp",
    },
    {
      name: "Executive Metal Pen",
      value: 12000,
      description:
        'Weighted metal pen that says "I pay attention to details." Makes signing contracts feel like a power move.',
      image: "/products/megir/metal pen.webp",
    },
    {
      name: "Watch Care & Maintenance Kit",
      value: 8000,
      description:
        "Premium microfiber cloth, mini screwdriver set, and velvet travel pouch.",
      image: "/products/megir/Watch Care & Maintenance Kit.webp",
    },
    {
      name: '"Power Presence" Digital Style Guide',
      value: 15000,
      description:
        "How to dress for authority, match accessories, and control first impressions.",
      image: "/products/megir/luxury_watch_ebook_cover.webp",
    },
    {
      name: "Extra Silicone Strap (Your Choice)",
      value: 10000,
      description: "One watch. Two looks. Swap in under 2 minutes.",
      image: "/products/megir/silicone strap.webp",
    },
    {
      name: "Premium Cufflinks Set",
      value: 8000,
      description:
        "The finishing touch for formal occasions. Brushed metal matches your MEGIR.",
      image: "/products/megir/cufflink set.webp",
    },
    {
      name: "Extended 2-Year Warranty",
      value: 10000,
      description:
        "If your watch stops working, we repair or replace it. No questions asked.",
      image:
        "/pngtree-golden-2-year-warranty-badge-logo-labels-with-ribbons-png-image_7597425.png",
    },
  ];

  const faqItems = [
    {
      question: "Is the chronograph actually working or just for show?",
      answer:
        "All 3 subdials function. You can time events, track elapsed minutes, and check the date. We're happy to demonstrate via WhatsApp video call before you buy.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Lagos: 1-2 business days. Abuja/Port Harcourt: 2-3 days. Other states: 3-5 days. We'll send tracking information once shipped.",
    },
    {
      question: "What if I don't like it when it arrives?",
      answer:
        "We send photos and videos of your exact order before shipping. You approve before we send. If there's any damage during shipping, we replace it free within 48 hours.",
    },
    {
      question: "Is this a real physical store or just online?",
      answer:
        "We have a physical store in Abeokuta, Ogun State. You're welcome to visit, or we can do a WhatsApp video call so you can see our shop and products in real time.",
    },
    {
      question: "What does the 2-year warranty cover?",
      answer:
        "Any manufacturing defect: movement issues, strap problems, case damage from normal use. We'll repair or replace free of charge. Accidental damage (drops, water damage) is not covered.",
    },
  ];

  const scrollToOrderForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const orderForm = document.getElementById("order-form");
    if (orderForm) {
      orderForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    const colorSelect = document.getElementById("color") as HTMLSelectElement;
    if (colorSelect) {
      colorSelect.value = colorName;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const productRevealSection = document.getElementById("product-reveal");
      const orderForm = document.getElementById("order-form");

      if (productRevealSection && orderForm) {
        const revealBottom =
          productRevealSection.getBoundingClientRect().bottom;
        const formTop = orderForm.getBoundingClientRect().top;
        setShowFloatingButton(revealBottom < 0 && formTop > 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName");
    const phone = formData.get("phone");
    const email = formData.get("email") || "";
    const state = formData.get("state");
    const address = formData.get("address");
    const color = formData.get("color");

    const orderData = {
      full_name: fullName,
      phone: phone,
      email: email,
      state: state,
      address: address,
      product_name: "MEGIR Executive Bundle (8 Items)",
      color: color,
      quantity: quantity,
      price: bundlePrice,
      total_price: price.total,
      discount: price.discount || "47% OFF",
      stockStatus: isOutOfStock ? "out-of-stock" : "in-stock",
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error("Failed to save order:", result);
      }

      const productUrl = window.location.origin + window.location.pathname;
      const message = `🛍️ *NEW ORDER - MEGIR EXECUTIVE BUNDLE*

👤 *Customer Details:*
Name: ${fullName}
Phone: ${phone}
Email: ${email || "Not provided"}

📍 *Delivery Info:*
State: ${state}
Address: ${address}

⌚ *Order Details:*
Product: MEGIR Executive Bundle (8 Items)
- MEGIR Chronograph Watch (${color})
- Premium Leather Wallet
- Executive Metal Pen
- Watch Care Kit
- Power Presence Style Guide
- Extra Silicone Strap
- Premium Cufflinks
- 2-Year Extended Warranty

Quantity: ${quantity} ${quantity === 1 ? "bundle" : "bundles"}

💰 *Total: ${price.display}${
        price.discount ? " (" + price.discount + ")" : " (Bundle Discount)"
      } + Delivery*

🔗 *Product Link:* ${productUrl}

I'm ready to complete my order. Please send payment details.`;

      const whatsappURL = `https://wa.me/2348062605012?text=${encodeURIComponent(
        message
      )}`;
      const thankYouURL = `/thank-you?product=MEGIR+Executive+Bundle&color=${encodeURIComponent(
        color as string
      )}&quantity=${quantity}&total=${
        price.total
      }&phone=${phone}&whatsapp=${encodeURIComponent(
        whatsappURL
      )}&stockStatus=${isOutOfStock ? "out-of-stock" : "in-stock"}`;

      window.location.href = thankYouURL;
    } catch (error) {
      console.error("Error submitting order:", error);
      setIsSubmitting(false);
      const productUrl = window.location.origin + window.location.pathname;
      const message = `🛍️ *NEW ORDER - MEGIR EXECUTIVE BUNDLE*

👤 *Customer Details:*
Name: ${fullName}
Phone: ${phone}
Email: ${email || "Not provided"}

📍 *Delivery Info:*
State: ${state}
Address: ${address}

⌚ *Order Details:*
Product: MEGIR Executive Bundle (8 Items)
Watch Color: ${color}
Quantity: ${quantity} ${quantity === 1 ? "bundle" : "bundles"}

💰 *Total: ${price.display}${
        price.discount ? " (" + price.discount + ")" : " (Bundle Discount)"
      } + Delivery*

🔗 *Product Link:* ${productUrl}

I'm ready to complete my order. Please send payment details.`;

      const whatsappURL = `https://wa.me/2348062605012?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappURL, "_blank");
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Urgency Banner */}
      <div className="bg-destructive text-destructive-foreground text-center py-3 px-5 font-semibold text-sm">
        <span className="animate-pulse">
          ⚡ <strong>47 Executive Bundles</strong> remaining at this price.
          Limited bonus stock.
        </span>
      </div>

      {/* Hero Section */}
      <section className="py-20 md:py-30 px-5 bg-foreground text-background relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8 md:items-center">
            {/* Title and Description */}
            <div className="text-center md:text-left">
              <div className="inline-block bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
                Executive Bundle
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Stop Wearing Watches That{" "}
                <span className="text-primary">Embarrass You</span>
              </h1>

              <p className="text-lg md:text-xl text-background font-medium mb-8 leading-relaxed">
                The executive timepiece Nigerian professionals are switching to,
                without paying Rolex prices.
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center gap-6 md:gap-8 mt-10 flex-wrap text-sm md:text-base text-background font-medium">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>2-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Physical Store in Abeokuta</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Secure Bank Transfer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Agitation Section */}
      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="prose prose-lg mx-auto text-center space-y-6">
            <p className="text-xl md:text-2xl font-bold text-foreground">
              You know that moment.
            </p>
            <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed">
              You&apos;re in a meeting. Or at a networking event. Maybe an
              owambe where you need to impress.
            </p>
            <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed">
              And you notice someone{" "}
              <strong className="text-primary">glance at your wrist.</strong>
            </p>
          </div>

          <div className="prose prose-lg mx-auto text-center mt-12 space-y-6">
            <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed">
              Suddenly you&apos;re conscious of it.{" "}
              <strong>That cheap-looking watch.</strong> The one that stopped
              keeping accurate time two months ago.{" "}
              <strong>The scratched face. The cracked strap.</strong>
            </p>
            <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed">
              You paid ₦15,000 for it.{" "}
              <strong className="text-primary">And it shows.</strong>
            </p>
            <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed">
              Meanwhile, <strong>the man across the table</strong> (the one
              everyone seems to respect before he even speaks) has a timepiece
              that catches the light just right.{" "}
              <strong className="text-primary">
                Bold. Sophisticated. Confident.
              </strong>
            </p>
          </div>

          {/* Lifestyle Image */}
          <div className="my-8 rounded-xl overflow-hidden border border-border shadow-lg">
            <img
              src="/products/megir/MEGIR Chronograph Watch life style image 1.webp"
              alt="Professional man wearing MEGIR watch"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="prose prose-lg mx-auto text-center">
            <p className="text-lg md:text-xl text-foreground font-medium italic leading-relaxed">
              <strong className="text-primary">
                &ldquo;That&apos;s probably a ₦500,000 Rolex. I can&apos;t
                afford that.&rdquo;
              </strong>
            </p>
          </div>

          {/* Highlight Box */}
          <div className="bg-primary text-primary-foreground rounded-xl p-6 md:p-8 text-center my-10">
            <p className="text-lg md:text-2xl font-bold leading-relaxed">
              Here&apos;s what he knows that you don&apos;t:{" "}
              <span className="block mt-2">
                He didn&apos;t pay anywhere close to ₦500,000.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Sound <span className="text-primary">Familiar?</span>
          </h2>
          <p className="text-center text-foreground text-lg md:text-xl font-medium mb-10 leading-relaxed">
            These are the frustrations Nigerian professionals deal with every
            day.
          </p>

          {/* Damaged Watch Close-up */}
          <div className="max-w-sm mx-auto mb-10 rounded-xl overflow-hidden border border-destructive/30 shadow-lg">
            <img
              src="/products/megir/damaged watch 2.webp"
              alt="Close-up of damaged watch"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-5">
            {[
              "Your 'affordable' watch stops working after 2-3 months (again)",
              "Lagos humidity and harmattan dust have destroyed every leather strap you&apos;ve owned",
              "You can&apos;t afford ₦500k for a Rolex, but you&apos;re tired of looking cheap",
              "You&apos;ve been scammed buying 'original' watches online before",
            ].map((problem, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 md:p-6 bg-background border border-border rounded-xl shadow-sm"
              >
                <X className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                <p className="text-foreground text-base md:text-lg font-medium leading-relaxed">
                  {problem}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Reveal Section */}
      <section id="product-reveal" className="py-16 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Hero Video */}
            <div className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-border shadow-lg">
              <video className="w-full h-auto" autoPlay muted loop playsInline>
                <source
                  src="/products/megir/MEGIR Chronograph Watch 19.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* 4 Color Variants Grid */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
                Available in 4 Premium Colors
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  {
                    num: 1,
                    name: "Navy Blue",
                    image: "MEGIR Chronograph Watch 1.jpeg",
                  },
                  {
                    num: 2,
                    name: "Classic Black",
                    image: "MEGIR Chronograph Watch 2.jpeg",
                  },
                  {
                    num: 3,
                    name: "Pure White",
                    image: "MEGIR Chronograph Watch 3.jpeg",
                  },
                  {
                    num: 4,
                    name: "Teal",
                    image: "MEGIR Chronograph Watch 4.jpeg",
                  },
                ].map((color) => (
                  <div key={color.num} className="text-center">
                    <div className="rounded-xl overflow-hidden border border-border shadow-lg mb-3">
                      <img
                        src={`/products/megir/${color.image}`}
                        alt={`MEGIR Chronograph ${color.name}`}
                        className="w-full h-full object-cover aspect-square"
                      />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {color.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Card */}
            <Card className="max-w-xl mx-auto bg-muted/30 border-primary/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-4 flex-wrap mb-4">
                  <span className="text-2xl text-muted-foreground line-through">
                    ₦148,000
                  </span>
                  <span className="text-4xl font-bold text-primary">
                    ₦79,000
                  </span>
                  <span className="bg-green-500/10 text-green-600 px-3 py-1.5 rounded-md text-sm font-bold">
                    SAVE ₦69,000
                  </span>
                </div>

                <div className="pt-4 border-t border-primary/20 flex items-center justify-center gap-2.5 text-primary font-semibold">
                  <Gift className="w-6 h-6" />7 Premium Bonuses Included (Worth
                  ₦83,000)
                </div>
              </CardContent>
            </Card>

            {/* CTA Button */}
            <div className="max-w-xl mx-auto">
              <a
                href="#order-form"
                onClick={scrollToOrderForm}
                className="cursor-pointer block"
              >
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
                >
                  Claim Your Executive Bundle
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Product Introduction */}
      <section className="py-16 px-5 bg-foreground text-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Introducing the MEGIR{" "}
            <span className="text-primary">Executive Chronograph</span>
          </h2>
          <p className="text-center text-lg md:text-xl font-medium mb-10 max-w-xl mx-auto leading-relaxed">
            The timepiece Nigerian professionals are quietly switching to,
            because it looks like ₦500,000 but costs a fraction of that.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Clock,
                title: "Working Chronograph",
                description:
                  "All 3 subdials actually function. Time events, track hours, and check dates, not just printed circles like cheap watches.",
                image: "/products/megir/MEGIR Chronograph Watch 5-desktop.webp",
                imageAlt: "MEGIR chronograph close-up",
              },
              {
                icon: Shield,
                title: "Stainless Steel Case",
                description:
                  "Brushed stainless steel resists scratches and daily wear. This is real metal, not painted plastic pretending to be premium.",
                image: "/products/megir/MEGIR Chronograph Watch 7.webp",
                imageAlt: "MEGIR watch features explanation",
              },
              {
                icon: Cloud,
                title: "Weather-Proof Strap",
                description:
                  "Medical-grade silicone handles Lagos humidity, harmattan dust, heat, and sweat without cracking or getting sticky.",
                image: "/products/megir/MEGIR Chronograph Watch waterproof.gif",
                imageAlt: "MEGIR watch on wrist showing strap",
              },
              {
                icon: Moon,
                title: "Luminous Hands",
                description:
                  "Check time in the dark. Perfect for early morning runs, late-night meetings, or NEPA moments.",
                image: "/products/megir/MEGIR Chronograph Watch luminous.gif",
                imageAlt: "MEGIR teal watch showing luminous features",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="bg-background/5 border-border text-background"
              >
                <CardContent className="pt-6">
                  {/* Feature Image */}
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img
                      src={feature.image}
                      alt={feature.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3 text-background">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-background/90 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chronograph Demo Video - HIDDEN */}
          {/* <div className="mt-10 rounded-xl overflow-hidden border border-border shadow-lg">
            <video
              className="w-full h-auto"
              controls
              playsInline
            >
              <source
                src="/products/megir/MEGIR Chronograph Watch 20.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <p className="text-center text-sm text-muted-foreground py-3 bg-background/10">
              Watch the chronograph in action
            </p>
          </div> */}
        </div>
      </section>

      {/* See It Up Close */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            See It <span className="text-primary">Up Close</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="aspect-square rounded-xl overflow-hidden border border-border">
              <img
                src="/products/megir/MEGIR Chronograph Watch 6.webp"
                alt="MEGIR watch on wrist"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden border border-border">
              <img
                src="/products/megir/MEGIR Chronograph Watch 7.webp"
                alt="MEGIR chronograph face detail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden border border-border">
              <img
                src="/products/megir/MEGIR Chronograph Watch 9.webp"
                alt="MEGIR watch angle view"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden border border-border">
              <img
                src="/products/megir/MEGIR Chronograph Watch 10.webp"
                alt="MEGIR watch side angle"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value Stack / Bundle Section */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            The <span className="text-primary">Executive Bundle</span>
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            Everything you need to walk into any room with confidence.
          </p>

          {/* Complete Bundle Flat-Lay */}
          <div className="mb-10 rounded-xl overflow-hidden border border-primary/30 shadow-2xl">
            <picture>
              <source
                srcSet="/products/megir/Product Bundle-mobile.webp"
                media="(max-width: 640px)"
                type="image/webp"
              />
              <source
                srcSet="/products/megir/Product Bundle-tablet.webp"
                media="(max-width: 1024px)"
                type="image/webp"
              />
              <source
                srcSet="/products/megir/Product Bundle-desktop.webp"
                type="image/webp"
              />
              <img
                src="/products/megir/Product Bundle-desktop.webp"
                alt="Complete Executive Bundle - All 8 items"
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </picture>
            <p className="text-center text-sm text-muted-foreground py-3 bg-muted/30">
              Everything included in your Executive Bundle
            </p>
          </div>

          {/* Value Items */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {bundleItems.map((item, i) => (
              <Card key={i} className="border-l-4 border-l-primary">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 relative shrink-0 rounded-lg overflow-hidden border border-border bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-bold text-sm md:text-base">
                          {item.name}
                        </h4>
                        <span className="text-sm font-semibold text-primary whitespace-nowrap shrink-0">
                          ₦{item.value.toLocaleString()} value
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Premium Packaging & Unboxing Section */}
          <div className="mt-10">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-3">
              Premium <span className="text-primary">Packaging</span> & Unboxing
            </h3>
            <p className="text-center text-muted-foreground mb-8">
              Every watch comes in an original MEGIR gift box - ready to impress
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {/* Video 1 */}
              <div className="rounded-xl overflow-hidden border border-border shadow-lg">
                <div
                  className="relative bg-black"
                  style={{ aspectRatio: "720/1280" }}
                >
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  >
                    <source
                      src="/products/megir/MEGIR Chronograph Watch 20.mp4"
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>

              {/* Video 2 */}
              <div className="rounded-xl overflow-hidden border border-border shadow-lg">
                <div
                  className="relative bg-black"
                  style={{ aspectRatio: "720/1280" }}
                >
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  >
                    <source
                      src="/products/megir/MEGIR Chronograph Watch 21.mp4"
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>

              {/* Video 3 */}
              <div className="rounded-xl overflow-hidden border border-border shadow-lg">
                <div
                  className="relative bg-black"
                  style={{ aspectRatio: "720/1280" }}
                >
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  >
                    <source
                      src="/products/megir/MEGIR Chronograph Watch 22.mp4"
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>
            </div>
          </div>

          {/* Total Value Box */}
          <Card className="max-w-2xl mx-auto mt-10 bg-foreground text-background border-0">
            <CardContent className="pt-8 text-center">
              <p className="text-sm md:text-base uppercase tracking-widest text-background/80 font-semibold mb-2">
                Total Bundle Value
              </p>
              <p className="text-2xl md:text-3xl text-background/70 line-through mb-1 font-semibold">
                ₦148,000
              </p>
              <p className="text-5xl md:text-6xl font-bold text-primary mb-6">
                ₦79,000
              </p>
              <p className="text-lg md:text-2xl mb-6 text-background font-medium">
                Your investment today:{" "}
                <span className="text-primary font-bold text-3xl md:text-4xl">
                  ₦79,000
                </span>
              </p>
              <a
                href="#order-form"
                onClick={scrollToOrderForm}
                className="cursor-pointer block"
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 px-10 rounded-full"
                >
                  Claim Your Bundle Now
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Full Specifications */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Full <span className="text-primary">Specifications</span>
          </h2>

          <Card className="max-w-2xl mx-auto mb-8">
            <CardContent className="p-0">
              {[
                { label: "Brand", value: "MEGIR (Est. 2008)" },
                { label: "Movement", value: "Japanese Quartz" },
                { label: "Case Material", value: "Stainless Steel" },
                { label: "Strap Material", value: "Silicone Rubber" },
                { label: "Case Diameter", value: "44mm" },
                { label: "Water Resistance", value: "30M (Splash Proof)" },
                { label: "Features", value: "Chronograph, Date, Luminous" },
                { label: "Closure", value: "Pin Buckle" },
              ].map((spec, i) => (
                <div
                  key={i}
                  className={`flex justify-between p-4 ${
                    i % 2 === 0 ? "bg-muted/30" : ""
                  } ${i !== 7 ? "border-b border-border" : ""}`}
                >
                  <span className="text-sm text-muted-foreground">
                    {spec.label}
                  </span>
                  <span className="text-sm font-semibold text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-border">
            <img
              src="/products/megir/MEGIR Chronograph Watch 8.webp"
              alt="MEGIR watch features diagram"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-xl mx-auto">
          <Card className="border-2 border-primary">
            <CardContent className="pt-10 text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Our &ldquo;Respect Guaranteed&rdquo; Promise
              </h3>
              <p className="text-foreground text-base md:text-lg mb-6 font-medium leading-relaxed">
                If your watch stops working within 2 years (for ANY
                manufacturing reason) we&apos;ll repair or replace it. Free.
              </p>

              {/* Warranty Documentation */}
              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="rounded-xl overflow-hidden border border-primary/30 shadow-lg">
                  <picture>
                    <source
                      srcSet="/products/megir/Warranty Card-mobile.webp"
                      media="(max-width: 640px)"
                      type="image/webp"
                    />
                    <source
                      srcSet="/products/megir/Warranty Card.webp"
                      type="image/webp"
                    />
                    <img
                      src="/products/megir/Warranty Card.webp"
                      alt="MEGIR Limited Warranty Card"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </picture>
                </div>
                <div className="rounded-xl overflow-hidden border border-primary/30 shadow-lg">
                  <picture>
                    <source
                      srcSet="/products/megir/Warranty Cert-mobile.webp"
                      media="(max-width: 640px)"
                      type="image/webp"
                    />
                    <source
                      srcSet="/products/megir/Warranty Cert.webp"
                      type="image/webp"
                    />
                    <img
                      src="/products/megir/Warranty Cert.webp"
                      alt="MEGIR Certificate of Authenticity"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </picture>
                </div>
              </div>

              <ul className="text-left space-y-3 max-w-md mx-auto">
                {[
                  "Physical Store Verification: Visit us anytime in Abeokuta",
                  "WhatsApp Video Call: See your exact watch before paying",
                  "Pre-Shipment Confirmation: Approve photos before we ship",
                  "48-Hour Damage Protection: Free replacement if damaged",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </span>
                    <span className="text-sm md:text-base font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
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
              <img
                src="/products/megir/MEGIR Chronograph Watch 13.webp"
                alt="MEGIR watches color comparison 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img
                src="/products/megir/MEGIR Chronograph Watch 14.webp"
                alt="MEGIR watches color comparison 2"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="max-w-2xl mx-auto rounded-xl overflow-hidden border border-border shadow-lg">
            <img
              src="/products/megir/MEGIR Chronograph Watch 5.webp"
              alt="MEGIR watch in premium gift box"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center text-muted-foreground mt-4">
            Comes in original MEGIR packaging - perfect for gifting
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-5 bg-foreground text-background">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What Nigerian <span className="text-primary">Professionals</span>{" "}
            Say
          </h2>
          <p className="text-center text-background text-lg md:text-xl font-medium mb-10 leading-relaxed">
            Real customers. Real results. Real respect.
          </p>

          <div className="space-y-6">
            {[
              {
                text: "I was skeptical. Very skeptical. Another online store promising quality? In Nigeria? But I took the chance because they have a physical store. The watch arrived exactly as pictured. Better, actually. Now I have colleagues asking where I got it.",
                author: "Adebayo O.",
                location: "Lagos",
                initials: "AO",
              },
              {
                text: "Bought the white one for my husband&apos;s birthday. The packaging impressed me first. Then my husband&apos;s face when he opened it. He&apos;s worn it every day since. Already planning to get him the black one.",
                author: "Funke E.",
                location: "Abuja",
                initials: "FE",
              },
              {
                text: "I&apos;ve bought 3 'chronograph' watches before. All had fake subdials. This MEGIR? All three subdials work. I use the stopwatch for gym sessions. My friends keep thinking it cost ₦200k+.",
                author: "Chukwuemeka E.",
                location: "Port Harcourt",
                initials: "CE",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="bg-background/5 border-border">
                <CardContent className="pt-6">
                  <p className="text-background mb-5 text-base md:text-lg leading-relaxed italic font-medium">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-lg font-bold text-primary-foreground">
                      {testimonial.initials}
                    </div>
                    <div className="grow">
                      <h5 className="font-bold text-sm md:text-base text-background">
                        {testimonial.author}
                      </h5>
                      <p className="text-xs md:text-sm text-background/80 font-medium">
                        {testimonial.location}
                      </p>
                    </div>
                    <span className="bg-green-600 text-white text-xs md:text-sm font-semibold px-3 py-1 rounded-full shrink-0">
                      Verified Buyer
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Physical Store Section */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Visit Our <span className="text-primary">Physical Store</span>
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            We&apos;re not hiding behind a PO Box. Come see us in Abeokuta.
          </p>

          {/* Store Photos Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img
                src="/Store full building picture.jpeg"
                alt="BaaWA store building"
                className="w-full h-full object-cover aspect-video"
              />
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img
                src="/Store front with bill board.jpg"
                alt="BaaWA store front with billboard"
                className="w-full h-full object-cover aspect-video"
              />
            </div>
            <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <img
                src="/Baawa store table.png"
                alt="BaaWA store display table"
                className="w-full h-full object-cover aspect-video"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <Card className="text-center">
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl mb-2">📍</div>
                <p className="font-semibold text-base">Location</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Abeokuta, Ogun State
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl mb-2">📱</div>
                <p className="font-semibold text-base">WhatsApp</p>
                <p className="text-sm text-primary font-medium mt-1">
                  +234-806-260-5012
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl mb-2">✉️</div>
                <p className="font-semibold text-base">Email</p>
                <p className="text-sm text-primary font-medium mt-1">
                  Sales@baawa.ng
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-5 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 flex justify-between items-center gap-4 text-left font-semibold hover:bg-muted/50 transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-primary transition-transform shrink-0 ${
                      activeFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section
        id="order-form"
        className="py-16 px-5 bg-linear-to-br from-primary to-primary/80"
      >
        <div className="max-w-lg mx-auto">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Claim Your Executive Bundle
              </CardTitle>
              <CardDescription>
                Fill out the form. We&apos;ll confirm via WhatsApp within 1
                hour.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block mb-2 font-semibold text-sm"
                  >
                    Full Name *
                  </label>
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
                  <label
                    htmlFor="phone"
                    className="block mb-2 font-semibold text-sm"
                  >
                    WhatsApp Number *
                  </label>
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
                  <label
                    htmlFor="email"
                    className="block mb-2 font-semibold text-sm"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block mb-2 font-semibold text-sm"
                  >
                    Delivery State *
                  </label>
                  <select
                    id="state"
                    name="state"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%23888888'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                    }}
                  >
                    <option value="">Select your state</option>
                    {[
                      "Abia",
                      "Adamawa",
                      "Akwa Ibom",
                      "Anambra",
                      "Bauchi",
                      "Bayelsa",
                      "Benue",
                      "Borno",
                      "Cross River",
                      "Delta",
                      "Ebonyi",
                      "Edo",
                      "Ekiti",
                      "Enugu",
                      "FCT - Abuja",
                      "Gombe",
                      "Imo",
                      "Jigawa",
                      "Kaduna",
                      "Kano",
                      "Katsina",
                      "Kebbi",
                      "Kogi",
                      "Kwara",
                      "Lagos",
                      "Nasarawa",
                      "Niger",
                      "Ogun",
                      "Ondo",
                      "Osun",
                      "Oyo",
                      "Plateau",
                      "Rivers",
                      "Sokoto",
                      "Taraba",
                      "Yobe",
                      "Zamfara",
                    ].map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block mb-2 font-semibold text-sm"
                  >
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Full delivery address"
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    Watch Color *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {colorOptions.map((option) => (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => handleColorSelect(option.name)}
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${
                          selectedColor === option.name
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-lg border border-border"
                          style={{ backgroundColor: option.color }}
                        />
                        <span className="text-sm font-medium">
                          {option.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="hidden"
                    id="color"
                    name="color"
                    value={selectedColor}
                  />
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-11 h-11 bg-input border border-border rounded-lg hover:border-primary transition-colors flex items-center justify-center text-xl font-semibold"
                    >
                      −
                    </button>
                    <span className="text-xl font-bold min-w-[40px] text-center">
                      {quantity}
                    </span>
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
                      🔥 Buy 2 and get <strong>15% OFF</strong>, 3+ for{" "}
                      <strong>30% OFF!</strong>
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-muted rounded-xl p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bundle Price</span>
                    <span className="font-semibold">
                      {price.display}{" "}
                      {price.discount && (
                        <span className="text-primary ml-1">
                          ({price.discount})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-semibold">
                      {quantity} {quantity === 1 ? "bundle" : "bundles"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      7 Premium Bonuses
                    </span>
                    <span className="font-semibold text-green-600">
                      Worth ₦83,000 ✓
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-semibold">Calculated after</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-lg text-primary">
                      {price.display} + Delivery
                    </span>
                  </div>
                </div>

                {/* Trust Seals */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-sm mx-auto">
                  <div className="flex justify-center items-center">
                    <div className="w-16 h-16 relative">
                      <Image
                        src="/secure-payment-label-maximum-security-and-reliability-when-paying-online-png.png"
                        alt="Secure Payment"
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="w-16 h-16 relative">
                      <Image
                        src="/pngtree-golden-2-year-warranty-badge-logo-labels-with-ribbons-png-image_7597425.png"
                        alt="2-Year Warranty"
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="w-16 h-16 relative">
                      <Image
                        src="/physical online store.png"
                        alt="Physical Store"
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/40 rounded-lg flex flex-col items-center justify-center">
                      <Award className="w-6 h-6 text-primary mb-0.5" />
                      <span className="text-[9px] font-bold text-primary leading-tight">
                        1000+
                      </span>
                      <span className="text-[7px] text-primary/80 leading-tight">
                        Customers
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Complete Order on WhatsApp"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  ⚠️ <strong>Important:</strong> Bank transfer confirms your
                  order. We do NOT offer Pay on Delivery.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-5 bg-foreground text-background text-center relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="/products/megir/MEGIR Chronograph Watch life style image 1.webp"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            One Year From Today...
          </h2>
          <p className="text-background mb-8 text-lg md:text-xl font-medium leading-relaxed">
            You&apos;ll either be the same man wearing the same forgettable
            watch... or{" "}
            <strong className="text-primary">
              the one who walks into rooms with quiet confidence.
            </strong>
          </p>
          <a
            href="#order-form"
            onClick={scrollToOrderForm}
            className="cursor-pointer block w-full"
          >
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 px-6 sm:px-10 rounded-full text-sm sm:text-base"
            >
              <span className="block sm:inline">
                Claim Your Executive Bundle
              </span>
              <span className="block sm:inline sm:ml-2">— ₦79,000</span>
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-5 bg-foreground text-center">
        <p className="text-2xl font-bold text-primary mb-5">
          BaaWA Accessories
        </p>
        <p className="text-background text-sm md:text-base font-medium">
          📍 Abeokuta, Ogun State, Nigeria
        </p>
        <p className="text-background/80 text-sm md:text-base mt-5">
          © {new Date().getFullYear()} BaaWA Accessories. All rights reserved.
        </p>
      </footer>

      {/* Floating Order Button */}
      {showFloatingButton && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border shadow-2xl animate-in slide-in-from-bottom">
          <div className="max-w-4xl mx-auto px-5 py-4 flex justify-between items-center">
            <div className="text-sm">
              <span className="text-muted-foreground">Executive Bundle</span>
              <strong className="block text-lg">₦79,000</strong>
            </div>
            <a
              href="#order-form"
              onClick={scrollToOrderForm}
              className="cursor-pointer"
            >
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6">
                Order Now
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
