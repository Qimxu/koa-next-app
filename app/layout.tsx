import './globals.css';
import { Metadata } from 'next';
import { ReactNode } from 'react';

// 元数据配置
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
  title: {
    default: 'KoaNext - Full-Stack Solution',
    template: '%s | KoaNext',
  },
  description:
    'A lightweight full-stack template using Koa.js with native SQL and Next.js frontend',
  icons: {
    icon: '/static/logo.png',
    apple: '/static/logo.png',
  },
  openGraph: {
    title: 'KoaNext - Full-Stack Solution',
    description:
      'A lightweight full-stack template using Koa.js with native SQL and Next.js frontend',
    images: ['/static/logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KoaNext - Full-Stack Solution',
    description:
      'A lightweight full-stack template using Koa.js with native SQL and Next.js frontend',
    images: ['/static/logo.png'],
  },
};

// 根布局 - 必须包含 html 和 body 标签
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/static/logo.png" />
        <link rel="shortcut icon" type="image/png" href="/static/logo.png" />
        <link rel="apple-touch-icon" href="/static/logo.png" />
        <link rel="apple-touch-icon-precomposed" href="/static/logo.png" />
        <meta name="msapplication-TileImage" content="/static/logo.png" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="theme-color" content="#0a0a0a" />
        {/* Fonts: Orbitron (display) + Sora (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Sora:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
