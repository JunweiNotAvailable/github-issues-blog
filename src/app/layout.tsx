import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NextAuthProvider } from './provider'
import Navbar from '@/components/Navbar'
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import NextTopLoader from 'nextjs-toploader'
config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Create content with Github issues',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader 
          showSpinner={false}
          shadow="none"
          color='#58ace8'
          height={2}
        />
        <NextAuthProvider>
          <div className='flex flex-col min-h-full'>
            <Navbar />
            {children}
          </div>
        </NextAuthProvider>
      </body>
    </html>
  )
}
