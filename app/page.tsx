import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Store, ShoppingBag, ExternalLink } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative py-20 px-5 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/logo/baawa-logo-brand-color.png"
              alt="BaaWA Accessories"
              width={300}
              height={100}
              className="mx-auto h-16 md:h-20 w-auto"
              priority
            />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Premium Accessories in Abeokuta
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your trusted destination for quality watches, bags, and fashion accessories.
            Serving Nigeria with style and affordability.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://baawa.ng/shop" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-base font-bold py-6 px-8 rounded-xl cursor-pointer w-full sm:w-auto">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Visit Our Online Store
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="https://wa.me/2348062605012" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-base font-bold py-6 px-8 rounded-xl cursor-pointer w-full sm:w-auto">
                <Phone className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Store Images Section */}
      <section className="py-16 px-5 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Visit Our Store</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <Image
                src="/Store front with bill board.jpg"
                alt="BaaWA Accessories Store Front"
                width={600}
                height={400}
                className="w-full h-64 md:h-80 object-cover"
              />
            </Card>
            <Card className="overflow-hidden">
              <Image
                src="/Store full building picture.jpeg"
                alt="BaaWA Accessories Store Building"
                width={600}
                height={400}
                className="w-full h-64 md:h-80 object-cover"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Get In Touch</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Location */}
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Location</h3>
                <p className="text-sm text-muted-foreground">
                  Abeokuta, Ogun State<br />Nigeria
                </p>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Phone</h3>
                <a
                  href="https://wa.me/2348062605012"
                  className="text-sm text-primary hover:underline block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +234-806-260-5012
                </a>
              </CardContent>
            </Card>

            {/* Email */}
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Email</h3>
                <a
                  href="mailto:Sales@baawa.ng"
                  className="text-sm text-primary hover:underline block"
                >
                  Sales@baawa.ng
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-5 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose BaaWA?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-bold mb-2">Quality Products</h3>
                <p className="text-sm text-muted-foreground">
                  We offer only premium, carefully selected accessories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-bold mb-2">Affordable Prices</h3>
                <p className="text-sm text-muted-foreground">
                  Great value for money without compromising on quality
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-3">🚚</div>
                <h3 className="font-bold mb-2">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Quick shipping within 24 hours across Nigeria
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-5 bg-muted/30 border-t border-border text-center">
        <div className="max-w-3xl mx-auto">
          <Image
            src="/logo/baawa-logo-brand-color.png"
            alt="BaaWA Accessories"
            width={200}
            height={80}
            className="h-8 md:h-10 mx-auto mb-6 w-auto"
          />

          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
            <a href="https://baawa.ng" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
              <Store className="w-4 h-4" />
              Main Website
            </a>
            <a href="https://baawa.ng/shop" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              Online Shop
            </a>
            <a href="https://wa.me/2348062605012" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>
            <a href="mailto:Sales@baawa.ng" className="text-primary hover:underline flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>

          <p className="text-sm text-muted-foreground mb-2">📍 Abeokuta, Ogun State, Nigeria</p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BaaWA Accessories. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
