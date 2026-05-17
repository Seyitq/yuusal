"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, FolderTree, BookOpen,
  Images, Mail, Bell, Settings, SlidersHorizontal, LogOut, X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/urunler", label: "Ürünler", icon: ShoppingBag },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderTree },
  { href: "/admin/koleksiyonlar", label: "Koleksiyonlar", icon: BookOpen },
  { href: "/admin/slider", label: "Hero Slider", icon: SlidersHorizontal },
  { href: "/admin/blog", label: "Blog", icon: Images },
  { href: "/admin/iletisim-mesajlari", label: "Mesajlar", icon: Mail },
  { href: "/admin/bulten", label: "Bülten", icon: Bell },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-ink-900">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <Link href="/admin" className="font-serif text-xl font-semibold tracking-widest text-cream-50">
          YUUŞAL
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" className="text-cream-300 hover:text-cream-50 lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-bronze/20 text-bronze-light" : "text-cream-300 hover:bg-white/5 hover:text-cream-50",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="border-t border-white/10 p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-cream-400 hover:text-cream-50 transition-colors">
          <ShoppingBag className="h-4 w-4" />
          Siteyi Gör
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/giris" })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-cream-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}