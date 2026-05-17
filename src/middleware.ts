// Edge runtime'da çalışan hafif auth middleware.
// Node.js modülü içermeyen auth.config.ts kullanılır.
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
