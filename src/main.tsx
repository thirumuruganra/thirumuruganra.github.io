import { RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import { getRouter } from "./router";
import "./styles.css";

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Missing app root element");
}

const router = getRouter();

createRoot(rootElement).render(<RouterProvider router={router} />);
