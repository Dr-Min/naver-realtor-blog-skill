# Contributing

Contributions are welcome when they preserve evidence quality, privacy, and the draft-only safety boundary.

## Before opening a change

1. Use fictional data and placeholder media.
2. Do not commit Naver screenshots containing account or personalization data.
3. Do not add selectors that bypass login or security challenges.
4. Keep SKILL.md concise; move detailed contracts into one-level references.
5. Explain which failure mode the change addresses.
6. Add or update tests.

## Validation

```bash
npm test
npm run audit:public
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py ./naver-realtor-blog
```

## Pull request description

Include the user-visible behavior change, affected stages, privacy impact, test evidence, documentation changes, and migration notes. Claims about Naver search behavior must cite an official Naver source and state the verification date.
