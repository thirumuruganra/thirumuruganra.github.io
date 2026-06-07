import { createFileRoute } from "@tanstack/react-router";
import { PixelDesktop } from "@/components/pixel-os/PixelDesktop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thirumurugan RA — Portfolio" },
      {
        name: "description",
        content:
          "Pixel-art OS portfolio of Thirumurugan RA — CS student & software developer. Projects, experience, and résumé.",
      },
      { property: "og:title", content: "Thirumurugan RA — Portfolio" },
      {
        property: "og:description",
        content: "A retro pixel-art desktop portfolio: projects, about, contact, résumé.",
      },
      { property: "og:image", content: "/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.png" },
    ],
  }),
  component: Index,
});

function Index() {
  return <PixelDesktop />;
}
