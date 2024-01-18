import './styles/globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Broiderer | Converter for embroidery files',
  description: 'Broiderer | Editor and converter from svg to embroidery files',
  keywords: [
    'embroidery file editor',
    'SVG to PES converter',
    'Brother machine files',
    'customized stitch design',
    'online embroidery tool',
    'digital embroidery',
    'file conversion tool',
    'machine embroidery design',
    'Broiderer',
    'Embroidery pattern personalization',
  ],
  icons: {
    icon: '/icon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
