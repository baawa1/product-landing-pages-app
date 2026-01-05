import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BaaWA Accessories - MEGIR Premium Chronograph Watch",
  description: "Shop the MEGIR Premium Chronograph Watch at BaaWA. Stylish, durable, and affordable luxury watch delivered across Nigeria.",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "BaaWA Accessories - MEGIR Premium Chronograph Watch",
    description: "Shop the MEGIR Premium Chronograph Watch at BaaWA. Stylish, durable, and affordable luxury watch delivered across Nigeria.",
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
    title: "BaaWA Accessories - MEGIR Premium Chronograph Watch",
    description: "Shop the MEGIR Premium Chronograph Watch at BaaWA. Stylish, durable, and affordable luxury watch delivered across Nigeria.",
    images: ['/products/megir/MEGIR Chronograph Watch 8.jpeg'],
  },
}

export default function SuccessBundleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
