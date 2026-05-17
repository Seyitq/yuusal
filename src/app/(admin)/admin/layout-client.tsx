"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import AdminSidebar from "@/components/admin/sidebar";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-cream-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <AdminSidebar />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 [&>button]:hidden">
          <AdminSidebar onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Ana içerik */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar — sadece mobilde görünür */}
        <header className="flex h-16 items-center gap-4 border-b border-cream-200 bg-white px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-serif text-lg font-semibold tracking-widest text-ink-900">
            YUUŞAL
          </span>
        </header>

        {/* Sayfa içeriği */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
