import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "./ServiceWorkerRegister";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Providers } from "./Providers";
import { EmailVerificationBanner } from "./EmailVerificationBanner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MySchoolApp Uganda | Find schools in every region",
  description:
    "Search and compare government and private schools across all regions and districts of Uganda — see fees, contacts, and details in one place.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#8B1E2D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <SiteHeader />
          <EmailVerificationBanner />
          {children}
          <SiteFooter />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}
