import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BaaWA Accessories - MEGIR Premium Chronograph Watch",
  description: "Shop the MEGIR Premium Chronograph Watch at BaaWA. Stylish, durable, and affordable luxury watch delivered across Nigeria.",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function MegirLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
