#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (!value.startsWith("--")) continue;
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

function seoulDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function slugify(input) {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function yamlString(value) {
  return JSON.stringify(String(value));
}

const args = parseArgs(process.argv.slice(2));
const root = path.resolve(args.root || path.join(process.cwd(), "naver-blog-runs"));
const date = String(args.date || seoulDate());
const slug = slugify(String(args.slug || ""));
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  throw new Error("--date must be YYYY-MM-DD");
}
if (!slug) {
  throw new Error("--slug is required, for example --slug 신촌-원룸-월세");
}
if (fs.existsSync(path.join(root, ".ok"))) {
  throw new Error("Choose an output root outside an OpenKnowledge content root.");
}

const runDir = path.join(root, date, slug);
if (fs.existsSync(runDir) && fs.readdirSync(runDir).length > 0) {
  throw new Error("Run directory already exists and is not empty: " + runDir);
}

const dirs = [
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
for (const dir of dirs) fs.mkdirSync(path.join(runDir, dir), {recursive: true});

const runId = date + "-" + slug;
const manifest = [
  'schema_version: "1.0"',
  "run_id: " + yamlString(runId),
  "created_at: " + yamlString(new Date().toISOString()),
  'status: "initialized"',
  'channel: "naver_blog"',
  'save_policy:',
  '  automatic_draft_save_after_qa: true',
  '  public_publish: false',
  'privacy:',
  '  credentials_stored: false',
  '  raw_blog_id_stored: false',
  'folder_policy:',
  '  human: "사람이 읽고 확인할 자료"',
  '  ai: "정규화·조사·판단·QA·로그"',
  ""
].join("\n");

const start = [
  "# 네이버 블로그 작업 시작",
  "",
  "- 실행 ID: " + runId,
  "- 현재 상태: 입력 대기",
  "- 공개 발행: 하지 않음",
  "- QA 통과 뒤 네이버 임시저장: 기본 실행",
  "",
  "## 사용자가 준비할 것",
  "",
  "매물 사실, 공개 가능한 사무소 정보, 사용 권한이 있는 사진을 자연어로 알려주세요. AI가 내부 작업 파일로 정리합니다.",
  "",
  "## 사람이 나중에 확인할 파일",
  "",
  "- 01-입력내용.md",
  "- 02-블로그원고.md",
  "- 03-실행보고서.html",
  "- 04-임시저장결과.md",
  ""
].join("\n");

const evidenceIndex = [
  "# 증거 파일 안내",
  "",
  "이 폴더에는 실행 보고서가 실제로 인용하는 화면과 원본만 둡니다.",
  "제외한 캡처가 있으면 파일명, 해시, 제외 이유를 함께 기록합니다.",
  ""
].join("\n");

fs.writeFileSync(path.join(runDir, "ai/system/run-manifest.yaml"), manifest, {flag: "wx"});
fs.writeFileSync(path.join(runDir, "ai/system/events.jsonl"), JSON.stringify({
  schema_version: "1.0",
  run_id: runId,
  event: "run_initialized",
  at: new Date().toISOString(),
  actor: "orchestrator"
}) + "\n", {flag: "wx"});
fs.writeFileSync(path.join(runDir, "human/00-시작.md"), start, {flag: "wx"});
fs.writeFileSync(path.join(runDir, "human/evidence/README.md"), evidenceIndex, {flag: "wx"});

process.stdout.write(JSON.stringify({ok: true, run_id: runId, run_dir: runDir}, null, 2) + "\n");
