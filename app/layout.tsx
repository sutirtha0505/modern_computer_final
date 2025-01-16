"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";

const inter = Inter({ subsets: ["latin"] });

// Dynamically import the components
const ReduxProvider = dynamic(() => import("@/components/ReduxProvider"), { ssr: false });
const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const DraggableCircularNav = dynamic(() => import("@/components/DraggableCircularNav"), { ssr: false });
const Menu = dynamic(() => import("@/components/Menu"), { ssr: false });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadComponents = async () => {
      // Dynamically import all the components
      await Promise.all([
        import("@/components/ReduxProvider"),
        import("@/components/Header"),
        import("@/components/DraggableCircularNav"),
        import("@/components/Menu"),
      ]);
      setIsLoading(false);
    };

    loadComponents();
  }, []);

  return (
    <html lang="en" className="bg-[#DFE4E4] dark:bg-black">
      <body className={inter.className}>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <ReduxProvider>
            <Header />
            {children}
            <DraggableCircularNav />
            <Menu />
          </ReduxProvider>
        )}
      </body>
    </html>
  );
}
