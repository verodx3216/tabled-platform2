import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tabled",
    short_name: "Tabled",
    description: "Real first dates at great tables. Zero swiping.",
    start_url: "/",
    display: "standalone",
    background_color: "#2E3138",
    theme_color: "#2E3138",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
