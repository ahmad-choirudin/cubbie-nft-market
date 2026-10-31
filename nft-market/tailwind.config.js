export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  future: { hoverOnlyWhenSupported: true },
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        bg: "#090A09", slab: "#121412", acc: "#C4F56A", ink: "#ECEFE8", dim: "#8E968B",
        coal: "#0D0F0D", char: "#1A1D1A", edge: "#262A26",
      },
      fontFamily: {
        d: ["Archivo", "system-ui", "sans-serif"],
        m: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
        b: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
