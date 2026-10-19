import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { SITE } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Roottosuccess Free Tools — বাংলায় ফ্রি অনলাইন টুলস",
    template: "%s | Roottosuccess Free Tools",
  },
  description:
    "ইমেজ কনভার্টার, মেটাডাটা ক্লিনার, ইমেজ আপস্কেলার, বিজয়-ইউনিকোড কনভার্টার, QR কোড জেনারেটরসহ দরকারি সব ফ্রি টুল। কোনো আপলোড নেই — সব কাজ আপনার ব্রাউজারে।",
  keywords: ["free tools bangla", "bijoy to unicode", "image converter", "metadata remover", "image upscaler", "qr code generator", "Roottosuccess"],
  applicationName: "Roottosuccess Free Tools",
  authors: [{ name: "Roottosuccess", url: SITE.website }],
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.png", apple: "/icon.png" },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "Roottosuccess Free Tools",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  themeColor: "#050c08",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wdth,wght@75..125,500..800&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-dvh">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-forest-900 focus:px-4 focus:py-2 focus:text-white"
          >
            মূল অংশে যান
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </Providers>
      </body>
    </html>
  );
}
