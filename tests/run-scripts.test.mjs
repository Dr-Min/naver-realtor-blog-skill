import assert from "node:assert/strict";
import {execFileSync, spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const initScript = path.join(root, "naver-realtor-blog/scripts/init-run.mjs");
const validateScript = path.join(root, "naver-realtor-blog/scripts/validate-run.mjs");

function write(runDir, rel, content = "fixture: true\n") {
  const file = path.join(runDir, rel);
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, content);
}

test("init-run creates a valid scaffold and refuses overwrite", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "naver-skill-"));
  try {
    const output = execFileSync(process.execPath, [
      initScript,
      "--root", temp,
      "--date", "2026-08-18",
      "--slug", "신촌 원룸 테스트"
    ], {encoding: "utf8"});
    const created = JSON.parse(output);
    assert.equal(created.ok, true);
    assert.equal(created.execution_mode, "efficient");
    assert.ok(created.run_dir.endsWith(path.join("2026-08-18", "신촌-원룸-테스트")));
    const execution = fs.readFileSync(
      path.join(created.run_dir, "ai/system/execution-mode.yaml"), "utf8");
    assert.match(execution, /^mode: "efficient"$/m);
    assert.match(execution, /logical_roles: 10/);
    assert.match(execution, /roles_merged: false/);
    assert.match(execution, /fork_turns: "none"/);

    const validated = JSON.parse(execFileSync(process.execPath, [
      validateScript,
      "--run", created.run_dir,
      "--phase", "scaffold"
    ], {encoding: "utf8"}));
    assert.equal(validated.ok, true);

    const duplicate = spawnSync(process.execPath, [
      initScript,
      "--root", temp,
      "--date", "2026-08-18",
      "--slug", "신촌 원룸 테스트"
    ], {encoding: "utf8"});
    assert.notEqual(duplicate.status, 0);
    assert.match(duplicate.stderr, /already exists/);
  } finally {
    fs.rmSync(temp, {recursive: true, force: true});
  }
});

test("init-run preserves former routing as explicit ultra_precision mode", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "naver-skill-"));
  try {
    const created = JSON.parse(execFileSync(process.execPath, [
      initScript,
      "--root", temp,
      "--date", "2026-08-18",
      "--slug", "초정밀 테스트",
      "--mode", "ultra_precision"
    ], {encoding: "utf8"}));
    assert.equal(created.execution_mode, "ultra_precision");
    const execution = fs.readFileSync(
      path.join(created.run_dir, "ai/system/execution-mode.yaml"), "utf8");
    assert.match(execution, /^mode: "ultra_precision"$/m);
    assert.match(execution, /roles_merged: false/);
  } finally {
    fs.rmSync(temp, {recursive: true, force: true});
  }
});

test("init-run rejects unknown execution modes", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "naver-skill-"));
  try {
    const invalid = spawnSync(process.execPath, [
      initScript,
      "--root", temp,
      "--date", "2026-08-18",
      "--slug", "잘못된 모드",
      "--mode", "premium"
    ], {encoding: "utf8"});
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stderr, /efficient or ultra_precision/);
  } finally {
    fs.rmSync(temp, {recursive: true, force: true});
  }
});

test("complete validation passes safe fixture and blocks publication", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "naver-skill-"));
  try {
    const created = JSON.parse(execFileSync(process.execPath, [
      initScript,
      "--root", temp,
      "--date", "2026-08-18",
      "--slug", "완료 검증"
    ], {encoding: "utf8"}));
    const runDir = created.run_dir;

    write(runDir, "human/01-입력내용.md", "# 입력\n");
    write(runDir, "human/02-블로그원고.md", "# 가상 원고\n");
    write(runDir, "human/03-실행보고서.html", "<!doctype html><title>fixture</title>");
    write(runDir, "human/04-임시저장결과.md", "# 임시저장 결과\n");
    write(runDir, "ai/normalized/inferred-audience.yaml");
    write(runDir, "ai/planning/keyword-research.yaml");
    write(runDir, "ai/production/readability-receipt.yaml",
      "profile: naver_mobile_v1\nheading_count: 4\n");
    write(runDir, "ai/qa/qa-summary.yaml", "status: PASS\n");
    write(runDir, "ai/production/naver-payload.yaml",
      "public_publish: false\naction_after_qa: save_draft_only\n" +
      "readability_profile: naver_mobile_v1\nverification:\n" +
      "  require_separate_heading_blocks: true\n" +
      "  require_scannable_core_conditions: true\n" +
      "  require_single_visual_gaps: true\n" +
      "  forbid_heading_body_concatenation: true\n" +
      "  max_paragraph_chars: 140\n");
    write(runDir, "ai/production/save-result.yaml",
      "status: saved\npublic_publish: false\ncredentials_stored: false\n");
    write(runDir, "ai/system/integrity.yaml");

    const pass = JSON.parse(execFileSync(process.execPath, [
      validateScript,
      "--run", runDir,
      "--phase", "complete"
    ], {encoding: "utf8"}));
    assert.equal(pass.ok, true);

    const executionPath = path.join(runDir, "ai/system/execution-mode.yaml");
    const validExecution = fs.readFileSync(executionPath, "utf8");
    fs.writeFileSync(executionPath,
      validExecution.replace('mode: "efficient"', 'mode: "ultra_precision"'));
    const modeMismatch = spawnSync(process.execPath, [
      validateScript,
      "--run", runDir,
      "--phase", "complete"
    ], {encoding: "utf8"});
    assert.notEqual(modeMismatch.status, 0);
    const modeResult = JSON.parse(modeMismatch.stdout);
    assert.ok(modeResult.errors.some((value) =>
      value.includes("does not match run manifest")));
    fs.writeFileSync(executionPath, validExecution);

    write(runDir, "ai/production/naver-payload.yaml",
      "public_publish: false\naction_after_qa: save_draft_only\n");
    const unreadable = spawnSync(process.execPath, [
      validateScript,
      "--run", runDir,
      "--phase", "complete"
    ], {encoding: "utf8"});
    assert.notEqual(unreadable.status, 0);
    const unreadableResult = JSON.parse(unreadable.stdout);
    assert.ok(unreadableResult.errors.some((value) =>
      value.includes("readability_profile: naver_mobile_v1")));

    write(runDir, "ai/production/naver-payload.yaml",
      "public_publish: true\naction_after_qa: publish\n");
    const blocked = spawnSync(process.execPath, [
      validateScript,
      "--run", runDir,
      "--phase", "complete"
    ], {encoding: "utf8"});
    assert.notEqual(blocked.status, 0);
    const result = JSON.parse(blocked.stdout);
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((value) => value.includes("public_publish true")));
  } finally {
    fs.rmSync(temp, {recursive: true, force: true});
  }
});
