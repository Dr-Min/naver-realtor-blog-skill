#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || process.cwd());
const skipDirs = new Set([".git", "node_modules", "coverage"]);
const textExtensions = new Set([
  ".md", ".mdx", ".txt", ".json", ".jsonl", ".yaml", ".yml",
  ".js", ".mjs", ".cjs", ".ts", ".svg", ".html", ".css", ".gitignore"
]);
const findings = [];
const privateMarkers = [
  "에듀" + "읠 샌드박스",
  "신촌-가상매물-" + "전체테스트-03"
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (entry.isDirectory() && skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function report(file, line, code, message) {
  findings.push({
    file: path.relative(root, file),
    line,
    code,
    message
  });
}

for (const file of walk(root)) {
  const rel = path.relative(root, file);
  const ext = path.extname(file).toLowerCase();
  if (/^examples[/\\].+\.(jpe?g|png|webp|heic|gif)$/i.test(rel)) {
    report(file, 1, "example-binary-media", "Use fictional SVG placeholders, not photo-like binary media.");
  }
  if (!textExtensions.has(ext) && !["LICENSE", ".gitignore"].includes(path.basename(file))) continue;
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/\/Users\/[A-Za-z0-9._-]+\//.test(line)) {
      report(file, index + 1, "absolute-user-path", "Replace a user-specific macOS path with a placeholder.");
    }
    if (/\/home\/[A-Za-z0-9._-]+\//.test(line)) {
      report(file, index + 1, "absolute-user-path", "Replace a user-specific Linux path with a placeholder.");
    }
    if (/gh[pousr]_[A-Za-z0-9]{20,}/.test(line)) {
      report(file, index + 1, "github-token", "Possible GitHub token.");
    }
    if (/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(line)) {
      report(file, index + 1, "private-key", "Private key material.");
    }
    if (/^\s*(password|passwd|cookie|session_token|otp|비밀번호|인증번호)\s*[:=]\s*[^\s#]+/i.test(line) &&
        !/[:=]\s*(false|null|redacted|not_stored|omitted|""|'')\s*$/i.test(line)) {
      report(file, index + 1, "credential-assignment", "Possible credential value.");
    }
    if (privateMarkers.some((marker) => line.includes(marker))) {
      report(file, index + 1, "private-run-reference", "Private workspace or run reference.");
    }
  }
}

const result = {
  ok: findings.length === 0,
  root,
  files_scanned: walk(root).length,
  findings
};
process.stdout.write(JSON.stringify(result, null, 2) + "\n");
if (!result.ok) process.exitCode = 1;
