import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dress For Where You're Going - MEGIR Chronograph | BaaWA Accessories",
  description: "You don't need ₦700k to command respect. The MEGIR Chronograph - premium quality at ₦57,000. Look successful while building wealth.",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Dress For Where You're Going - MEGIR Chronograph | BaaWA Accessories",
    description: "You don't need ₦700k to command respect. The MEGIR Chronograph - premium quality at ₦57,000. Look successful while building wealth.",
    images: [
      {
        url: '/products/megir/MEGIR Chronograph Watch 8.jpeg',
        width: 1200,
        height: 630,
        alt: 'MEGIR Premium Chronograph Watch',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dress For Where You're Going - MEGIR Chronograph | BaaWA Accessories",
    description: "You don't need ₦700k to command respect. The MEGIR Chronograph - premium quality at ₦57,000. Look successful while building wealth.",
    images: ['/products/megir/MEGIR Chronograph Watch 8.jpeg'],
  },
}

export default function SuccessMindsetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
