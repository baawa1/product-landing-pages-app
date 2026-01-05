import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Perfect Gift For Him - MEGIR Gift Bundle | BaaWA Accessories",
  description: "Shopping for him is hard. This is the perfect gift - beautifully wrapped MEGIR watch + cufflinks + cologne sample. Complete gift bundle at ₦69,000.",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "The Perfect Gift For Him - MEGIR Gift Bundle | BaaWA Accessories",
    description: "Shopping for him is hard. This is the perfect gift - beautifully wrapped MEGIR watch + cufflinks + cologne sample. Complete gift bundle at ₦69,000.",
    images: [
      {
        url: '/products/megir/MEGIR Chronograph Watch 5.jpeg',
        width: 1200,
        height: 630,
        alt: 'MEGIR Perfect Gift Bundle',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Perfect Gift For Him - MEGIR Gift Bundle | BaaWA Accessories",
    description: "Shopping for him is hard. This is the perfect gift - beautifully wrapped MEGIR watch + cufflinks + cologne sample. Complete gift bundle at ₦69,000.",
    images: ['/products/megir/MEGIR Chronograph Watch 5.jpeg'],
  },
}

export default function GiftBundleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
