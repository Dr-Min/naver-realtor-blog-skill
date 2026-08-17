# Troubleshooting

## The skill does not trigger

- Confirm the folder name is `naver-realtor-blog`.
- Confirm SKILL.md has only `name` and `description` frontmatter keys.
- Restart or refresh the editor's skill discovery.
- Invoke explicitly with `$naver-realtor-blog`.

## The user is asked to edit YAML

This violates the input contract. Ask the same missing fact in natural Korean with an example, then update YAML internally.

## Research produced “monthly search volume” from DataLab

Mark the claim invalid. Replace it with relative-ratio language and set absolute volume to UNKNOWN unless a legitimate volume source was captured.

## DataLab screenshot is cropped

Do not stretch it. Recapture filters, graph, and legend separately. Preserve the bad capture with an exclusion reason if it is needed for audit.

## Autocomplete differs between runs

Record session, login, personalization, query, time, and surface. Treat suggestions as time/session-bound expression evidence.

## Blog-search evidence is too long

Keep the original ratio and render it in a labeled scroll container or link the original file. Do not compress it until text is unreadable.

## Headings and paragraphs merge in Naver

Stop before save. Split editor blocks, reapply heading styles, and verify each heading is separate. If verification fails, record BLOCKED and do not save.

## Image captions are missing

Naver may show caption controls only after image selection. Select each image, enter the caption, and verify it visibly before saving.

## Login is requested every time

Use the same Codex in-app Browser profile. Do not solve this by storing cookies or credentials. Repeated login can still occur when Naver expires or challenges the session.

## Wrong blog is open

Do not enter content. Record a target mismatch and ask the user to select the correct account or blog in the browser.

## Draft counter did not change

Check for an editor confirmation and draft list. If neither confirms the save, record the result as unverified rather than successful.

## Report reader times out on embedded images

Record the failed reader receipt. Use a builder-generated semantic fallback only when structure and visual output are independently checked. Do not relabel the failed reader as passed.

## Validator reports credential material

Remove the sensitive value from the run and rotate it if it was real. Keep only boolean statements such as `credentials_stored: false`.

## Browser automation is unavailable

Complete intake, research, planning, draft, QA, payload, and report. Mark browser delivery BLOCKED with a clear manual draft-entry handoff.
