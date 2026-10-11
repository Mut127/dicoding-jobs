import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dicoding Jobs",
  description: "Temukan lowongan yang cocok untuk kamu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-white text-slate-900`}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}