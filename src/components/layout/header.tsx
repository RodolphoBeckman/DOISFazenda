
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Import,
  Settings,
  Users,
  Baby,
  Beaker,
  LogOut,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

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
    <Link href="/" className="flex items-center gap-2">
      <Image 
        src="/Icone DOIS.png" 
        alt="DOIS Logo" 
        width={40} 
        height={40} 
        className="h-10 w-10"
      />
      <span className="font-headline text-lg font-bold hidden sm:inline-block">DOIS</span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden md:flex md:gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={handleLogout} title="Sair">
                <LogOut className="h-5 w-5" />
           </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex h-full flex-col">
                <div className="p-4 border-b">
                   <Logo />
                </div>
                <nav className="flex-1 grid gap-2 p-4">
                  {navItems.map((item) => (
                     <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                             pathname === item.href && "bg-muted text-primary"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                    </SheetClose>
                  ))}
                </nav>
                 <div className="mt-auto p-4 border-t">
                    <Button className="w-full justify-start gap-3" variant="ghost" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Sair
                    </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
