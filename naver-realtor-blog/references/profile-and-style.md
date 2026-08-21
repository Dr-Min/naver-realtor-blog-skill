# Profile and style contract

The profile is the single official customization surface. Never instruct the
user to edit `SKILL.md` or any `references/*.md` file; those are replaced on
update. Everything a realtor may change lives in `profile.yaml`.

## Location and precedence

Read both, and let the project file win field by field:

1. `~/.codex/naver-realtor-blog/profile.yaml` — the operator's default.
2. `<workspace>/.naver-realtor-blog/profile.yaml` — optional per-project
   override, for an agency handling several offices.

Create either one with:

```bash
node <skill-directory>/scripts/init-profile.mjs --scope home
node <skill-directory>/scripts/init-profile.mjs --scope project
```

Style cards live beside the profile in `styles/`. The same paths are intended
to be shared with the fast skill, so never store run-specific data here.

If no profile exists, say so once in plain Korean, offer to create one, and
continue the run with defaults. A missing profile never blocks a run.

`run.public_publish` is fixed. Treat any other value as `false` and record the
attempted override.

## Reuse across runs

`profile.yaml` is the persistent business profile. At run start, load it and
copy the resolved values into `ai/normalized/business-profile.yaml` with
`source: profile` plus the profile path and SHA-256. Ask only for post facts
and for profile fields that are still empty. When the user supplies a durable
fact — office name, CTA wording, a claim they never want used — offer once to
write it back to the profile so later runs stop asking.

The run copy is a snapshot for lineage. The profile stays the source of truth.

## What the user may change

| Area | Field | Effect |
| --- | --- | --- |
| Office | `office.*`, `specialties.*` | CTA and body facts; empty fields are omitted, never invented |
| Voice | `style.source`, `style.preset`, `style.card` | Which voice the writer imitates |
| Voice | `style.overrides.*` | Highest priority; beats preset and card |
| Safety | `prohibited.claims`, `prohibited.details` | Content QA fails the draft when these appear |
| Cost | `run.execution_mode` | `efficient` or `ultra_precision` |
| Scope | `run.research.*` | Skip a collection surface entirely |
| Saving | `run.save_after_qa` | Draft-save automatically or stop after QA |

Turning off a research surface removes that evidence, not the honesty rule.
Record the skipped surface as an explicit limitation in the report and never
present a keyword decision as better-supported than the evidence allows.

## Tone presets

Presets set voice only. None of them may weaken `naver_mobile_v1`.

| Preset | Sentence shape | Emphasis | Typical use |
| --- | --- | --- | --- |
| 담백형 | Short declaratives, no filler, facts first | None beyond one phrase per section | Default; investors and comparison shoppers |
| 친근형 | Slightly longer, warm openers and closers, conversational connectives | One phrase per section; emoji only when `overrides.emoji` is true | First-time renters, students |
| 정보형 | Denser explanation, more sub-conditions spelled out, comparison framing | Bold on condition labels only | Office/commercial listings, high-price contracts |

## Style learning from the user's own posts

Only the blog registered in `learning.own_blog_url` may be used as a voice
source. Never learn voice from a competitor, a sample found in search, or a
post the user does not own. Market observation of other blogs stays in the 3C
blog-search evidence stage and never feeds the style card.

Learning happens in a setup step, outside the ten-role run cycle. Do not add a
style role to a run and do not read raw posts during a run.

### Procedure

1. Confirm ownership in one sentence and confirm the URL.
2. Collect `learning.sample_count` recent posts (default 5) with the installed
   `naver-blog-research` skill:

   ```bash
   python3 ~/.codex/skills/naver-blog-research/scripts/naver_search.py "<blog name or id>" --count 10 --sort date
   python3 ~/.codex/skills/naver-blog-research/scripts/naver_read.py "<post url>"
   ```

   Prefer listing posts over personal diary posts. If fewer than three usable
   posts exist, stop and recommend a preset instead of a low-confidence card.
3. Distill one card into `styles/<name>.yaml`. Store the distilled card, never
   the raw post bodies, so later runs cost no extra tokens.
4. Show the user the adopt/reject lists in plain Korean and let them remove any
   adopted trait they dislike.
5. Set `style.source: learned` and `style.card` only after they confirm.

### Card contents

```yaml
schema_version: "1.0"
created_at: "2026-08-21T20:00:00+09:00"
source:
  own_blog_url: "https://blog.naver.com/example"
  ownership_confirmed: true
  samples:
    - {url: "...", title: "...", posted_at: "...", chars: 1840, sha256: "..."}
  sample_count: 5
adopt:
  sentence_ending: "~습니다 체로 통일, 해요체 혼용 없음"
  greeting: "안녕하세요, 성수동 성수한강공인중개사입니다"
  heading_style: "명사형 짧은 소제목"
  cta: "편하게 연락 주세요"
  recurring_phrases: ["직접 확인한", "실제 사진"]
  rhythm: "문장 평균 45자, 문단 1~2문장"
reject:
  - {pattern: "문단 200자 이상", reason: "naver_mobile_v1 문단 길이 위반"}
  - {pattern: "'역세권 최저가'", reason: "근거 없는 최상급 주장"}
confidence: "medium"
limitations: "샘플 5개 중 4개가 원룸이라 상가 매물 톤은 미검증"
```

Separate `adopt` from `reject` on every card. A realtor's existing habits may
break the readability floor or make unverifiable claims; imitating those would
lower quality. Record why each rejected trait was dropped so the user can see
the reasoning and argue with it.

### Precedence and limits

Apply voice in this order, later winning: readability floor → preset → card →
`style.overrides`. A card may change wording, rhythm, greetings, headings
style, and CTA phrasing. A card may never:

- exceed the `naver_mobile_v1` paragraph, heading, spacing, or emphasis limits;
- introduce a claim listed in `prohibited.claims`;
- assert search volume, ranking, or demand;
- restate a listing fact the normalized input does not contain.

Content QA validates the draft against the readability floor and the profile
regardless of the card. A card never suppresses a QA gate.

### Refresh

Refresh is manual only. Do not re-learn automatically, on a schedule, or
because a run produced a different voice. When a card is older than six months,
mention it once and continue. Re-learning replaces the card; keep the previous
file when the user asks to compare.
