// app/layout.tsx
"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eceran TopUp - Platform PPOB Digital Terpercaya",
  description:
    "Top up pulsa, paket data, dan berbagai layanan digital dengan mudah dan aman",
  keywords: "topup, pulsa, paket data, ppob, digital payment",
  authors: [{ name: "Eceran TopUp" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

// app/page.tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard");
}

// components/providers/auth-provider.tsx
("use client");

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
