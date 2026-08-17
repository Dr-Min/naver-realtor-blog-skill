# Content and QA contract

## Default content mode

Default to a listing-showcase post for a realtor-supplied listing. Do not turn it into a generic “how to calculate management fees” article unless the user explicitly requests informational content.

## Drafting

Build:

1. accurate title;
2. disclosure when fictional or simulated;
3. short fit-oriented introduction;
4. verified core conditions in text;
5. image blocks at meaningful anchors with truthful captions;
6. advantages and constraints;
7. inferred-audience section using non-exclusive wording;
8. contract or visit checks;
9. consultation CTA using only public operator details;
10. natural tags.

Keep critical conditions in text, not only images. Use keywords naturally in the title and relevant passages; do not optimize by repetition count.

## Photo rules

Copy only authorized photos into the run and remove geolocation metadata when feasible. Preserve the original hash and sanitized-copy hash.

For each photo record:

- source path, rights statement, capture date if known;
- visible observations;
- privacy/redaction check;
- planned anchor and caption;
- claims the photo cannot support.

A bed count is a visual observation. It does not prove occupancy allowance, room area, lease terms, or property identity.

## Deterministic Naver payload

Compile one ordered payload after the readable draft is approved. The payload is the only browser-writing source and includes:

- exact title;
- ordered body blocks with type and style;
- image path, hash, anchor, and visible caption;
- exact tags;
- top disclosure requirement;
- required verification checks;
- public_publish: false;
- action_after_qa: save_draft_only;
- forbidden action: publish.

Do not re-parse headings, Markdown images, or tags from the human draft in the browser step.

## Independent QA

Run three independent gates:

### Audience QA

Check that audience is inferred rather than supplied as a required input, every inference has evidence, demographic overclaims are absent, counterarguments are present, and photo evidence is not stretched.

### Evidence QA

Recompute DataLab values, verify raw/source/capture hashes, inspect included/excluded evidence, check URLs/times/settings, identify orphan evidence, and ensure 3A/3B/3C limitations are explicit.

### Content QA

Check listing facts against normalized input, price arithmetic, disclosure, title/body agreement, photo order/captions, privacy, promotional transparency, keyword naturalness, CTA safety, and deterministic payload agreement.

Each gate emits PASS, FAIL, or BLOCKED with findings and artifact hashes. Remediate failures and re-run the affected gate. Never hide a remaining limitation to obtain PASS.

## Lock

After all required gates pass, hash the readable draft, deterministic payload, QA summary, photos, and evidence index. Any later change invalidates the lock and requires the affected QA gates again.
