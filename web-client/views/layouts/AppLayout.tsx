"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark" enableColorScheme>
        {children}
      </ThemeProvider>
    </>
  );
};

export default AppLayout;
