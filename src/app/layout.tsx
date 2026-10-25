import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vaynotes — how do you know me',
  description: 'A quiet place for thoughts, notes, and things worth keeping.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
