import { defineConfig } from "vite";
import dsv from "@rollup/plugin-dsv";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/rhetoric-of-infographics/",
  plugins: [dsv()],
});
