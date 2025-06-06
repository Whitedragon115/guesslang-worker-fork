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
export default defineConfig(({ command }) => {
  // Check if we're building for Node.js server
  const isServerBuild = process.argv.includes('--ssr') || process.env.BUILD_TARGET === 'server';
    if (command === 'build' && isServerBuild) {
    // Server build configuration
    return {
      build: {
        rollupOptions: {
          input: "src/server.ts",
          output: {
            entryFileNames: 'server.js',
            format: 'es'
          },
          external: ['@hono/node-server', '@tensorflow/tfjs-core', '@tensorflow/tfjs-backend-cpu', '@tensorflow/tfjs-converter']
        },
        target: 'node18',
        ssr: true,
        minify: false,
        outDir: 'dist-server'
      },
      assetsInclude: ["**/*.bin"],
      plugins: [vitePluginArraybuffer, vitePluginIgnoreContentManifest],
    };} else if (command === 'build') {
    // Client build configuration
    return {
      build: {
        rollupOptions: {
          input: "src/client/index.tsx",
          output: {
            entryFileNames: 'main.js',
            format: 'es'
          }
        },
        target: 'es2020',
        outDir: 'dist/static',
        minify: true,
        emptyOutDir: false
      },
      assetsInclude: ["**/*.bin"],
      plugins: [vitePluginArraybuffer, vitePluginIgnoreContentManifest],
    };
  }
  
  // Dev configuration
  return {
    assetsInclude: ["**/*.bin"],
    plugins: [vitePluginArraybuffer, vitePluginIgnoreContentManifest],
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  };
});
