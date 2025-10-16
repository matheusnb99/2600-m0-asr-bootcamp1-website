// @ts-nocheck

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import node from "@astrojs/node";

import fs from "fs";

const keyPath = process.env.SERVER_KEY_PATH;
const certPath = process.env.SERVER_CERT_PATH;

let httpsOptions = false;

if (keyPath && certPath && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
} else {
  console.warn("SSL certificate files not found or environment variables missing. Falling back to HTTP.");
}

// https://astro.build/config
export default defineConfig({
  site: "https://example.com/",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: node({
    mode: "standalone",
  }),
  server: {
    https: httpsOptions,
  },
});
