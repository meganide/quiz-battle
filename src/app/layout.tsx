import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { Open_Sans } from "next/font/google"

import type { Metadata } from "next"

import "./globals.css"
import { Providers } from "./providers"

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Quiz Battle",
  description: "Quiz Battle",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={`${openSans.variable} antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
