import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

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
    default: "Ravora — A refined selection of modern electronics",
    template: "%s | Ravora",
  },
  description:
    "Ravora — a curated, editorial-quality electronics store. Carefully sourced products, transparent shipping, honest warranty. Shipped from the United Kingdom.",
  applicationName: "Ravora",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ravora.co.uk"),
  openGraph: {
    type: "website",
    siteName: "Ravora",
    url: "https://ravora.co.uk",
    title: "Ravora — A refined selection of modern electronics",
    description:
      "Curated electronics from Ravora — carefully sourced, honestly presented. Shipped from the United Kingdom.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ravora",
    title: "Ravora",
  },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
