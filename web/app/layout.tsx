import type { Metadata } from "next";
import { Catamaran } from "next/font/google";
import "./globals.css";

const catamaran = Catamaran({
  subsets: ["latin"],
  variable: "--font-catamaran",
});

export const metadata: Metadata = {
  title: "Real IT",
  description: "Plataforma de análise de mercado baseada em dados públicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`${catamaran.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
