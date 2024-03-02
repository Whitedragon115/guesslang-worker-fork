import { promises } from "fs";
import { PluginOption, defineConfig } from "vite";

// Make vitest work with worker

// Ported from https://github.com/tachibana-shin/vite-plugin-arraybuffer/blob/main/src/main.ts
const vitePluginArraybuffer: PluginOption = {
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

// https://github.com/honojs/hono/issues/1127#issuecomment-1849001490
const vitePluginIgnoreContentManifest: PluginOption = {
  name: "vite-plugin-ignore-content-manifest",

  resolveId(id, importer, options) {
    if (id === "__STATIC_CONTENT_MANIFEST") {
      return id;
    }
    return null; // ignore other cases
  },
  load(id) {
    if (id === "__STATIC_CONTENT_MANIFEST") {
      // Provide a custom code for __STATIC_CONTENT_MANIFEST
      return `export default "{}"`;
    }
    return null;
  },
};

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
  plugins: [vitePluginArraybuffer, vitePluginIgnoreContentManifest],
});
