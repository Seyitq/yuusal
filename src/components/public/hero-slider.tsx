"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  desktopImage: string;
  mobileImage?: string | null;
};

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);

    // Otomatik geçiş (5 saniye)
    const timer = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(timer);
    };
  }, [emblaApi]);

  if (!slides.length) return null;

  return (
    <section className="relative overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex-none w-full aspect-[4/3] md:aspect-[16/7]">
              <Image
                src={slide.desktopImage}
                alt={slide.title ?? "Hero görsel"}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-ink-900/25" />

              {/* İçerik */}
              {(slide.title || slide.ctaText) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  {slide.subtitle && (
                    <p className="text-cream-200 font-sans text-xs uppercase tracking-[0.3em] mb-4">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.title && (
                    <h2 className="font-serif text-4xl md:text-6xl text-cream-50 font-light leading-tight mb-6">
                      {slide.title}
                    </h2>
                  )}
                  {slide.ctaText && slide.ctaLink && (
                    <Link
                      href={slide.ctaLink}
                      className="inline-block font-sans text-xs uppercase tracking-[0.2em] text-cream-50 border border-cream-50/60 hover:bg-cream-50 hover:text-ink-900 px-10 py-3.5 transition-colors"
                    >
                      {slide.ctaText}
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Önceki / Sonraki */}
      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 bg-cream-50/80 hover:bg-cream-50 text-ink-900 transition-colors"
            aria-label="Önceki slayt"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 bg-cream-50/80 hover:bg-cream-50 text-ink-900 transition-colors"
            aria-label="Sonraki slayt"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Nokta indikatörler */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-1.5 transition-all ${
                  i === selectedIndex ? "w-6 bg-cream-50" : "w-1.5 bg-cream-50/50"
                }`}
                aria-label={`Slayt ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}