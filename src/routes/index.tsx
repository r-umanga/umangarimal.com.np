import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SceneMount } from "@/components/scene/SceneMount";
import {
  Corners,
  Cursor,
  Grain,
  Hud,
  Loader,
  Nav,
} from "@/components/chrome/Chrome";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { useScroll } from "@/lib/scroll";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const setProgress = useScroll((s) => s.setProgress);
  const setMouse = useScroll((s) => s.setMouse);
  const setReduced = useScroll((s) => s.setReduced);

  useEffect(() => {
    document.body.classList.add("has-cursor");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reduced);

    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, window.scrollY / max)), window.scrollY);
    };
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse(x, y);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, [setProgress, setMouse, setReduced]);

  return (
    <>
      <Loader />
      <Grain />
      <Cursor />
      <Corners />
      <Hud />
      <Nav />
      <SceneMount />
      <Portfolio />
    </>
  );
}
