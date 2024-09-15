import localFont from 'next/font/local';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

const FAVICON_PATH = "/assets/favicons";

export const metadata: Metadata = {
  title: '플랜트',
  description: '플랜트',
  applicationName: '플랜트',
  appleWebApp: {
    title: '플랜트',
    capable: true,
    statusBarStyle: 'default',
  },
  icons: [
    {
      rel: 'icon',
      url: `${FAVICON_PATH}/favicon.ico`,
    },
    {
      rel: 'apple-touch-icon',
      url: `${FAVICON_PATH}/apple-icon-57x57.png`,
      sizes: '57x57',
    },
    {
      rel: 'apple-touch-icon',
      url: `${FAVICON_PATH}/apple-icon-60x60.png`,
      sizes: '60x60',
    },
    {
      rel: 'apple-touch-icon',
      url: `${FAVICON_PATH}/apple-icon-72x72.png`,
      sizes: '72x72',
    },
    {
      rel: 'apple-touch-icon',
      url: `${FAVICON_PATH}/apple-icon-76x76.png`,
      sizes: '76x76',
    },
    {
      rel: 'apple-touch-icon',
      url: `${FAVICON_PATH}/apple-icon-114x114.png`,
      sizes: '114x114',
    },
    {
      rel: 'apple-touch-icon',
      url: `${FAVICON_PATH}/apple-icon-120x120.png`,
      sizes: '120x120',
    },
    {
      rel: 'apple-touch-icon',
      url: `${FAVICON_PATH}/apple-icon-144x144.png`,
      sizes: '144x144',
    },
    {
      rel: 'apple-touch-icon',
      url: `${FAVICON_PATH}/apple-icon-152x152.png`,
      sizes: '152x152',
    },
    {
      rel: 'apple-touch-icon',
      url: `${FAVICON_PATH}/apple-icon-180x180.png`,
      sizes: '180x180',
    },
    {
      rel: 'icon',
      url: `${FAVICON_PATH}/android-icon-192x192.png`,
      sizes: '192x192',
    },
    {
      rel: 'icon',
      url: `${FAVICON_PATH}/favicon-32x32.png`,
      sizes: '32x32',
    },
    {
      rel: 'icon',
      url: `${FAVICON_PATH}/favicon-96x96.png`,
      sizes: '96x96',
    },
    {
      rel: 'icon',
      url: `${FAVICON_PATH}/favicon-16x16.png`,
      sizes: '16x16',
    },
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} font-pretendard antialiased`}>{children}</body>
    </html>
  );
}
