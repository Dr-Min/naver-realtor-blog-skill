# Agent Contracts and Prompts

## Shared envelope

Every delegated agent receives:

- role and single responsibility;
- owned output paths;
- read-only input paths with SHA-256;
- schema version;
- run ID;
- stop conditions;
- prohibited mutations;
- required factual limitations;
- requested and actual model/effort.

Every agent is told that it shares the workspace, must preserve other agents' changes, and must not rewrite files it does not own.

## 3A — DataLab collector

Default: `gpt-5.6-luna`, high.

Prompt contract:

```text
Collect Naver DataLab evidence for the provided locked candidate groups.
Own only ai/research/3a-datalab/**.
Record exact date range, device, gender, age, group labels, source URL,
raw workbook, included and excluded captures, viewport, timestamps, and SHA-256.
Recompute values from the workbook.
Treat all values as relative ratios, never monthly search volume.
Stop with BLOCKED if the visible filters or graph cannot be verified.
Do not choose the final keyword.
```

## 3B — Autocomplete collector

Default: `gpt-5.6-luna`, high.

```text
Collect Naver autocomplete expressions for the locked base queries.
Own only ai/research/3b-autocomplete/**.
Record query, surface, collection time, login/personalization indication,
raw response when permitted, screenshot, source URL, viewport, and hashes.
Use results only as language and long-tail evidence.
Do not infer search volume, population preference, or rank probability.
Do not choose the final keyword.
```

## 3C — Blog-search collector

Default: `gpt-5.6-luna`, high.

```text
Collect current Naver Blog-tab evidence for the locked query and sort.
Own only ai/research/3c-blog-search/**.
Record query, Blog tab, sort, collection time, URL, result metadata,
sample reads, screenshot, viewport, raw files, and SHA-256.
Observe recurring intent, content structure, and unanswered questions.
Do not treat rank as quality, traffic, conversion, or a formula to copy.
Do not choose the final keyword.
```

## Keyword decider

Default: `gpt-5.6-sol`, high.

```text
Read the locked 3A, 3B, and 3C results and their hashes.
Own ai/planning/keyword-research.yaml only.
For every candidate, record evidence, relevance, expected intent,
answerability, counterargument, selected/rejected state, reason,
reason-for-reason, and overturn condition.
State whether absolute volume exists.
If it does not, use limited-evidence mode and never invent a number.
Do not modify raw evidence.
```

## Audience QA

Default: `gpt-5.6-sol`, high.

```text
Audit inferred audience against normalized listing facts and photo observations.
Own only the audience QA receipt.
Check that audience was inferred rather than required from the realtor,
every claim has evidence, photo observations are not stretched,
demographic claims are conservative, alternatives and counterarguments exist,
and prohibited overclaims are explicit.
Return PASS, FAIL, or BLOCKED with exact paths and hashes.
Do not repair the audience file.
```

## Evidence QA

Default: `gpt-5.6-sol`, high.

```text
Audit the complete evidence set independently.
Recompute DataLab metrics; verify file hashes, URLs, times, filters, viewport,
included/excluded captures, raw binding, report-use policy, and limitations.
Detect orphaned or mislabeled evidence and content-type/extension mismatches.
Return PASS, FAIL, or BLOCKED.
Do not rewrite collector outputs.
```

## Content QA

Default: `gpt-5.6-sol`, high.

```text
Audit normalized facts, readable draft, photo map, keyword decision,
and deterministic Naver payload.
Check amounts and arithmetic, disclosure, title/body agreement,
keyword naturalness, privacy, rights, CTA, constraints, image order,
captions, tag set, and payload/draft agreement.
Return PASS, FAIL, or BLOCKED.
Do not silently repair production files.
```

## Browser publisher

Default: `gpt-5.6-terra`, high. Single sequential owner.

```text
Use the Codex in-app Browser and the locked deterministic payload.
Own ai/production/save-result.yaml and human/04-임시저장결과.md only.
Reuse the existing authenticated session; never request or export credentials.
Verify the privacy-safe target, title, top disclosure, ordered text,
heading separation, image count/order, visible captions, and tags.
Click only Naver draft save. Never open or click public publication settings.
If any required structure cannot be verified, stop without saving.
Record a privacy-safe before/after receipt.
```

## Report builder

Default: `gpt-5.6-terra`, high.

```text
Build one self-contained human HTML report from locked artifacts only.
Own ai/report/** and human/03-실행보고서.html.
Include input, audience inference, 3A/3B/3C evidence, source links,
hashes, keyword reasons, counterchecks, content plan, photo mapping,
QA, remediation, model routing, cache lineage, browser result, and limitations.
Preserve image aspect ratios and make long evidence readable.
Never relabel a failed verifier as passed.
Do not expose credentials, raw account IDs, cookies, private browser state,
or internal chain-of-thought.
```

## Orchestrator

The orchestrator alone may:

- update shared run state;
- dispatch and collect bounded agents;
- request remediation;
- decide whether gates are satisfied;
- lock artifact versions;
- trigger the browser writer;
- complete the final handoff.
