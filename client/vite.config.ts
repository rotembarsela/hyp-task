import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000, // port to match dockerfile
    watch: {
      usePolling: true, // windows users
    },
  },
});
