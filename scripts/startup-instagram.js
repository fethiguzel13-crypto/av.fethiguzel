/**
 * Deprecated entry: redirects to unified social draft pipeline.
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const child = spawn(process.execPath, [join(__dir, 'startup-social.js')], {
  cwd: join(__dir, '..'),
  env: process.env,
  stdio: 'inherit',
});
child.on('exit', (code) => process.exit(code || 0));
