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
    default: "MisaElectro — Electrical Materials & Supplies | misaelectro.ro",
    template: "%s | MisaElectro — misaelectro.ro",
  },
  description:
    "MisaElectro (misaelectro.ro) — your trusted source for electrical materials, wiring, lighting and installation supplies across Europe. Certified inventory, fast delivery.",
  applicationName: "MisaElectro",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://misaelectro.ro"),
  openGraph: {
    type: "website",
    siteName: "MisaElectro",
    url: "https://misaelectro.ro",
    title: "MisaElectro — Electrical Materials & Supplies",
    description:
      "Certified electrical materials, wiring, lighting and installation supplies. Delivered across Europe.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@misaelectro",
    title: "MisaElectro — misaelectro.ro",
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
