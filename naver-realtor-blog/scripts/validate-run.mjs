#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = {_: []};
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (!value.startsWith("--")) {
      out._.push(value);
      continue;
    }
    const key = value.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) out[key] = true;
    else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const args = parseArgs(process.argv.slice(2));
const runDir = path.resolve(args.run || args._[0] || "");
const phase = String(args.phase || "complete");
if (!runDir || !fs.existsSync(runDir)) throw new Error("Pass an existing --run directory.");
if (!["scaffold", "pre-save", "complete"].includes(phase)) {
  throw new Error("--phase must be scaffold, pre-save, or complete");
}

const requiredDirs = [
  "human/photos",
  "human/evidence",
  "ai/normalized",
  "ai/research/3a-datalab",
  "ai/research/3b-autocomplete",
  "ai/research/3c-blog-search",
  "ai/planning",
  "ai/production",
  "ai/qa",
  "ai/report",
  "ai/system"
];
const required = [
  "human/00-시작.md",
  "ai/system/run-manifest.yaml",
  "ai/system/events.jsonl"
];
if (phase !== "scaffold") {
  required.push(
    "human/01-입력내용.md",
    "human/02-블로그원고.md",
    "ai/normalized/inferred-audience.yaml",
    "ai/planning/keyword-research.yaml",
    "ai/production/naver-payload.yaml",
    "ai/qa/qa-summary.yaml"
  );
}
if (phase === "complete") {
  required.push(
    "human/03-실행보고서.html",
    "human/04-임시저장결과.md",
    "ai/production/save-result.yaml",
    "ai/system/integrity.yaml"
  );
}

const errors = [];
const warnings = [];
for (const dir of requiredDirs) {
  if (!fs.existsSync(path.join(runDir, dir))) errors.push("missing directory: " + dir);
}
for (const file of required) {
  if (!fs.existsSync(path.join(runDir, file))) errors.push("missing file: " + file);
}

for (const rel of ["ai/system/run-manifest.yaml", "ai/production/naver-payload.yaml", "ai/production/save-result.yaml"]) {
  const full = path.join(runDir, rel);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, "utf8");
  if (/public_publish\s*:\s*true/i.test(text)) errors.push("unsafe public_publish true: " + rel);
  if (/action_after_qa\s*:\s*["']?(publish|public)/i.test(text)) errors.push("unsafe publish action: " + rel);
}
const payloadPath = path.join(runDir, "ai/production/naver-payload.yaml");
if (phase !== "scaffold" && fs.existsSync(payloadPath)) {
  const payload = fs.readFileSync(payloadPath, "utf8");
  if (!/public_publish\s*:\s*false/i.test(payload)) errors.push("payload must declare public_publish: false");
  if (!/save_draft_only|draft[_ -]?save/i.test(payload)) errors.push("payload must declare draft-save-only action");
}

const secretKey = /^\s*(password|passwd|cookie|cookies|session_token|otp|비밀번호|인증번호)\s*:\s*(.+)$/i;
const safeValue = /^(false|null|redacted|not_stored|omitted|""|'')(\s*#.*)?$/i;
for (const file of walk(path.join(runDir, "ai"))) {
  if (!/\.(ya?ml|json|jsonl|md|txt)$/i.test(file)) continue;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(secretKey);
    if (match && !safeValue.test(match[2].trim())) {
      errors.push("possible credential material: " + path.relative(runDir, file) + ":" + (i + 1));
    }
  }
}

const hashes = {};
for (const rel of required) {
  const full = path.join(runDir, rel);
  if (fs.existsSync(full)) hashes[rel] = sha256(full);
}
const receipt = {
  ok: errors.length === 0,
  phase,
  run_dir: runDir,
  checked_at: new Date().toISOString(),
  errors,
  warnings,
  hashes
};
if (args["write-receipt"]) {
  const target = path.join(runDir, "ai/system/validation-receipt.json");
  fs.writeFileSync(target, JSON.stringify(receipt, null, 2) + "\n");
  receipt.receipt = target;
}
process.stdout.write(JSON.stringify(receipt, null, 2) + "\n");
if (!receipt.ok) process.exitCode = 1;
