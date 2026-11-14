import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'মসজিদ হিসাব | উন্মুক্ত আর্থিক স্বচ্ছতা পোর্টাল',
  description: 'মসজিদের সকল আয়, ব্যয় ও জুমার কালেকশনের উন্মুক্ত হিসাব ব্যবস্থাপনা ও মুসল্লি তথ্য পোর্টাল',
  keywords: ['মসজিদ হিসাব', 'mosque ledger', 'jummah collection', 'mosque finance', 'মসজিদ ফান্ড', 'হিসাব খাতা'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕌</text></svg>" />
      </head>
      <body className="font-bengali bg-slate-50 min-h-screen text-slate-800 antialiased selection:bg-mosque-200 selection:text-mosque-900">
        {children}
      </body>
    </html>
  );
}
