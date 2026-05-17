// Prisma v7 yapılandırması — .env.local ve .env dosyalarından env değişkenlerini yükler
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // process.env kullanıyoruz — prisma generate DB bağlantısı gerektirmez
    url: process.env.DATABASE_URL ?? "",
  },
});
