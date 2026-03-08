import type { Metadata } from 'next';
import { Manrope, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const uiFont = Manrope({
  subsets: ['latin'],
  variable: '--font-ui',
  weight: ['400', '500', '600', '700']
});

const editorialFont = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-editorial',
  weight: ['400', '600', '700']
});

export const metadata: Metadata = {
  metadataBase: new URL('https://example.vercel.app'),
  title: {
    default: 'SHI.VAY | Portfolio & Blog',
    template: '%s | SHI.VAY'
  },
  description: 'Minimal personal portfolio and blog built with Next.js and MDX.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${uiFont.variable} ${editorialFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
