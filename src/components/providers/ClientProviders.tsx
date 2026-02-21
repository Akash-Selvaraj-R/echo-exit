"use client";

import React, { useEffect, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { SafetyProvider } from "@/context/SafetyContext";
import { Toaster } from "sonner";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR, we render a minimal version or nothing if needed.
  // However, for layout children, we should render them but wrap providers
  // that might use browser APIs during mount.
  
  return (
    <AuthProvider>
      <SafetyProvider>
        {children}
        <Toaster position="bottom-right" />
      </SafetyProvider>
    </AuthProvider>
  );
}
