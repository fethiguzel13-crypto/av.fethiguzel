/**
 * Patch Next.js 16.2.x production Lambda crash:
 *
 * console-file.js does unconditional:
 *   require("../dev/browser-logs/file-logger")
 * even though usage is NODE_ENV === "development" only.
 * Vercel NFT omits the dev folder → cold start 500 on every SSR route.
 *
 * Safe fix: wrap require in try/catch + no-op stub so production never dies.
 * Idempotent — safe to re-run on postinstall / prebuild.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, "..");
const require = createRequire(import.meta.url);

const MARKER = "/* patched-file-logger-vercel */";

const STUB_REQUIRE = `${MARKER}
let _filelogger;
try {
    _filelogger = require("../dev/browser-logs/file-logger");
} catch (_e) {
    _filelogger = {
        getFileLogger: () => ({
            logServer() {},
            logClient() {},
            flush() {},
        }),
    };
}
`;

function resolveConsoleFile() {
  try {
    const nextPkg = require.resolve("next/package.json");
    return join(dirname(nextPkg), "dist/server/node-environment-extensions/console-file.js");
  } catch {
    return join(
      root,
      "node_modules/next/dist/server/node-environment-extensions/console-file.js"
    );
  }
}

function patch() {
  const target = resolveConsoleFile();
  if (!existsSync(target)) {
    console.warn(`[patch-next-file-logger] skip — not found: ${target}`);
    return false;
  }

  let src = readFileSync(target, "utf8");
  if (src.includes(MARKER)) {
    console.log("[patch-next-file-logger] already patched");
    return true;
  }

  const needle = 'const _filelogger = require("../dev/browser-logs/file-logger");';
  if (!src.includes(needle)) {
    // alternate quote / path styles
    const alt =
      /const\s+_filelogger\s*=\s*require\(["']\.\.\/dev\/browser-logs\/file-logger["']\);/;
    if (!alt.test(src)) {
      console.warn(
        "[patch-next-file-logger] unexpected console-file.js shape — no require found"
      );
      return false;
    }
    src = src.replace(alt, STUB_REQUIRE.trimEnd());
  } else {
    src = src.replace(needle, STUB_REQUIRE.trimEnd());
  }

  writeFileSync(target, src, "utf8");
  console.log(`[patch-next-file-logger] patched ${target}`);
  return true;
}

const ok = patch();
process.exit(ok ? 0 : 0); // never fail install
