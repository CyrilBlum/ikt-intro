import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IKT-Einführung | KST FDU",
  description: "Interaktive Anleitungen für EduZH, WLAN, Microsoft 365 und BYOD-Grundlagen.",
  openGraph: {
    title: "IKT-Einführung der KST FDU",
    description: "EduZH, WLAN, Microsoft 365 und BYOD-Challenges",
    images: [{ url: "/og-ikt-v2.png", width: 1200, height: 630, alt: "IKT-Einführung – EduZH, WLAN, Microsoft 365 und BYOD" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IKT-Einführung der KST FDU",
    description: "EduZH, WLAN, Microsoft 365 und BYOD-Challenges",
    images: ["/og-ikt-v2.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
