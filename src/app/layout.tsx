import type { Metadata } from "next";
import { ReduxProvider } from "@/lib/store/provider";

import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/footer";
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
  title: "Ridges Automotors - Quality Vehicles & Service",
  description:
    "Premier automotive dealership in Nairobi, Kenya. Quality used vehicles, certified pre-owned programs, financing solutions, and professional service.",
  keywords:
    "cars, automotive, dealership, vehicles, Kenya, Nairobi, financing, trade-in, certified pre-owned",
  authors: [{ name: "Ridges Automotors" }],
  robots: "index, follow",
  openGraph: {
    title: "Ridges Automotors - Quality Vehicles & Service",
    description:
      "Premier automotive dealership in Nairobi, Kenya. Quality used vehicles, certified pre-owned programs, financing solutions, and professional service.",
    type: "website",
    locale: "en_KE",
    siteName: "Ridges Automotors",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ridges Automotors - Quality Vehicles & Service",
    description:
      "Premier automotive dealership in Nairobi, Kenya. Quality used vehicles, certified pre-owned programs, financing solutions, and professional service.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="msapplication-TileColor" content="#dc2626" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
