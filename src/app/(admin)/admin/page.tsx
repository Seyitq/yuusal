import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { productService } from "@/server/services/product.service";
import { contactService } from "@/server/services/contact.service";
import { newsletterService } from "@/server/services/newsletter.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, MessageSquare, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

async function DashboardStats() {
  const [products, unreadMessages, subscriberCount] = await Promise.all([
    productService.listAll({}),
    contactService.countUnread(),
    newsletterService.count(),
  ]);

  const stats = [
    {
      title: "Toplam Ürün",
      value: products.total,
      icon: Package,
      href: "/admin/urunler",
      color: "text-bronze",
    },
    {
      title: "Okunmamış Mesaj",
      value: unreadMessages,
      icon: MessageSquare,
      href: "/admin/iletisim-mesajlari",
      color: "text-red-500",
      urgent: unreadMessages > 0,
    },
    {
      title: "Bülten Abonesi",
      value: subscriberCount,
      icon: Users,
      href: "/admin/bulten",
      color: "text-green-600",
    },
    {
      title: "Aktif Ürün",
      value: products.products.filter((p: { isActive: boolean }) => p.isActive).length,
      icon: TrendingUp,
      href: "/admin/urunler",
      color: "text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Link key={stat.title} href={stat.href}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-taupe-400/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-ink-500">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-ink-900">{stat.value}</span>
                {stat.urgent && (
                  <Badge variant="destructive" className="text-xs">Yeni</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

async function RecentMessages() {
  const messages = await contactService.getAll({ take: 5 });

  return (
    <Card className="border-taupe-400/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Son Mesajlar</CardTitle>
        <Link href="/admin/iletisim-mesajlari" className="text-xs text-bronze hover:underline">
          Tümünü gör
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-ink-500 text-center py-4">Henüz mesaj yok.</p>
        )}
        {messages.map((msg: { id: string; name: string; subject?: string | null; isRead: boolean; createdAt: Date }) => (
          <div key={msg.id} className="flex items-center justify-between py-2 border-b border-taupe-400/20 last:border-0">
            <div>
              <p className="text-sm font-medium text-ink-900">{msg.name}</p>
              <p className="text-xs text-ink-500 truncate max-w-[200px]">{msg.subject ?? "Konu belirtilmemiş"}</p>
            </div>
            <div className="flex items-center gap-2">
              {!msg.isRead && <Badge variant="destructive" className="text-[10px] px-1.5">Yeni</Badge>}
              <span className="text-xs text-ink-300">
                {new Date(msg.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

async function RecentProducts() {
  const { products } = await productService.listAll({ take: 5 });

  return (
    <Card className="border-taupe-400/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Son Ürünler</CardTitle>
        <Link href="/admin/urunler" className="text-xs text-bronze hover:underline">
          Tümünü gör
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {products.length === 0 && (
          <p className="text-sm text-ink-500 text-center py-4">Henüz ürün yok.</p>
        )}
        {products.map((product: { id: string; name: string; isActive: boolean; createdAt: Date }) => (
          <div key={product.id} className="flex items-center justify-between py-2 border-b border-taupe-400/20 last:border-0">
            <p className="text-sm font-medium text-ink-900">{product.name}</p>
            <div className="flex items-center gap-2">
              <Badge variant={product.isActive ? "default" : "secondary"} className="text-[10px]">
                {product.isActive ? "Aktif" : "Pasif"}
              </Badge>
              <span className="text-xs text-ink-300">
                {new Date(product.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/admin/giris");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-500 mt-1">Hoş geldiniz, {session.user.name ?? session.user.email}</p>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      }>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
          <RecentMessages />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
          <RecentProducts />
        </Suspense>
      </div>
    </div>
  );
}
