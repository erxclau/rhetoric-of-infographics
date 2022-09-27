import { defineConfig } from "vite";
import dsv from "@rollup/plugin-dsv";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/rhetoric-of-infographics/",
  plugins: [
    dsv({
      processRow: (row) => {
        Object.keys(row).forEach((key) => {
          row[key] = row[key] === "false" ? false : row[key];
          row[key] = row[key] === "true" ? true : row[key];
          row[key] = row[key] === "null" ? null : row[key];
        });
      },
    }),
  ],
});
