#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
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

const PRESETS = ["담백형", "친근형", "정보형"];

function profileYaml(preset) {
  return `schema_version: "1.0"

# 이 파일 하나만 고치면 됩니다.
# 스킬 문서(SKILL.md, references/*.md)는 직접 수정하지 마세요.
# 업데이트할 때 충돌합니다.

# ── 사무소 정보 ────────────────────────────────────────────
# 한 번 적어두면 글마다 다시 묻지 않습니다.
# 공개해도 되는 정보만 적으세요. 비워두면 글에 쓰지 않습니다.
office:
  display_name: null          # 예: "성수한강공인중개사사무소"
  realtor_display_name: null  # 예: "박성수"
  public_contact: null        # 공개 가능한 연락처만
  public_address: null
  business_hours: null

specialties:
  regions: []                 # 예: ["성수동", "뚝섬"]
  property_types: []          # 예: ["오피스텔", "원룸"]

# ── 글 스타일 ──────────────────────────────────────────────
# source: preset  = 아래 preset 중 하나를 씁니다 (기존 블로그 글이 없을 때)
# source: learned = 내 블로그에서 학습한 카드를 씁니다 (card 경로 필요)
style:
  source: "preset"
  preset: ${JSON.stringify(preset)}   # 담백형 | 친근형 | 정보형
  card: null                  # 예: "styles/my-voice.yaml"
  overrides:                  # 여기 적은 값이 항상 최우선입니다
    honorific: true           # 존댓말
    emoji: false              # 장식용 이모지 허용 여부
    greeting: null            # 고정 인사말이 있으면 적으세요
    cta_text: null            # 고정 상담 문구가 있으면 적으세요

# ── 쓰면 안 되는 표현 ──────────────────────────────────────
prohibited:
  claims: ["최저가", "무조건", "확정 수익", "100%"]
  details: []                 # 글에 절대 노출하면 안 되는 정보

# ── 실행 기본값 ────────────────────────────────────────────
run:
  execution_mode: "efficient" # efficient | ultra_precision
  research:                   # 필요 없는 조사는 false로 끄세요
    datalab: true
    autocomplete: true
    blog_search: true
  save_after_qa: true         # QA 통과 후 네이버 임시저장
  public_publish: false       # 고정값. true로 바꿔도 무시합니다

# ── 스타일 학습 ────────────────────────────────────────────
# 본인 소유 블로그만 학습합니다. 남의 블로그는 학습하지 않습니다.
learning:
  own_blog_url: null          # 예: "https://blog.naver.com/myid"
  sample_count: 5
  refresh: "manual"           # 수동 재학습만. 자동 갱신하지 않습니다.
`;
}

const STYLES_README = `# 스타일 카드 폴더

내 블로그 글에서 뽑아낸 문체 카드를 둡니다.

- 카드는 원문이 아니라 요약입니다. 매 글마다 원문을 다시 읽지 않으므로 토큰이 들지 않습니다.
- 카드를 만들려면 profile.yaml의 learning.own_blog_url을 채우고
  "내 블로그 문체 학습해줘"라고 요청하세요.
- 카드를 쓰려면 profile.yaml의 style.source를 learned로 바꾸고
  style.card에 이 폴더의 파일 이름을 적으세요.
- 갱신은 수동입니다. 다시 요청할 때까지 카드는 그대로 유지됩니다.
`;

const args = parseArgs(process.argv.slice(2));
const scope = String(args.scope || "home");
if (!["home", "project"].includes(scope)) {
  throw new Error("--scope must be home or project");
}

const preset = String(args.preset || PRESETS[0]);
if (!PRESETS.includes(preset)) {
  throw new Error("--preset must be one of " + PRESETS.join(", "));
}

const defaultRoot = scope === "home"
  ? path.join(os.homedir(), ".codex", "naver-realtor-blog")
  : path.join(process.cwd(), ".naver-realtor-blog");
const root = path.resolve(args.root ? String(args.root) : defaultRoot);
const profilePath = path.join(root, "profile.yaml");
const stylesDir = path.join(root, "styles");

const existed = fs.existsSync(profilePath);
if (existed && !args.force) {
  throw new Error("Profile already exists: " + profilePath + " (use --force to replace)");
}

fs.mkdirSync(stylesDir, {recursive: true});
fs.writeFileSync(profilePath, profileYaml(preset));
const stylesReadme = path.join(stylesDir, "README.md");
if (!fs.existsSync(stylesReadme)) fs.writeFileSync(stylesReadme, STYLES_README);

process.stdout.write(JSON.stringify({
  ok: true,
  scope,
  profile_path: profilePath,
  styles_dir: stylesDir,
  preset,
  replaced: Boolean(existed)
}, null, 2) + "\n");
