
import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "@/components/layout/app-layout";
import { SettingsProvider } from "@/contexts/settings-context";
import { DataProvider } from "@/contexts/data-context";
import { AuthProvider } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "DOIS - Controle de Vacas Paridas",
  description: "Gestão de gado de corte: nascimentos, IATF, lotes e mais.",
  manifest: "/manifest.json",
};

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn("font-body antialiased", ptSans.variable)}>
        <div className="aurora-bg" />
         <AuthProvider>
            <SettingsProvider>
            <DataProvider>
                <AppLayout>{children}</AppLayout>
                <Toaster />
            </DataProvider>
            </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
