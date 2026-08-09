import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BioBlurt — AQA Biology Active Recall",
  description: "Active Recall + Spec Tracker for AQA A-Level Biology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-text-primary min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
