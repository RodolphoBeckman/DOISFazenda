
"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Home,
  Import,
  Settings,
  Users,
  Baby,
  Beaker,
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
} from "@/components/ui/sidebar";

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

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
      </Sidebar>
      <SidebarInset className="flex-1">{children}</SidebarInset>
    </div>
  );
}
