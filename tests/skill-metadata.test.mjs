import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const skillRoot = path.join(root, "naver-realtor-blog");

test("SKILL.md has only name and description frontmatter", () => {
  const text = fs.readFileSync(path.join(skillRoot, "SKILL.md"), "utf8");
  assert.ok(text.startsWith("---\n"));
  const frontmatter = text.split("---\n", 3)[1];
  const keys = frontmatter
    .split(/\r?\n/)
    .filter((line) => line.includes(":"))
    .map((line) => line.split(":", 1)[0]);
  assert.deepEqual(keys, ["name", "description"]);
  assert.match(frontmatter, /^name: naver-realtor-blog$/m);
  const descriptionLine = frontmatter.match(/^description:\s*(.+)$/m)?.[1];
  assert.ok(descriptionLine);
  const description = JSON.parse(descriptionLine);
  assert.ok(description.length <= 1024);
});

test("UI metadata matches the skill", () => {
  const text = fs.readFileSync(path.join(skillRoot, "agents/openai.yaml"), "utf8");
  const short = text.match(/short_description:\s*"([^"]+)"/)?.[1];
  const prompt = text.match(/default_prompt:\s*"([^"]+)"/)?.[1];
  assert.ok(short && [...short].length >= 25 && [...short].length <= 64);
  assert.ok(prompt?.includes("$naver-realtor-blog"));
});

test("required bundle files exist", () => {
  const required = [
    "references/input-contract.md",
    "references/output-contract.md",
    "references/research-keywords.md",
    "references/content-and-qa.md",
    "references/browser-and-report.md",
    "references/model-routing.md",
    "scripts/init-run.mjs",
    "scripts/validate-run.mjs"
  ];
  for (const rel of required) {
    assert.ok(fs.existsSync(path.join(skillRoot, rel)), rel);
  }
});

test("mobile readability contract is represented in the executable example", () => {
  const contract = fs.readFileSync(
    path.join(skillRoot, "references/content-and-qa.md"), "utf8");
  const payload = fs.readFileSync(
    path.join(root, "examples/fictional-sincheon/naver-payload.yaml"), "utf8");
  assert.match(contract, /naver_mobile_v1/);
  assert.match(contract, /140 characters/);
  assert.match(payload, /readability_profile:\s*naver_mobile_v1/);
  assert.match(payload, /style:\s*bullet/);
  assert.match(payload, /type:\s*spacer/);
  assert.match(payload, /forbid_heading_body_concatenation:\s*true/);
});

test("efficient is default while all ten roles and ultra precision are preserved", () => {
  const routing = fs.readFileSync(
    path.join(skillRoot, "references/model-routing.md"), "utf8");
  const example = fs.readFileSync(
    path.join(root, "examples/fictional-sincheon/execution-mode.yaml"), "utf8");
  assert.match(routing, /Efficient mode — default/);
  assert.match(routing, /Ultra-precision mode — preserved former default/);
  assert.match(routing, /fork_turns: "none"/);
  assert.match(routing, /Preserve all ten logical roles/);
  assert.match(example, /^mode: "efficient"$/m);
  assert.match(example, /logical_roles: 10/);
  assert.match(example, /roles_merged: false/);
});

test("relative Markdown links resolve", () => {
  const markdown = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.mdx?$/i.test(entry.name)) markdown.push(full);
    }
  }
  walk(root);
  for (const file of markdown) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1].split("#", 1)[0];
      if (!target || /^(https?:|mailto:|#)/.test(target)) continue;
      const resolved = path.resolve(path.dirname(file), decodeURIComponent(target));
      assert.ok(fs.existsSync(resolved), `${path.relative(root, file)} -> ${target}`);
    }
  }
});
