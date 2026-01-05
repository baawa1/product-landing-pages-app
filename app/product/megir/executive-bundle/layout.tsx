import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MEGIR Executive Bundle - 8 Premium Items | BaaWA Accessories",
  description: "Get the complete Executive Bundle - MEGIR Chronograph Watch + 7 premium accessories. Save ₦69,000 today. Only ₦79,000 for everything.",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "MEGIR Executive Bundle - 8 Premium Items | BaaWA Accessories",
    description: "Get the complete Executive Bundle - MEGIR Chronograph Watch + 7 premium accessories. Save ₦69,000 today. Only ₦79,000 for everything.",
    images: [
      {
        url: '/products/megir/MEGIR Chronograph Watch 8.jpeg',
        width: 1200,
        height: 630,
        alt: 'MEGIR Executive Bundle',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MEGIR Executive Bundle - 8 Premium Items | BaaWA Accessories",
    description: "Get the complete Executive Bundle - MEGIR Chronograph Watch + 7 premium accessories. Save ₦69,000 today. Only ₦79,000 for everything.",
    images: ['/products/megir/MEGIR Chronograph Watch 8.jpeg'],
  },
}

export default function ExecutiveBundleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
