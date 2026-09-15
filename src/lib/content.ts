export const SITE = {
  name: "Umanga Rimal",
  role: "Photographer / Cinematographer",
  statement: "I capture stories through light, motion and perspective.",
  location: "Nepal",
  email: "r.umanga@outlook.com",
  phone: "+977 9712065867",
  phoneHref: "tel:+9779712065867",
  instagram: "https://instagram.com/r.umanga_",
  instagramHandle: "@r.umanga_",
};

export const EQUIPMENT = [
  { idx: "01", name: "Canon EOS 850D", type: "Camera body" },
  { idx: "02", name: "Canon 18–55mm", type: "Kit lens" },
  { idx: "03", name: "Tripod", type: "Support" },
] as const;

export const PHOTO_CATEGORIES = [
  "All",
  "Portraits",
  "Street",
  "Events",
  "Experimental",
] as const;

export type Photo = {
  id: string;
  title: string;
  cat: (typeof PHOTO_CATEGORIES)[number];
  size: "s1" | "s2" | "s3" | "s4";
  src: string;
  note: string;
};

export const PHOTOS: Photo[] = [
  {
    id: "window-i",
    title: "Window Study I",
    cat: "Portraits",
    size: "s1",
    src: "/photos/window-study.webp",
    note: "Late light, quiet room",
  },
  {
    id: "durbar",
    title: "Durbar at Dusk",
    cat: "Street",
    size: "s3",
    src: "/photos/durbar-dusk.webp",
    note: "Kathmandu · blue hour",
  },
  {
    id: "temple",
    title: "Courtyard Light",
    cat: "Experimental",
    size: "s2",
    src: "/photos/temple-light.webp",
    note: "A single shaft of gold",
  },
  {
    id: "mandap",
    title: "Mandap, Evening",
    cat: "Events",
    size: "s3",
    src: "/photos/mandap.webp",
    note: "Marigold and hanging light",
  },
  {
    id: "light-test",
    title: "Light Test 04",
    cat: "Experimental",
    size: "s2",
    src: "/photos/light-test.webp",
    note: "Monochrome courtyard study",
  },
  {
    id: "window-ii",
    title: "Window Study II",
    cat: "Portraits",
    size: "s3",
    src: "/photos/window-study-ii.webp",
    note: "Chair, curtain, residual gold",
  },
  {
    id: "square",
    title: "Evening Crowd",
    cat: "Street",
    size: "s4",
    src: "/photos/square-lights.webp",
    note: "Temple lights as bokeh",
  },
  {
    id: "ceremony",
    title: "Ceremony Frame",
    cat: "Events",
    size: "s3",
    src: "/photos/ceremony.webp",
    note: "Cloth, bloom, dusk",
  },
];

export const FILMS = [
  {
    project: "Untitled Reel",
    year: "2026",
    camera: "Canon EOS 850D",
    lens: "18–55mm",
    frameRate: "24 FPS",
    role: "Cinematography · Editing · Color",
    still: "/photos/durbar-dusk.webp",
  },
];

export const DEV_PROJECTS = [
  {
    name: "This Portfolio",
    role: "Design & Development",
    desc: "A cinematic 3D personal site built around an ivory-and-burgundy, film-archive visual language — scroll-driven, WebGL at the core.",
    still: "/photos/temple-light.webp",
  },
];

export const CREATIVE_PROJECTS = [
  {
    name: "Lumetric Studio",
    tag: "Creative / studio identity",
    line: "Photography & visual projects",
    handle: "@lumetricstudio",
    swatches: ["#0a0908", "#26231f", "#b3915b"],
    url: "https://instagram.com/lumetricstudio",
  },
];

export const JOURNEY = [
  { title: "Photography", note: "Where it started" },
  { title: "Cinematography", note: "Learning motion" },
  { title: "Editing & Color", note: "In progress" },
  { title: "Design", note: "Ongoing" },
  { title: "Development", note: "Ongoing" },
  { title: "Creative Business", note: "Lumetric Studio" },
];

export const SOCIALS = [
  {
    name: "Instagram",
    handle: "@r.umanga_",
    url: "https://instagram.com/r.umanga_",
  },
  {
    name: "Lumetric Studio",
    handle: "@lumetricstudio",
    url: "https://instagram.com/lumetricstudio",
  },
];

export const NAV = [
  { href: "#photography", label: "Photography" },
  { href: "#cinematography", label: "Cinematography" },
  { href: "#lab", label: "The Lab" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export const FRAME_TEXTURES = [
  "/photos/durbar-dusk.webp",
  "/photos/temple-light.webp",
  "/photos/mandap.webp",
  "/photos/window-study.webp",
  "/photos/square-lights.webp",
  "/photos/ceremony.webp",
];
