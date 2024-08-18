import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ReduxProvider from "@/components/ReduxProvider";
import Menu from "@/components/Menu";
import DraggableCircularNav from "@/components/DraggableCircularNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Computer",
  description: "Developed by Tirtharaj Karmakar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className={inter.className}>
        <ReduxProvider>
          <Header />
          {children}
          
          <Menu />
        </ReduxProvider>
      </body>
    </html>
  );
}
