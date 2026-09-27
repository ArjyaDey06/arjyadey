import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Arjya Dey | Portfolio",
  description: "Software Developer Portfolio of Arjya Dey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
