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
  description: "EduZH-Konto mit iPhone oder Android einrichten – ohne Laptop.",
  openGraph: {
    title: "EduZH-Erstlogin",
    description: "iPhone oder Android",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "EduZH-Start – iPhone oder Android" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduZH-Erstlogin",
    description: "iPhone oder Android",
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
