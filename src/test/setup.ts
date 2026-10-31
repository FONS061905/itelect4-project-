// ===== GT6: test setup =====================================================
// vite.config.ts names this file in test.setupFiles, so Vitest runs it
// before every test file. The app itself never imports it.
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Adds checks such as toBeInTheDocument() and toHaveTextContent() to
// expect(), and tells TypeScript they exist.
import "@testing-library/jest-dom/vitest";

// render() puts each component into the same fake page. Without this,
// one test would still see what the previous test rendered.
afterEach(() => {
  cleanup();
});
