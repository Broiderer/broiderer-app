import './styles/globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Broiderer | Create embroidery files from vectorial designs',
  description:
    'Seamlessly transform your SVG files into embroideries – visualize and refine your designs before downloading machine-compatible files.',
  keywords: [
    'embroidery',
    'file editor',
    'svg',
    'pes',
    'converter',
    'Brother embroidery machine',
    'customized stitch design',
    'online tool',
    'digital embroidery',
    'file conversion tool',
    'machine embroidery design',
    'Broiderer',
    'Embroidery pattern personalization',
    'canva',
    'online inkscape',
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
