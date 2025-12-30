import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "BeyondChats AI | Content Enhancement Platform",
  description: "AI-powered content enhancement platform that transforms articles using advanced LLM technology",
  keywords: ["AI", "Content", "Enhancement", "Blogs", "SEO"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <div className="gradient-bg" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
