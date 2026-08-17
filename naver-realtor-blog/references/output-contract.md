# Output contract

## Run root

Use:

<workspace>/outputs/YYYY-MM-DD/<slug>/

One post equals one run folder. Never mix two posts in the same folder.

## Human-facing files

Create only material a non-technical operator should open:

- human/00-시작.md — status, next action, and plain-language file guide.
- human/01-입력내용.md — what the realtor supplied, what AI inferred, missing fields.
- human/02-블로그원고.md — exact readable draft with photo anchors and captions.
- human/03-실행보고서.html — one self-contained decision/evidence report.
- human/04-임시저장결과.md — saved/blocked status, time, and safe recovery.
- human/photos/ — sanitized authorized copies used by the post.
- human/evidence/ — only evidence images/files cited by the report plus an index explaining included and excluded captures.

Do not create a separate blog-preview HTML.

## AI working files

Use:

- ai/normalized/ — business profile, listing, request, photo observations, inferred audience.
- ai/research/3a-datalab/
- ai/research/3b-autocomplete/
- ai/research/3c-blog-search/
- ai/planning/ — keyword research and content plan.
- ai/production/ — readability receipt, deterministic Naver payload, and save result.
- ai/qa/ — audience, evidence, content, and aggregate QA.
- ai/report/ — report source artifact, builder notes, verification receipt.
- ai/system/ — run manifest, lineage, execution agents, events, integrity.

## Lineage

Every derived artifact records:

- run ID and schema version;
- producer role and model when delegated;
- input paths and SHA-256 values;
- timestamp and status;
- decisions and limitations;
- output paths and SHA-256 values.

Append step events to ai/system/events.jsonl. Do not overwrite earlier events.

## Human/AI boundary

Human files may summarize machine data but must not expose raw account identifiers, credentials, cookies, personal session data, or internal chain-of-thought. Provide concise decision reasons, evidence, counterarguments, and receipts instead.
