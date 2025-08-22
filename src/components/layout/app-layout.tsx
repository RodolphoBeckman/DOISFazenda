"use client";

import { usePathname } from "next/navigation";
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
      <path d="M18.5 6.5C18.5 8.43 17.57 10 16 10s-2.5-1.57-2.5-3.5S14.43 3 16 3s2.5 1.57 2.5 3.5Z"/>
      <path d="M14 11.5c0 2.5 2 4.5 4 4.5s4-2 4-4.5"/>
      <path d="M4 14.5c0 2.5 2 4.5 4 4.5s4-2 4-4.5"/>
      <path d="M2 9.5C2 11.43 2.93 13 4.5 13S7 11.43 7 9.5 6.07 6 4.5 6 2 7.57 2 9.5Z"/>
      <path d="m14 7 2 3"/><path d="m5 8 2 3"/>
    </svg>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar collapsible="icon" variant="inset" side="left">
        <SidebarHeader className="h-16 flex items-center justify-between p-2">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
             <Logo />
            <span className="font-bold text-xl font-headline">CattleLife</span>
          </div>
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
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
      <SidebarInset className="flex-1 bg-transparent">{children}</SidebarInset>
    </div>
  );
}
