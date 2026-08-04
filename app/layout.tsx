import type { Metadata, Viewport } from "next";
import { Zilla_Slab } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "./ServiceWorkerRegister";
import { SiteHeader } from "./SiteHeader";

const zillaSlab = Zilla_Slab({
  variable: "--font-zilla-slab",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "School Directory Uganda | Find schools in every region",
  description:
    "Search and compare government and private schools across all regions and districts of Uganda — see fees, contacts, and details in one place.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${zillaSlab.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
