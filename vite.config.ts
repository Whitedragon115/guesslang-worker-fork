import { promises } from "fs";
import { PluginOption, defineConfig } from "vite";

// Make vitest work with worker

// Ported from https://github.com/tachibana-shin/vite-plugin-arraybuffer/blob/main/src/main.ts
function vitePluginArraybuffer(): PluginOption {
  return {
    name: "vite-plugin-arraybuffer",
    resolveId(id) {
      if (id.endsWith(".bin")) {
        return id;
      }

      return;
    },
    async transform(_src, id) {
      if (id.endsWith(".bin")) {
        const file = id;
        this.addWatchFile(file);
        return `export default new Uint8Array([
          ${new Uint8Array(await promises.readFile(file)).join(",")}
        ]).buffer`;
      }
      return;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/client/index.tsx",
      fileName: "main",
      formats: ["cjs"],
    },
  },
  assetsInclude: ["**/*.bin"],
  plugins: [vitePluginArraybuffer()],
});
