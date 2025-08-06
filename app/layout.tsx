import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { LocationProvider } from "@/components/location-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FarmSmart - Your Agricultural Assistant",
  description: "Complete farming solution with crop planning, disease diagnosis, weather scheduling, and more",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LocationProvider>
            {children}
            <Toaster />
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
