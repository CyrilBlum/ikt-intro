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
  description: "Interaktive IKT-Anleitungen für Schüler*innen und Klassenlehrpersonen.",
  openGraph: {
    title: "IKT-Einführung der KST FDU",
    description: "Für Schüler*innen und Klassenlehrpersonen",
    images: [{ url: "/og-klp-2026.png", width: 1730, height: 909, alt: "IKT-Einführung – Für Schüler*innen und Klassenlehrpersonen" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IKT-Einführung der KST FDU",
    description: "Für Schüler*innen und Klassenlehrpersonen",
    images: ["/og-klp-2026.png"],
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "747x747" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
