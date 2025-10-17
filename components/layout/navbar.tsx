"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  Search,
  User,
  Building2,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const [hostUnread, setHostUnread] = useState<number>(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/listings", label: "Explorar", icon: Search },
    { href: "/map", label: "Mapa", icon: Search },
    { href: "/bookings", label: "Viajes", icon: Calendar },
    { href: "/messages", label: "Mensajes", icon: MessageSquare },
  ];

  const visibleNavLinks = navLinks.filter((link) => {
    const requiresGuest =
      link.href === "/bookings" || link.href === "/messages";
    if (requiresGuest)
      return !!session?.user && (session.user as any)?.role === "guest";
    return true;
  });

  const hostLinks = [
    { href: "/host/overview", label: "Resumen", icon: Settings },
    { href: "/host/listings", label: "Mis Propiedades", icon: Building2 },
    { href: "/host/bookings", label: "Reservas", icon: Calendar },
    { href: "/host/messages", label: "Mensajes", icon: MessageSquare },
    { href: "/host/balances", label: "Balances", icon: Settings },
  ];

  const adminLinks = [
    { href: "/admin", label: "Admin", icon: Settings },
    { href: "/admin/analytics", label: "Analíticas", icon: Settings },
    { href: "/admin/properties", label: "Propiedades", icon: Settings },
    { href: "/admin/users", label: "Usuarios", icon: Settings },
    { href: "/admin/pricing", label: "Precios", icon: Settings },
  ];

  useEffect(() => {
    const loadUnread = async () => {
      if (
        !session?.user ||
        (session.user as any)?.role !== "host" ||
        !API_URL
      ) {
        setHostUnread(0);
        return;
      }
      try {
        const hostId = (session.user as any).id;
        const res = await fetch(`${API_URL}/hosts/${hostId}/messages`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          const total = (data.conversations || []).reduce(
            (acc: number, c: any) => acc + (c.unreadCount || 0),
            0
          );
          setHostUnread(total);
        }
      } catch (_) {
        // ignore
      }
    };
    loadUnread();
  }, [session, API_URL]);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-primary">
            RentalHub
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {visibleNavLinks.map((link) => (
              <Button
                key={link.href}
                variant={isActive(link.href) ? "secondary" : "ghost"}
                size="sm"
                asChild
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
            {(session?.user as any)?.role === "host" &&
              hostLinks.map((link) => (
                <Button
                  key={link.href}
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link href={link.href}>
                    {link.label}
                    {link.href === "/host/messages" && hostUnread > 0 && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {hostUnread}
                      </span>
                    )}
                  </Link>
                </Button>
              ))}
            {(session?.user as any)?.role === "admin" &&
              adminLinks.map((link) => (
                <Button
                  key={link.href}
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session?.user && (session.user as any)?.role === "host" ? (
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex"
              asChild
            >
              <Link href="/host/listings">Anfitrión</Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex"
              asChild
            >
              <Link href="/host/listings">Conviértete en anfitrión</Link>
            </Button>
          )}

          <ThemeToggle />

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={(session.user as any)?.image || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                {(session.user as any)?.role === "guest" && (
                  <DropdownMenuItem asChild>
                    <Link href="/bookings">
                      <Calendar className="mr-2 h-4 w-4" />
                      Mis viajes
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {(session.user as any)?.role === "host" &&
                  hostLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href}>
                        <link.icon className="mr-2 h-4 w-4" />
                        {link.label}
                        {link.href === "/host/messages" && hostUnread > 0 && (
                          <span className="ml-auto inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            {hostUnread}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuSeparator />
                {(session.user as any)?.role === "admin" &&
                  adminLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href}>
                        <link.icon className="mr-2 h-4 w-4" />
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </div>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 pt-8">
                {visibleNavLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant={isActive(link.href) ? "secondary" : "ghost"}
                    className="justify-start"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={link.href}>
                      <link.icon className="mr-2 h-4 w-4" />
                      {link.label}
                    </Link>
                  </Button>
                ))}

                {(session?.user as any)?.role === "host" && (
                  <>
                    {hostLinks.map((link) => (
                      <Button
                        key={link.href}
                        variant={isActive(link.href) ? "secondary" : "ghost"}
                        className="justify-start"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href={link.href}>
                          <link.icon className="mr-2 h-4 w-4" />
                          {link.label}
                        </Link>
                      </Button>
                    ))}
                  </>
                )}

                {(session?.user as any)?.role === "admin" && (
                  <>
                    {adminLinks.map((link) => (
                      <Button
                        key={link.href}
                        variant={isActive(link.href) ? "secondary" : "ghost"}
                        className="justify-start"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href={link.href}>
                          <link.icon className="mr-2 h-4 w-4" />
                          {link.label}
                        </Link>
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
