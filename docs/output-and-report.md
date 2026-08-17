# Output and Report

## Human/AI separation

The operator should not need to understand machine schemas. Human files answer:

- what was supplied;
- what the AI inferred;
- what was written;
- why the keyword was chosen;
- whether QA passed;
- whether Naver draft save succeeded;
- what still needs attention.

AI files preserve raw evidence, schemas, hashes, lineage, and browser payloads.
The production folder also preserves the machine-checkable readability receipt
used to verify paragraph length, heading separation, condition bullets, image
rhythm, emphasis, and declared exceptions.

## Human files

### 00-시작.md

Run identity, current status, next action, and a plain-language file guide.

### 01-입력내용.md

Separates:

- realtor-provided facts;
- photo observations;
- AI audience inference;
- missing values;
- excluded values and reason.

### 02-블로그원고.md

The readable exact draft with title, sections, photo anchors, captions, tags, disclosure, constraints, and CTA.

### 03-실행보고서.html

One self-contained report. There is no second blog-preview HTML.

### 04-임시저장결과.md

Success, blocked, or failed status; timestamp; verified structure; publication false; safe recovery instructions.

## Report information architecture

1. executive result;
2. draft-save status;
3. selected keyword and evidence mode;
4. warnings and blockers;
5. input and exclusions;
6. inferred audience with evidence and counterarguments;
7. timeline;
8. 3A/3B/3C methods and evidence;
9. candidate comparison;
10. reasons and reasons-for-reasons;
11. content and photo plan;
12. QA and remediation;
13. browser receipt;
14. models and agent routing;
15. cache lineage;
16. integrity and limitations.

## Evidence rendering

- preserve image aspect ratio;
- show DataLab filters, graph, and legend at readable sizes;
- render long Blog-search screenshots uncropped or in a clearly labeled scroll container;
- link raw evidence files;
- show SHA-256;
- distinguish included evidence from excluded captures;
- display capture time, source URL, viewport, and method.

## Report honesty

If a verifier times out or an enhanced reader cannot load an embedded image, report the failure. A fallback may be used only when its method, structural comparison, and visual check are recorded. Never convert “no receipt” into “passed”.

## Internal reasoning boundary

The report provides concise decision rationale, supporting evidence, counterarguments, and reproducible calculations. It does not expose private chain-of-thought. This is compatible with rigorous auditing because every externally relevant decision still has a source and a testable reason.

## Integrity

The integrity file maps key artifacts to hashes:

```yaml
artifacts:
  human/02-블로그원고.md: "<sha256>"
  ai/production/naver-payload.yaml: "<sha256>"
  ai/qa/qa-summary.yaml: "<sha256>"
  ai/production/save-result.yaml: "<sha256>"
  human/03-실행보고서.html: "<sha256>"
```

Any post-lock mutation invalidates the affected receipts.
