import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.GITHUB_PAGES ? "/cubbie-nft-market/" : "/",
  build: {
    // three.js (viewer 3D) is a separate chunk loaded only on "View in 3D".
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Stable vendor chunks: they keep their cache across deploys when only app code changes.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return "react";
        },
      },
    },
  },
});
