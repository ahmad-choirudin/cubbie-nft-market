import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";
import "./index.css";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/space-grotesk";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element was not found.");

createRoot(rootElement).render(<App />);
