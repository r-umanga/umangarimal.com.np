import { useEffect, useRef, useState } from "react";
import { NAV, SITE } from "@/lib/content";
import { useScroll } from "@/lib/scroll";
import { cn } from "@/lib/cn";

/* ─── Loader ──────────────────────────────────────────────── */
export function Loader() {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const a = window.setTimeout(() => setOpen(true), 150);
    const b = window.setTimeout(() => setGone(true), 950);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  return (
    <div
      className={cn("loader", open && "is-open", gone && "is-gone")}
      aria-hidden={gone}
    >
      <div className="loader-line" />
      <p className="loader-name">{SITE.name}</p>
    </div>
  );
}

/* ─── Grain ───────────────────────────────────────────────── */
export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}

/* ─── Corners / Brackets ──────────────────────────────────── */
export function Corners() {
  return (
    <>
      <span className="bracket-tl" aria-hidden="true" />
      <span className="bracket-tr" aria-hidden="true" />
      <span className="bracket-bl" aria-hidden="true" />
      <span className="bracket-br" aria-hidden="true" />
    </>
  );
}

/* ─── HUD ─────────────────────────────────────────────────── */
export function Hud() {
  const y = useScroll((s) => s.y);
  const frame = Math.min(9999, Math.floor(y / 4) + 1)
    .toString()
    .padStart(4, "0");

  return (
    <div
      className="pointer-events-none fixed bottom-5 left-0 right-0 z-40 hidden items-end justify-between px-7 lg:flex"
      aria-hidden="true"
    >
      <span
        style={{
          fontSize: 9,
          letterSpacing: "0.28em",
          color: "var(--color-ink-muted)",
          textTransform: "uppercase",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        F-{frame}
      </span>
      <span
        style={{
          fontSize: 9,
          letterSpacing: "0.22em",
          color: "var(--color-ink-muted)",
          textTransform: "uppercase",
        }}
      >
        Kathmandu · Nepal
      </span>
    </div>
  );
}

/* ─── Cursor ──────────────────────────────────────────────── */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const hovering = useScroll((s) => s.hovering);
  const rx = useRef(0);
  const ry = useRef(0);
  const mx = useRef(0);
  const my = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;
      if (dot.current) {
        dot.current.style.left = `${e.clientX}px`;
        dot.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const loop = () => {
      rx.current += (mx.current - rx.current) * 0.11;
      ry.current += (my.current - ry.current) * 0.11;
      if (ring.current) {
        ring.current.style.left = `${rx.current}px`;
        ring.current.style.top = `${ry.current}px`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className={cn("cursor-ring", hovering && "is-on")}>
        {hovering}
      </div>
    </>
  );
}

/* ─── Nav ─────────────────────────────────────────────────── */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* Desktop nav bar */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-300 md:px-10",
        )}
        style={
          scrolled
            ? {
                borderBottom: "1px solid var(--color-rule)",
                background: "rgb(245 240 232 / 0.94)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                paddingTop: 14,
                paddingBottom: 14,
              }
            : {}
        }
      >
        {/* Wordmark */}
        <a
          href="#top"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            letterSpacing: "0.04em",
            color: "var(--color-ink)",
            fontWeight: 300,
            textDecoration: "none",
          }}
        >
          {SITE.name}
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-ink-muted)",
                transition: "color 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-ink)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-ink-muted)")
              }
            >
              {n.label}
            </a>
          ))}
        </div>

        {/* Availability badge */}
        <div className="hidden items-center gap-2 md:flex">
          <span
            className="hud-dot"
            style={{ background: "var(--color-accent)" }}
          />
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "var(--color-ink-muted)",
              textTransform: "uppercase",
            }}
          >
            Available
          </span>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="relative z-50 flex flex-col gap-[5px] md:hidden"
          style={{ background: "none", border: "none", padding: 4 }}
        >
          <span
            className="block h-px w-5 transition-all duration-300"
            style={{
              background: "var(--color-ink)",
              transform: open
                ? "translateY(6px) rotate(45deg)"
                : "none",
            }}
          />
          <span
            className="block h-px w-5 transition-all duration-300"
            style={{
              background: "var(--color-ink)",
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block h-px w-5 transition-all duration-300"
            style={{
              background: "var(--color-ink)",
              transform: open
                ? "translateY(-6px) rotate(-45deg)"
                : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className="fixed inset-0 z-40 md:hidden"
        aria-hidden={!open}
        style={{
          background: "var(--color-bg)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.45,0,0.15,1)",
        }}
      >
        <div className="flex h-full flex-col justify-center px-10">
          {NAV.map((n, i) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(30px, 7vw, 44px)",
                fontWeight: 300,
                color: "var(--color-ink)",
                display: "block",
                padding: "12px 0",
                borderBottom: "1px solid var(--color-rule)",
                textDecoration: "none",
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateX(16px)",
                transition: `opacity 0.35s var(--ease-out) ${i * 0.06}s, transform 0.35s var(--ease-out) ${i * 0.06}s`,
              }}
            >
              {n.label}
            </a>
          ))}
          <a
            href={`mailto:${SITE.email}`}
            style={{
              marginTop: 40,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              textDecoration: "none",
            }}
          >
            {SITE.email}
          </a>
        </div>
      </div>
    </>
  );
}
