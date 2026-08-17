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

## Mobile-first readability profile

Use `naver_mobile_v1` by default. Write for a reader scanning a phone, not for a report reader.

### Page rhythm

1. Put a required fictional or sponsored disclosure first.
2. Follow with a two-line opening that answers “what is this listing and why should I keep reading?”
3. Place a scannable core-condition block before the first long explanation. Use one verified condition per bullet; do not compress price, management fee, area, floor, move-in date, and restrictions into one sentence.
4. Use three to five descriptive headings. A heading must be its own editor block and usually remain under 18 Korean characters.
5. Put one idea in each paragraph. Prefer one to three sentences and 35–90 Korean characters. Split at 140 characters unless a required legal disclosure or faithful quotation cannot be split.
6. Insert one visual gap between semantic groups. Never create repeated empty lines merely to make the post longer.
7. Place each image immediately after the text it supports. Avoid consecutive full-size images unless the content plan explicitly identifies a comparison set.
8. Keep captions to one factual line. A caption must explain what the reader can actually see or what the image represents.
9. End with a short pre-visit checklist and a compact CTA. Do not repeat the full condition block in the CTA.

### Visual restraint

- Use bold for at most one short phrase per section. Do not bold the target keyword every time it appears.
- Use no decorative emoji by default. Allow a small number only when the saved brand profile explicitly asks for them.
- Do not simulate headings with repeated punctuation, oversized symbol rows, or keyword strings.
- Do not center every paragraph or mix multiple font sizes and colors. One heading hierarchy and normal body text are the default.
- Do not paste Markdown markers such as `##`, `**`, or table pipes into the Naver editor.

### Required draft receipt

Before QA, emit a compact readability receipt beside the content plan:

- heading count;
- paragraph character counts and the longest paragraph;
- any paragraph over 140 characters with its exception reason;
- bullet count in the core-condition block;
- image anchors and whether any images are consecutive;
- emphasis count per section;
- title/body or heading/body concatenation risks;
- deviations from `naver_mobile_v1` and reasons.

Treat these as default constraints, not a reason to write mechanically. Vary sentence length naturally and preserve the realtor's voice. A justified exception is allowed only when recorded in the receipt.

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
- readability_profile: naver_mobile_v1;
- ordered body blocks with explicit notice, heading, paragraph, bullet, spacer, image, and CTA types/styles;
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

Also validate the readability receipt against the actual draft and payload. Fail when headings are fused to body text, critical conditions are buried in prose, a non-exempt paragraph exceeds 140 characters, Markdown markers leak into editor text, images are unintentionally clumped, or the payload cannot preserve visible section gaps. Do not reward empty-line padding, excessive bullets, or unnaturally short sentence fragments merely for satisfying counts.

Each gate emits PASS, FAIL, or BLOCKED with findings and artifact hashes. Remediate failures and re-run the affected gate. Never hide a remaining limitation to obtain PASS.

## Lock

After all required gates pass, hash the readable draft, deterministic payload, QA summary, photos, and evidence index. Any later change invalidates the lock and requires the affected QA gates again.
