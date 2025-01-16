import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
    }),
  ],
  server: {
    host: "0.0.0.0",
    cors: {
      origin: "*", // specify your allowed origin
      credentials: true, // allow credentials
    },
  },

  base: "/pulsar/itsm/",
  build: {
    chunkSizeWarningLimit: 3000,
  },
});
