import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { NetworkError } from "@/components/web3/NetworkError";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Modals } from "@/components/Modals";
import { MiniAppInitializer } from "./MiniAppInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ilenoid",
    template: "%s | Ilenoid",
  },
  description: "A transparent blockchain-based charity tracking platform built on Stacks. Track donations, milestones, and fund releases with full transparency on-chain.",
  keywords: ["charity", "blockchain", "transparency", "donations", "Stacks", "Web3", "decentralized", "Bitcoin"],
  authors: [{ name: "Ilenoid Team" }],
  creator: "Ilenoid Team",
  publisher: "Ilenoid Team",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Ilenoid",
    title: "Ilenoid",
    description: "A transparent blockchain-based charity tracking platform built on Stacks",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ilenoid",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ilenoid",
    description: "A transparent blockchain-based charity tracking platform built on Stacks",
    images: ["/og-image.png"],
    creator: "@ilenoid",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MiniAppInitializer />
        <ErrorBoundary>
          <Providers>
            {children}
            <NetworkError />
            <Modals />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
