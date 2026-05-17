import { AnnouncementBar } from "@/components/public/announcement-bar";
import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { FloatingButtons } from "@/components/public/floating-buttons";
import { CookieBanner } from "@/components/public/cookie-banner";

// Layout altındaki tüm sayfalar DB gerektirdiğinden build zamanında prerender edilmez.
// Docker build'de DB olmadığı için force-dynamic gerekli.
export const dynamic = "force-dynamic";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-full">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingButtons />
      <CookieBanner />
    </div>
  );
}
