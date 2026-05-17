"use client";
import { useEffect } from "react";
import { useApp } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const darkMode = useApp((s) => s.settings.darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  return <>{children}</>;
}
