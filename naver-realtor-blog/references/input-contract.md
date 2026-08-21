# Input contract

## Conversation

Speak to non-technical users in Korean. Ask only missing material facts, one small group at a time, and show a concrete answer example.

Example:

> 이번 글에 올릴 매물의 지역, 거래 방식, 가격, 입주 가능일을 알려주세요.
> 예: “신촌역 도보 8분, 단기 월세, 보증금 300/월세 95/관리비 10, 9월 1일 입주 가능”

Never expose YAML as a task for the user. After each answer, write or update the internal normalized files.

## Persistent business profile

The profile lives in `profile.yaml` outside the run directory, not in
`ai/normalized/`. See [profile-and-style.md](profile-and-style.md) for its
location, precedence, and the fields the user may change. Load it before the
first question, and never re-ask for a field it already answers.

Store and reuse:

- office display name and realtor display name;
- public contact and public office address;
- business hours and service areas;
- specialties and tone;
- preferred CTA and consultation fields;
- prohibited claims or details;
- target Naver blog fingerprint and default category;
- browser policy: Codex in-app Browser, existing session reuse, draft-only.

Do not store login ID, password, OTP, cookie text, session token, or recovery answers.

## Per-post facts

Collect when applicable:

- actual, fictional demonstration, or informational content mode;
- property region and public location granularity;
- property and transaction type;
- current availability and last-confirmed timestamp;
- deposit, rent, management fee, inclusions, exclusions, and other costs;
- area, floor, total floors, direction, move-in date, options;
- parking, elevator, pets, security, light, noise, slope, and constraints;
- direct observations and their observation time;
- photos, photographer/rightsholder, allowed use, capture date, required redactions;
- desired post angle, claims to emphasize or avoid, length, CTA, and save override.

Unknown facts stay unknown. Never fill them from conventions or photos.

## Input classification

For every value record:

- source: human statement, file metadata, visual observation, official source, calculation, or AI inference;
- freshness or observation time;
- public/private boundary;
- allowed use;
- confidence;
- downstream fields that consume it.

Show the user three short groups before research:

1. usable now;
2. missing or ambiguous;
3. excluded for rights, privacy, freshness, or provenance.

## Audience inference

Do not ask “who is the target reader?” as a required realtor field. Infer a primary and optional secondary audience after normalization.

For each audience hypothesis record:

- the supporting listing or photo evidence;
- strength;
- counterarguments;
- alternative audiences;
- prohibited overclaims;
- confidence.

Demographics such as student, exchange student, intern, or young worker are low-confidence unless the input or reliable data supports them. Use non-exclusive phrases such as “이런 분이 비교해볼 만합니다.”
