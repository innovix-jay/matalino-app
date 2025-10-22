import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Matalino - AI-Powered Creator Platform | Innovix Dynamix',
  description: 'Build, launch, and scale your creator business with Matalino. The all-in-one platform for digital products, email marketing, and growth. Powered by Innovix Dynamix.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="hero-aurora" />
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
