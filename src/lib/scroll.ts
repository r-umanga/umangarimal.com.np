import { create } from "zustand";

type ScrollState = {
  progress: number;
  y: number;
  mouseX: number;
  mouseY: number;
  orbit: number;
  /** 0→1 local scroll progress through the camera section only. Drives scroll-linked motion. */
  cameraProgress: number;
  reduced: boolean;
  hovering: string | null;
  setProgress: (progress: number, y: number) => void;
  setMouse: (x: number, y: number) => void;
  addOrbit: (delta: number) => void;
  setCameraProgress: (progress: number) => void;
  setReduced: (reduced: boolean) => void;
  setHovering: (label: string | null) => void;
};

export const useScroll = create<ScrollState>((set) => ({
  progress: 0,
  y: 0,
  mouseX: 0,
  mouseY: 0,
  orbit: 0,
  cameraProgress: 0,
  reduced: false,
  hovering: null,
  setProgress: (progress, y) => set({ progress, y }),
  setMouse: (mouseX, mouseY) => set({ mouseX, mouseY }),
  addOrbit: (delta) => set((s) => ({ orbit: s.orbit + delta })),
  setCameraProgress: (cameraProgress) => set({ cameraProgress }),
  setReduced: (reduced) => set({ reduced }),
  setHovering: (hovering) => set({ hovering }),
}));
