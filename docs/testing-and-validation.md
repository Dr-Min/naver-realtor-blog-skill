# Testing and Validation

## Validation layers

| Layer | Tool | Purpose |
| --- | --- | --- |
| Skill metadata | Skill Creator validator | frontmatter name and description |
| UI metadata | structure test | agents/openai.yaml consistency |
| Scaffolding | Node tests | expected directory and initial files |
| Run validation | validate-run.mjs | required artifacts and safety flags |
| Public repository | public-repo-audit.mjs | secrets, local paths, unsafe media |
| Workflow | fictional fixture | schema and decision-contract examples |
| Continuous integration | GitHub Actions | repeat all repository-safe checks |

## Script test cases

### init-run

- accepts a valid date and Korean slug;
- normalizes the slug;
- creates every human and AI directory;
- writes the manifest and event log;
- records draft-only policy;
- refuses to overwrite a non-empty run;
- rejects an OpenKnowledge content root.

### validate-run

- scaffold phase accepts initial files;
- pre-save phase requires input, draft, audience, keyword, payload, and QA;
- complete phase requires report, save result, and integrity;
- rejects public_publish true;
- requires a draft-save-only action;
- requires the `naver_mobile_v1` readability profile and structural verification flags;
- flags credential-like assigned values;
- emits hashes for required files.

## Public audit

The audit scans tracked source files for:

- user-specific absolute paths;
- token prefixes and private keys;
- credential assignment;
- real-photo binary extensions in examples;
- cookie or session exports;
- known private run names;
- accidental output directories.

False positives should be fixed by replacing examples with placeholders, not by weakening the rule without justification.

## Manual browser QA

Automated tests cannot guarantee Naver editor compatibility. A release that changes browser behavior should run a fictional draft-save scenario and verify:

1. already-authenticated flow;
2. logged-out handoff flow;
3. heading separation;
4. paragraph separation and single visual gaps;
5. scannable core-condition bullets;
6. no wall-of-text or heading/body concatenation;
7. three image anchors;
8. visible captions;
9. draft-only click;
10. privacy-safe save receipt;
11. no publication settings opened.

Do not run public publication as a test.

## Release evidence

A release note should state:

- tested Codex version;
- test date;
- Naver editor surface;
- fixture type;
- automated test result;
- manual draft-save result;
- known limitations.
