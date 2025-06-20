'use client';

import React from 'react';
import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ gaId }) => {
  // Early exit, GA id not set
  if (!gaId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        strategy="afterInteractive"
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
