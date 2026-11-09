import { useEffect, useId, useRef } from "preact/hooks";

const still = matchMedia("(prefers-reduced-motion: reduce)");

/** The one eye on every screen: it follows the pointer and blinks now and then. Decoration to most; a nod to those who know. */
export function Eye() {
  const iris = useRef<SVGGElement>(null);
  const clip = useId();

  useEffect(() => {
    const svg = iris.current?.ownerSVGElement;
    if (!svg || still.matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = svg.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, d / 240);
        iris.current?.style.setProperty("translate", `${((dx / d) * 4 * reach).toFixed(2)}px ${((dy / d) * 2.4 * reach).toFixed(2)}px`);
      });
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg class="eye" width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <path d="M3 16C8 7.5 24 7.5 29 16 24 24.5 8 24.5 3 16Z" />
        </clipPath>
      </defs>
      <g class="eye-ball">
        <path d="M3 16C8 7.5 24 7.5 29 16 24 24.5 8 24.5 3 16Z" fill="var(--eye-white, var(--surface))" />
        <g clip-path={`url(#${clip})`}>
          <g class="eye-iris" ref={iris}>
            <circle cx="16" cy="16" r="5.6" fill="currentColor" />
            <circle cx="16" cy="16" r="2" fill="var(--eye-white, var(--surface))" />
          </g>
        </g>
        <path d="M3 16C8 7.5 24 7.5 29 16 24 24.5 8 24.5 3 16Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" />
      </g>
    </svg>
  );
}
