import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: ["jotai/babel/preset"],
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    cors: {
      origin: "http://192.168.151.20", // specify your allowed origin
      credentials: true, // allow credentials
    },
  },

  base: "/pulsar/itsm/",
  // base: "/metronic8/react/demo1/",
  build: {
    chunkSizeWarningLimit: 3000,
  },
});
