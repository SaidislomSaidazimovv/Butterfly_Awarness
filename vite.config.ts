import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "staging-1-middleware",
      configureServer(server) {
        server.middlewares.use("/staging-1", (req, res, next) => {
          const filePath = path.resolve(__dirname, "public/staging-1.html");
          const content = fs.readFileSync(filePath, "utf-8");
          res.setHeader("Content-Type", "text/html");
          res.end(content);
        });
      },
    },
    react(),
    tailwindcss(),
    viteSingleFile(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
