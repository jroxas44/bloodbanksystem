"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Heart,
  Droplets,
  ClipboardList,
  Package,
  LogOut,
  UserCog,
} from "lucide-react";

const clerkLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/donors", label: "Donors", icon: Heart },
  { href: "/donations", label: "Donations", icon: Droplets },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/requests", label: "Requests", icon: ClipboardList },
];

const adminLinks = [
  { href: "/users", label: "User Management", icon: UserCog },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const links = isAdmin ? [...clerkLinks, ...adminLinks] : clerkLinks;

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
          <Droplets className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold">BloodBank</h1>
          <p className="text-xs text-muted-foreground">Management System</p>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-red-50 text-red-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-red-100 text-red-700 text-xs">
              {session?.user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.role === "ADMIN" ? "Administrator" : "Clerk"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
