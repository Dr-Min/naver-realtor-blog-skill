---
name: naver-realtor-blog
description: "Use when a Korean realtor or real-estate office asks Codex to plan and produce a Naver Blog post from natural-language listing facts and photos, research Naver keywords, explain every decision with captured evidence, generate a human-readable audit report, or save the finished post as a Naver draft. Trigger on requests such as “공인중개사 블로그 글 만들어”, “매물 사진으로 네이버 글 써줘”, “키워드 조사부터 임시저장까지”, “네이버 블로그 마케팅 한 사이클 돌려줘”, and continuation or revision of an existing run. Do not use merely to search or read existing Naver posts; use naver-blog-research for that narrower task."
---

# Naver realtor blog workflow

Run one auditable cycle from realtor input to Naver draft save. Treat the realtor's facts and photos as the source material; never invent listing facts, visits, demand, or search volume.

## Load the contracts

Read these bundle files before the matching stage:

- references/input-contract.md before interviewing or normalizing input.
- references/output-contract.md before creating a run directory.
- references/research-keywords.md before collecting 3A/3B/3C evidence or choosing keywords.
- references/content-and-qa.md before drafting, inferring audience, mapping photos, or running QA.
- references/browser-and-report.md before browser login checks, Naver draft saving, or report generation.
- references/model-routing.md before delegating parallel roles.

## Non-negotiable boundaries

- Ask the user in natural Korean with examples. Do not ask them to edit YAML; convert their answers into internal YAML yourself.
- Reuse the saved business profile. Ask only for missing or changed post facts.
- Audience is an AI inference, not a required realtor input. Store evidence, counterarguments, limitations, and confidence.
- Keep human-facing and AI-working files in separate folders under one date/slug run directory.
- Create no blog-preview HTML. Save the readable draft as Markdown and create exactly one audit-report HTML.
- Use only user-authorized photos. A visible object supports only a visual observation, not a lease term, area, occupancy limit, or property identity.
- Never request, store, export, or log Naver credentials, OTPs, cookies, or raw session tokens.
- Reuse the authenticated Codex in-app Browser session. Ask the user to log in there only when the session is absent, expired, or challenged.
- After QA passes, save to Naver draft automatically unless the user explicitly says not to. Never publish or open publication settings.
- Record every input, transformation, source, decision, countercheck, model role, artifact path, SHA-256, and result.
- Do not claim absolute search volume unless a source that actually reports it was collected. Naver DataLab ratios are relative values only.
- If a required fact, source, photo right, target blog identity, or QA gate is unresolved, stop only the affected downstream action and still produce an honest report.

## Run the cycle

1. Create the date/slug folder with scripts/init-run.mjs.
2. Interview in plain language. Show examples and collect the minimum missing facts.
3. Write normalized business, listing, request, photo-observation, and run-manifest files.
4. Infer the likely audience from listing facts and visible photo evidence. Include alternatives and counterarguments.
5. Generate a bounded keyword candidate set without assigning volumes.
6. Collect evidence:
   - 3A: Naver DataLab comparison conditions, graph, legend, downloadable raw data, URLs, and hashes.
   - 3B: Naver autocomplete candidates plus login/personalization/session limitations.
   - 3C: Naver Blog-tab related-sort results, sampled result metadata, readable capture, URLs, and hashes.
7. Have an independent keyword-decider compare the evidence and record selected/rejected candidates, reasons, reasons-for-reasons, and uncertainty.
8. Produce a listing-showcase content plan unless the user explicitly requests an informational article.
9. Draft the human-readable post, then compile one deterministic Naver payload containing the exact ordered title, text, heading, image, caption, and tag blocks.
10. Run independent audience, evidence, and content QA. Remediate findings and re-run affected gates.
11. Lock the approved payload and hashes.
12. Use one sequential browser owner to verify the target blog, enter the exact payload, upload photos at their anchors, verify captions, and click only “임시저장”.
13. Record before/after draft evidence without storing account identifiers or credentials.
14. Build one self-contained human HTML report from the locked run files. Preserve limitations and failed verification receipts.
15. Run scripts/validate-run.mjs --phase complete, update integrity records, and hand off the human folder.

## Concurrency rules

Parallelize independent collection and QA work when agent delegation is available. Each browser-writing surface must have one owner. If independent browser sessions are unavailable, run data collection analysis in parallel but serialize UI capture. The Naver editor is always sequential.

## Cache rules

Treat evidence as reusable only when date, region, property type, transaction type, candidate set, device, demographic filters, search surface, and query settings match. Otherwise collect fresh evidence. Record the prior run ID and hashes when reusing cache.

## Completion contract

A run is complete only when:

- human input and inferred audience are clearly separated;
- 3A/3B/3C evidence and limitations are recorded;
- keyword selection is traceable to evidence;
- draft, ordered Naver payload, QA, save result, report, and integrity records agree;
- the Naver draft is confirmed saved or a precise browser blocker is recorded;
- public publication remains false.

Return the human run folder, Naver draft-save status, selected keyword, QA status, and any unresolved limitations.
