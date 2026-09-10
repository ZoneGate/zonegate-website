import type { Metadata } from "next";
import "./globals.css";

import Shell from "@/components/layout/Shell";

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
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
