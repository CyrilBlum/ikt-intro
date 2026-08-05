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
  title: "EduZH-Erstlogin | IKT-Einführung",
  description: "Interaktive Schritt-für-Schritt-Anleitung für den ersten Login mit dem EduZH-Konto.",
  openGraph: {
    title: "EduZH-Erstlogin",
    description: "In 13 Schritten startklar",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "EduZH-Erstlogin – In 13 Schritten startklar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduZH-Erstlogin",
    description: "In 13 Schritten startklar",
    images: ["/og.png"],
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
