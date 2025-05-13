import { createRoot } from "react-dom/client";
import "./scss/init.scss";
import App from "./app/App.tsx";
import { ImageProvider } from "./contexts/ImageContext/ImageContext.tsx";
import { ToolProvider } from "./contexts/ToolContext/ToolContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ImageProvider>
    <ToolProvider>
      <App />
    </ToolProvider>
  </ImageProvider>,
);
