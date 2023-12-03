import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Carelon - Bumpey',
  description: 'Carelon order portal managed by Bumpey',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-white">{children}</body>
    </html>
    </ClerkProvider >
  )
}
