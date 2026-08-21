import assert from "node:assert/strict";
import {execFileSync, spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const skillRoot = path.join(root, "naver-realtor-blog");
const profileScript = path.join(skillRoot, "scripts/init-profile.mjs");
const contract = fs.readFileSync(
  path.join(skillRoot, "references/profile-and-style.md"), "utf8");

test("init-profile creates an editable profile and refuses silent overwrite", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "naver-profile-"));
  try {
    const created = JSON.parse(execFileSync(process.execPath, [
      profileScript, "--root", temp
    ], {encoding: "utf8"}));

    assert.equal(created.ok, true);
    assert.equal(created.replaced, false);
    assert.equal(created.preset, "담백형");
    assert.ok(fs.existsSync(created.profile_path));
    assert.ok(fs.existsSync(path.join(created.styles_dir, "README.md")));

    const profile = fs.readFileSync(created.profile_path, "utf8");
    assert.match(profile, /^schema_version: "1\.0"$/m);
    assert.match(profile, /^\s{2}source: "preset"$/m);
    assert.match(profile, /^\s{2}public_publish: false/m);
    assert.match(profile, /^\s{2}refresh: "manual"/m);
    assert.match(profile, /sample_count: 5/);
    assert.match(profile, /이 파일 하나만 고치면 됩니다/);

    const duplicate = spawnSync(process.execPath, [
      profileScript, "--root", temp
    ], {encoding: "utf8"});
    assert.notEqual(duplicate.status, 0);
    assert.match(duplicate.stderr, /already exists/);

    const forced = JSON.parse(execFileSync(process.execPath, [
      profileScript, "--root", temp, "--force", "--preset", "친근형"
    ], {encoding: "utf8"}));
    assert.equal(forced.replaced, true);
    assert.match(fs.readFileSync(forced.profile_path, "utf8"), /preset: "친근형"/);
  } finally {
    fs.rmSync(temp, {recursive: true, force: true});
  }
});

test("init-profile rejects unknown scope and preset", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "naver-profile-"));
  try {
    for (const args of [["--scope", "global"], ["--preset", "화려형"]]) {
      const failed = spawnSync(process.execPath, [
        profileScript, "--root", temp, ...args
      ], {encoding: "utf8"});
      assert.notEqual(failed.status, 0);
    }
  } finally {
    fs.rmSync(temp, {recursive: true, force: true});
  }
});

test("profile is the only customization surface and overrides never beat the floor", () => {
  assert.match(contract, /single official customization surface/);
  assert.match(contract, /Never instruct the\s+user to edit `SKILL\.md`/);
  assert.match(contract, /project file win field by field/);
  assert.match(contract, /A missing profile never blocks a run/);
  assert.match(contract, /readability floor → preset → card →/);
  assert.match(contract, /A card never suppresses a QA gate/);
  assert.match(contract, /`run\.public_publish` is fixed/);

  const skill = fs.readFileSync(path.join(skillRoot, "SKILL.md"), "utf8");
  assert.match(skill, /Load `profile\.yaml` first/);
  assert.match(skill, /only customization surface/);
  assert.match(skill, /A style card never weakens `naver_mobile_v1`/);
});

test("style learning stays owner-only, distilled, outside the run cycle, and manual", () => {
  assert.match(contract, /Only the blog registered in `learning\.own_blog_url`/);
  assert.match(contract, /Never learn voice from a competitor/);
  assert.match(contract, /outside the ten-role run cycle/);
  assert.match(contract, /Store the distilled card, never\s+the raw post bodies/);
  assert.match(contract, /Separate `adopt` from `reject` on every card/);
  assert.match(contract, /Refresh is manual only/);
  assert.match(contract, /naver_read\.py/);

  const skill = fs.readFileSync(path.join(skillRoot, "SKILL.md"), "utf8");
  assert.match(skill, /own registered blog/);
  assert.match(skill, /Never learn voice from another person's posts/);
});

test("content QA enforces profile prohibitions over any style card", () => {
  const qa = fs.readFileSync(
    path.join(skillRoot, "references/content-and-qa.md"), "utf8");
  assert.match(qa, /This profile is the floor/);
  assert.match(qa, /no phrase from `prohibited\.claims`/);
  assert.match(qa, /contract wins and the conflict is recorded/);

  const input = fs.readFileSync(
    path.join(skillRoot, "references/input-contract.md"), "utf8");
  assert.match(input, /outside the run directory, not in\s+`ai\/normalized\/`/);
});
