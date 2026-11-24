import './globals.css';
import Script from 'next/script';
import { SITE_URL, SITE_NAME, TTM_URL, GA_ID } from '../lib/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: Live melt value of US coins`, template: `%s | ${SITE_NAME}` },
  description: 'Live melt value of US coins: pre-1965 silver, 40% silver, war nickels, pennies, nickels, pre-1933 gold and American Eagle bullion, at current spot prices.',
  openGraph: { siteName: SITE_NAME, type: 'website' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Public+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        {children}
        <footer className="site-footer">
          <div className="wrap footer-inner">
            <span>Melt values use live spot prices and published coin specifications. They are not dealer offers.</span>
            <nav className="footer-nav" aria-label="Footer">
              <a href="/about/">About</a>
              <a href="/junk-silver-calculator/">Junk Silver Calculator</a>
              <a href={TTM_URL}>TrackTheMint</a>
              <span>{SITE_NAME}</span>
            </nav>
          </div>
        </footer>
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
