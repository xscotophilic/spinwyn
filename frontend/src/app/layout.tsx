import { Metadata } from "next";
import { Inter } from "next/font/google";

import "./styles/globals.css";
import Providers from "./providers";
import Navbar from "@/components/shared/Navbar";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "SpinWyn",
  description:
    "SpinWyn - A decentralized spin-to-win platform built on Ethereum",
  keywords: ["spin-to-win", "ethereum", "blockchain", "dapp", "web3"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
