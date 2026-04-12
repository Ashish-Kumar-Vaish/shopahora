import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/contexts/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopAhora - Minimalist E-commerce",
  description:
    "Discover unique products at ShopAhora, your minimalist e-commerce store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen overflow-x-auto`}
        >
          <AppContextProvider>
            <Navbar />

            <main className="flex-grow container mx-auto px-8 py-8 space-y-8">
              {children}
            </main>
          </AppContextProvider>
          
          <Footer />
          <Toaster expand={true} />
        </body>
      </html>
    </ClerkProvider>
  );
}
