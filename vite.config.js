// FILE: vite.config.js  (NEW)
import { defineConfig } from "vite";

// Minimal config. Vite serves index.html from the repository root and
// transpiles the TypeScript modules that engine.js imports
// (./aether/Founder, ./runtime/CompositionRuntimeBridge), resolving their
// extensionless specifiers. index.html needs no change — it still loads
// ./engine.js as a module.
//
// No aliases, no plugins, no path rewriting: the repository's existing
// relative-import structure is preserved exactly as authored.
export default defineConfig({
  root: ".",
  server: {
    open: true
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2020"
  }
});
