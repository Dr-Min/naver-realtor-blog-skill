# Security Policy

## Sensitive data that must never be stored

- Naver login ID or password
- One-time verification codes
- Cookies, session tokens, browser storage exports
- Raw account or blog identifiers when a privacy-safe fingerprint is sufficient
- Private phone numbers, exact private addresses, resident registration numbers
- Unredacted faces, vehicle plates, documents, door codes, or access instructions

## Reporting a vulnerability

Do not attach real credentials, cookies, session dumps, private listing documents, or unredacted screenshots to a public issue.

Create a minimal fictional reproduction and use GitHub's private vulnerability reporting feature when available. Include the affected file and version, safe reproduction, expected and actual behavior, impact, and suggested mitigation.

## Browser boundary

The skill relies on a user-authenticated browser session. It must not extract or serialize the session. Login, security challenges, account switching, and consent screens remain human actions.

## Publication boundary

The supported automated terminal action is Naver draft save. Public publication, scheduling, visibility changes, and paid promotion are outside the automation boundary.
