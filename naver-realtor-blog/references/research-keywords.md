# Research and keyword contract

## Candidate generation

Generate 5–10 candidates across:

- region + property type;
- region + transaction type;
- region + notable verified condition;
- nearby landmark or life-area term;
- a problem or constraint the listing actually answers.

This stage produces hypotheses, not volume claims.

## 3A — Naver DataLab

Record:

- exact candidate groups and labels;
- start/end date;
- device, gender, and age filters;
- direct URL or reproducible navigation conditions;
- downloadable XLSX when available;
- screenshots that separately make filters, graph, and legend readable;
- SHA-256 for every included and excluded capture.

Interpret values only as relative ratios within that query configuration. Never call them monthly search counts. Recompute chart values from the raw workbook and compare them with reported values.

Exclude cropped, partial, mismatched, or unreadable screenshots from the report. Preserve them with an exclusion reason when useful for audit.

## 3B — autocomplete

Record query text, collection time, surface, login state, personalization indication, raw response when lawfully available, screenshot, URL, and hashes.

Use autocomplete to discover language and long-tail candidates. Do not infer search volume, population preference, or rank probability from its order.

## 3C — Naver Blog search

Use the Blog tab and record sort mode, query, collection time, URL, viewport, screenshot, raw result metadata, and sampled post reads. Prefer related/relevance sort unless the research question requires another mode.

Use current results to inspect recurring intent, content structure, and unanswered questions. Do not treat rank as proof of quality, traffic, conversion, or a formula to copy.

If naver-blog-research is available, use it only as a companion to read sampled posts and download authorized public images; it does not replace browser evidence.

## Optional absolute-volume source

If a legitimate Naver Search Ads keyword source or another explicit volume source is connected, preserve request parameters, raw response, date, units, and hashes. Otherwise mark absolute volume as UNKNOWN.

Never backfill a number from DataLab, autocomplete, result counts, or memory.

## Decision record

For every candidate record:

- observed evidence;
- source path and hash;
- relevance to the listing;
- likely search intent;
- content answerability;
- risks and counterarguments;
- selected or rejected;
- reason;
- what would overturn the decision.

Label entries FACT, CALC, JUDGMENT, HYPOTHESIS, UNKNOWN, or HUMAN.

A keyword may be selected in limited-evidence mode only when multiple public surfaces support its wording and intent. The report must state that absolute volume is unavailable.

## Cache

Reuse only when all scope fields match: collection date, region, property type, transaction type, candidate set, device, demographic filters, query surface, and sort. Record reused run ID, original source time, paths, and hashes.
