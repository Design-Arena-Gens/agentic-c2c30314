import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Marketing Agent - Replace Your Marketing Team',
  description: 'Complete marketing analysis and strategy from a single URL',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
