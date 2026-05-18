import type { NextConfig } from "next";

const securityHeaders = [
  // Clickjacking koruması: sayfa başka bir site tarafından iframe içine alınamaz
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // MIME sniffing koruması: tarayıcı Content-Type'ı tahmin etmez
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer bilgisi: sadece aynı origin veya HTTPS → HTTPS geçişlerinde gönderilir
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Tarayıcı API izinlerini kısıtla
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    formats: ["image/webp"],
    localPatterns: [
      { pathname: "/uploads/**" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "yuusal.com" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "12mb" },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
