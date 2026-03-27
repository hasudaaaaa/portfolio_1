import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { OG_IMAGE_URL, defaultOpenGraph } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hasuda.org"),
  title: "hasuda.org",
  description: "hasuda's portfolio site",
  openGraph: {
    ...defaultOpenGraph,
    title: "hasuda.org",
    description: "hasuda's portfolio site",
  },
  twitter: {
    card: "summary_large_image",
    title: "hasuda.org",
    description: "hasuda's portfolio site",
    site: "@hasudaaaaaaa",
    creator: "@hasudaaaaaaa",
    images: [OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
      </head>
      <body>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YKMB6PTS6F"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YKMB6PTS6F');
        `}</Script>
        {/* Adobe Typekit */}
        <Script id="adobe-typekit" strategy="afterInteractive">{`
          (function(d) {
            var config = { kitId: 'xvn6gja', scriptTimeout: 3000, async: true },
            h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
          })(document);
        `}</Script>

        <Header />
        {children}
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}
