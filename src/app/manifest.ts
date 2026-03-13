import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Painel da Familia",
    short_name: "Painel Familia",
    description:
      "Painel operacional da familia com agenda, finanças, compras e insights com IA.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f5fb",
    theme_color: "#7c5cff",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
