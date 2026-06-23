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
    default: "NetimStore — Electrical Materials & Supplies | netim.com",
    template: "%s | NetimStore — netim.com",
  },
  description:
    "NetimStore (netim.com) — your trusted source for electrical materials, wiring, lighting and installation supplies across Europe. Certified inventory, fast delivery.",
  applicationName: "NetimStore",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://netim.com"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "NetimStore",
    url: "https://netim.com",
    title: "NetimStore — Electrical Materials & Supplies",
    description:
      "Certified electrical materials, wiring, lighting and installation supplies. Delivered across Europe.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@netimstore",
    title: "NetimStore — netim.com",
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