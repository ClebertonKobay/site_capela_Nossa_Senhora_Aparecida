"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";

type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];

type CarouselContextValue = {
  carouselRef: UseEmblaCarouselType[0];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("useCarousel só funciona dentro de <Carousel>");
  return context;
}

export function Carousel({
  ariaLabel,
  opts,
  className,
  children,
}: {
  ariaLabel: string;
  opts?: CarouselOptions;
  className?: string;
  children: ReactNode;
}) {
  const [carouselRef, api] = useEmblaCarousel({ align: "start", loop: false, ...opts });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  useEffect(() => {
    if (!api) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza o estado inicial com a API do Embla, que só existe depois do mount
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider value={{ carouselRef, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}>
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ className, children }: { className?: string; children: ReactNode }) {
  const { carouselRef } = useCarousel();
  // py-3/-my-3: folga vertical dentro do recorte do Embla — sem ela a
  // sombra, o contorno de foco e a borda de cima dos cartões são cortados.
  return (
    <div ref={carouselRef} className="-my-3 overflow-hidden py-3">
      <div className={cn("-ml-4 flex", className)}>{children}</div>
    </div>
  );
}

export function CarouselItem({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full pl-4", className)}
    >
      {children}
    </div>
  );
}

export function CarouselPrevious({ className }: { className?: string }) {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <IconButton
      aria-label="Anterior"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 rounded-full bg-surface text-primary shadow-lifted hover:!bg-background disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
    >
      <ChevronLeftIcon />
    </IconButton>
  );
}

export function CarouselNext({ className }: { className?: string }) {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <IconButton
      aria-label="Próximo"
      onClick={scrollNext}
      disabled={!canScrollNext}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 rounded-full bg-surface text-primary shadow-lifted hover:!bg-background disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
    >
      <ChevronRightIcon />
    </IconButton>
  );
}
