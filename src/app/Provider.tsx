"use client";

import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";

import Navbar from "@/components/organisms/layout/Navbar";
import { store } from "@/redux/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>
        <Navbar />
        {children}
      </Provider>
    </ThemeProvider>
  );
}
