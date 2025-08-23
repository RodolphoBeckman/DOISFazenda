
"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Home,
  Import,
  Settings,
  Users,
  Baby,
  Beaker,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/cows", icon: Users, label: "Vacas" },
  { href: "/births", icon: Baby, label: "Nascimentos" },
  { href: "/iaths", icon: Beaker, label: "IATF" },
  { href: "/import", icon: Import, label: "Importar" },
  { href: "/settings", icon: Settings, label: "Configurações" },
];

function Logo() {
  return (
    <Image 
      src="/Icone DOIS.png" 
      alt="DOIS Logo" 
      width={80} 
      height={80} 
      className="h-20 w-20"
    />
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
             <div className="flex h-screen w-full items-center justify-center">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return null;
    }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar collapsible="icon" side="left">
        <SidebarHeader className="relative h-24 flex items-center justify-center p-2 group-data-[collapsible=icon]:h-12">
            <div className="flex items-center justify-center flex-grow group-data-[collapsible=icon]:hidden">
                <Logo />
            </div>
            <SidebarTrigger className="absolute top-2 right-2 group-data-[collapsible=icon]:hidden" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
         <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                tooltip={{ children: "Sair" }}
              >
                <LogOut />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex-1">{children}</SidebarInset>
    </div>
  );
}


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return <AuthLayout>{children}</AuthLayout>;
}
