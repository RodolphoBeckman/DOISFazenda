
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppLayout } from "@/components/layout/app-layout";
import { SettingsProvider } from "@/contexts/settings-context";
import { DataProvider } from "@/contexts/data-context";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: "DOIS - Controle de Vacas Paridas",
  description: "Gestão de gado de corte: nascimentos, IATF, lotes e mais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <div className="aurora-bg" />
         <AuthProvider>
            <SettingsProvider>
            <DataProvider>
                <SidebarProvider>
                <AppLayout>{children}</AppLayout>
                <Toaster />
                </SidebarProvider>
            </DataProvider>
            </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
