"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light" enableColorScheme>
        {children}
      </ThemeProvider>
    </>
  );
};

export default AppLayout;
