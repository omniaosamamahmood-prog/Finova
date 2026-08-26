import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

type MobileNavScrollProps = {
  children: ReactNode;
  "aria-label": string;
};

type OverflowState = {
  left: boolean;
  right: boolean;
};

const EDGE_EPS = 4;

function measureOverflow(el: HTMLElement): OverflowState {
  const { scrollWidth, clientWidth } = el;
  if (scrollWidth <= clientWidth + EDGE_EPS) {
    return { left: false, right: false };
  }

  const containerRect = el.getBoundingClientRect();
  let minLeft = Infinity;
  let maxRight = -Infinity;

  for (const child of el.children) {
    const rect = (child as HTMLElement).getBoundingClientRect();
    minLeft = Math.min(minLeft, rect.left);
    maxRight = Math.max(maxRight, rect.right);
  }

  return {
    left: minLeft < containerRect.left - EDGE_EPS,
    right: maxRight > containerRect.right + EDGE_EPS,
  };
}

function MobileNavScroll({
  children,
  "aria-label": ariaLabel,
}: MobileNavScrollProps) {
  const { t, i18n } = useTranslation();
  const scrollerRef = useRef<HTMLElement>(null);
  const [{ left, right }, setOverflow] = useState<OverflowState>({
    left: false,
    right: false,
  });

  const updateOverflow = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setOverflow(measureOverflow(el));
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateOverflow();

    const onScroll = () => updateOverflow();
    el.addEventListener("scroll", onScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => updateOverflow());
    resizeObserver.observe(el);

    const mutationObserver = new MutationObserver(() => updateOverflow());
    mutationObserver.observe(el, { childList: true, subtree: true });

    window.addEventListener("resize", updateOverflow);

    return () => {
      el.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", updateOverflow);
    };
  }, [i18n.language]);

  const scrollByPage = (visualDirection: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;

    const amount = Math.max(el.clientWidth * 0.65, 120);
    const delta = visualDirection === "left" ? -amount : amount;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="relative -mx-3 mt-1.5">
      <nav
        ref={scrollerRef}
        className="nav-scroll flex snap-x snap-mandatory gap-1 overflow-x-auto px-3 pb-2 pt-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label={ariaLabel}
      >
        {children}
      </nav>

      {left && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-bg-elevated via-bg-elevated/90 to-transparent"
          />
          <button
            type="button"
            onClick={() => scrollByPage("left")}
            className="absolute top-1/2 left-1 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-elevated text-primary shadow-sm transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={t("common.moreNav")}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
        </>
      )}

      {right && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-bg-elevated via-bg-elevated/90 to-transparent"
          />
          <button
            type="button"
            onClick={() => scrollByPage("right")}
            className="absolute top-1/2 right-1 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-elevated text-primary shadow-sm transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={t("common.moreNav")}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </>
      )}
    </div>
  );
}

export default MobileNavScroll;
