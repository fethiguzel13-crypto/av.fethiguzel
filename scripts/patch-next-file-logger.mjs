/**
 * Next.js 16.2.x — production Lambda crash fix (v2 pure stub).
 *
 * console-file.js requires ../dev/browser-logs/file-logger at load time.
 * Vercel NFT omits it → every SSR route 500s ("Cannot find module").
 *
 * Replace ANY assignment to _filelogger that touches file-logger with a
 * pure no-op stub (no require). Strict mode fails the build if verify fails.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, "..");
const require = createRequire(import.meta.url);
const STRICT = process.argv.includes("--strict");
const MARKER = "/* patched-file-logger-vercel-v2-stub */";

const STUB_BLOCK = `${MARKER}
const _filelogger = {
    getFileLogger: function () {
        return {
            logServer: function () {},
            logClient: function () {},
            flush: function () {},
        };
    },
};
`;

function resolveConsoleFile() {
  try {
    const nextPkg = require.resolve("next/package.json");
    return join(
      dirname(nextPkg),
      "dist/server/node-environment-extensions/console-file.js"
    );
  } catch {
    return join(
      root,
      "node_modules/next/dist/server/node-environment-extensions/console-file.js"
    );
  }
}

function isGood(src) {
  if (!src.includes(MARKER)) return false;
  if (/require\(["']\.\.\/dev\/browser-logs\/file-logger["']\)/.test(src)) {
    return false;
  }
  return true;
}

function patch() {
  const target = resolveConsoleFile();
  if (!existsSync(target)) {
    console.warn(`[patch-next-file-logger] NOT FOUND: ${target}`);
    return false;
  }

  let src = readFileSync(target, "utf8");
  if (isGood(src)) {
    console.log("[patch-next-file-logger] already v2-stub OK");
    return true;
  }

  // 1) Remove old v1 try/catch patch block
  src = src.replace(
    /\/\* patched-file-logger-vercel \*\/\s*let _filelogger;\s*try \{[\s\S]*?\n\}\n/,
    ""
  );

  // 2) Remove any remaining require of file-logger (const/let/var)
  src = src.replace(
    /(?:const|let|var)\s+_filelogger\s*=\s*require\(["']\.\.\/dev\/browser-logs\/file-logger["']\);\s*\n?/,
    ""
  );

  // 3) If still has try-require pattern without marker
  src = src.replace(
    /(?:const|let|var)\s+_filelogger[\s\S]{0,40}require\(["']\.\.\/dev\/browser-logs\/file-logger["']\)[\s\S]{0,200}?\n\}\n/,
    ""
  );

  // 4) Insert stub after console-async-storage require (stable anchor)
  const anchor =
    'const _consoleasyncstorageexternal = require("../app-render/console-async-storage.external");';
  if (src.includes(anchor) && !src.includes(MARKER)) {
    src = src.replace(anchor, `${anchor}\n${STUB_BLOCK.trimEnd()}`);
  } else if (!src.includes(MARKER)) {
    // fallback: after "use strict" block
    src = src.replace(
      /Object\.defineProperty\(exports, "__esModule", \{\s*value: true\s*\}\);/,
      (m) => `${m}\n${STUB_BLOCK.trimEnd()}`
    );
  }

  // 5) Drop duplicate _filelogger declarations if any
  const first = src.indexOf(MARKER);
  if (first >= 0) {
    const after = src.indexOf("\n", src.indexOf("};", first)) + 1;
    const head = src.slice(0, after);
    let tail = src.slice(after);
    tail = tail.replace(
      /(?:const|let|var)\s+_filelogger\s*=\s*[\s\S]*?;\s*\n/g,
      (match) => (match.includes("getFileLogger") ? match : "")
    );
    // remove second marker blocks
    tail = tail.replace(
      /\/\* patched-file-logger-vercel-v2-stub \*\/[\s\S]*?^\};\s*\n/m,
      ""
    );
    src = head + tail;
  }

  writeFileSync(target, src, "utf8");
  const verify = readFileSync(target, "utf8");
  if (!isGood(verify)) {
    console.error("[patch-next-file-logger] VERIFY FAILED");
    console.error(verify.slice(0, 500));
    return false;
  }
  console.log(`[patch-next-file-logger] v2-stub applied → ${target}`);
  return true;
}

const ok = patch();
if (STRICT && !ok) {
  console.error("[patch-next-file-logger] --strict: build aborted");
  process.exit(1);
}
process.exit(ok ? 0 : STRICT ? 1 : 0);
