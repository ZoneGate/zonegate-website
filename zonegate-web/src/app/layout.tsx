import type { Metadata } from "next";
import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "ZoneGate",
  description: "Secure logistics authorization platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-[#0F172A] antialiased">
        <Sidebar />

        <div className="ml-64 min-h-screen">
          <Header />

          <main className="min-h-screen bg-[#F8FAFC] px-6 pb-6 pt-20">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}