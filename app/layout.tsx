import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { helvetica, editorial } from "./utils/fonts/fonts";
import LayoutWrapper from "./LayoutWrapper";

import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Type Harder Studio by Bea",
  description: "Helping brands and people stand out.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`
        ${helvetica.variable}
        ${editorial.variable}
        ${geistMono.variable}
        h-full antialiased
      `}
    >
      <body className="min-h-full flex flex-col">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}