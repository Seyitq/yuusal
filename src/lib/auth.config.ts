// Edge runtime ile uyumlu hafif auth yapılandırması.
// bcryptjs, PrismaAdapter veya Node.js modülü içermez.
// Middleware bu dosyayı kullanır.
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/giris",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginRoute = nextUrl.pathname === "/admin/giris";

      if (isAdminRoute && !isLoginRoute) {
        if (isLoggedIn) return true;
        // Giriş yapmamış → /admin/giris'e yönlendir
        return Response.redirect(new URL("/admin/giris", nextUrl));
      }

      if (isLoginRoute && isLoggedIn) {
        // Zaten giriş yapmış → dashboard'a yönlendir
        return Response.redirect(new URL("/admin", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
