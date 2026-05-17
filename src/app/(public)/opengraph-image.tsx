import { ImageResponse } from "next/og";

// Boyut: Open Graph standardı
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tüm public sayfalar için varsayılan OG görseli
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F5F0E8",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* Logo benzeri metin */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 300,
            color: "#1A1814",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          YUUŞAL
        </div>
        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "#6B5E4C",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Zarafetin Yumuşak Hali
        </div>
        {/* Alt dekorasyon çizgisi */}
        <div
          style={{
            width: 80,
            height: 1,
            background: "#9E8C7B",
            marginTop: 8,
          }}
        />
      </div>
    ),
    size,
  );
}
