import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { ReservaModal } from '@/components/ui/ReservaModal';
import { WhatsAppFloatingButton } from '@/components/ui/WhatsAppFloatingButton';
import { FloatingFeedbackButtonDraggable } from '@/components/FloatingFeedbackButtonDraggable';
import { Suspense } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'JQ - Dra. Jaquelina Grassetti',
  description: 'Medicina estética',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <html lang="es">
      <head>
        <meta name="emotion-insertion-point" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://db.onlinewebfonts.com/c/9a7927751df300f137ecadcd39ec25ed?family=Bacalisties"
          rel="stylesheet"
        />
        <link
          href="https://fonts.cdnfonts.com/css/arteriononcommercial"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {googleClientId ? (
          <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        ) : null}
        {recaptchaSiteKey ? (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
            strategy="afterInteractive"
          />
        ) : null}
        <Providers>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <ReservaModal />
          <WhatsAppFloatingButton />
          <FloatingFeedbackButtonDraggable />
          {children}
        </Providers>
      </body>
    </html>
  );
}
