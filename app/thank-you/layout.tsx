import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Thank You - BaaWA Accessories",
  description: "Thank you for your order! We'll contact you shortly on WhatsApp to confirm your order.",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
