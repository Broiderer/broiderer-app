import './styles/globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Broiderer | Converter for embroidery files',
  description: 'Broiderer is an online file conversion service specializing in converting embroidery files between SVG and PES formats. Easily convert SVG files to PES or PES files to SVG for seamless integration with your embroidery machine. Simplify your embroidery workflow with Broiderer\'s user-friendly interface and enjoy high-quality conversions with quick turnaround times.',
  keywords: ['embroidery file conversion', 'SVG to PES', 'PES to SVG', 'online converter', 'Broiderer', 'embroidery machine', 'file format conversion', 'embroidery workflow', '.svg to .pes', 'svg2pes', 'pes2svg', 'pedesign']
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
