import { defineConfig, type Options } from "tsup"

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts"],
  clean: true,
  dts: true,
  format: ["esm"],
  target: "esnext",
  external: ["prettier", "eslint"],
  banner: {
    js: `#!/usr/bin/env node
    const { require, __filename, __dirname } = await (async () => {
      const { createRequire } = await import("node:module");
      const { fileURLToPath } = await import("node:url");

      return {
        require: createRequire(import.meta.url),
        __filename: fileURLToPath(import.meta.url),
        __dirname: fileURLToPath(new URL(".", import.meta.url)),
      };
    })();`,
  },
  ...options,
}))
