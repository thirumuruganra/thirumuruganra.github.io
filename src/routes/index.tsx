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
    ],
  }),
  component: Index,
});

function Index() {
  return <PixelDesktop />;
}
