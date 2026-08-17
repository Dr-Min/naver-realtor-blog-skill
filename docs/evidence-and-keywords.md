# Evidence and Keyword Decision

## Evidence classes

| Label | Meaning | Example |
| --- | --- | --- |
| FACT | directly observed in a source | autocomplete returned a phrase |
| CALC | derived with raw values and formula | recomputed DataLab average |
| JUDGMENT | criteria applied by AI | keyword matches listing intent |
| HYPOTHESIS | future performance assumption | phrase may attract qualified inquiries |
| UNKNOWN | no valid evidence | monthly search volume unavailable |
| HUMAN | explicit operator decision | realtor excludes a neighborhood name |

The label travels with the claim. A judgment never becomes a fact merely because it appears in a report.

## Evidence packet

Every captured surface has:

- source name and URL;
- query and filters;
- collection time and timezone;
- browser surface and viewport;
- raw response or downloadable file when available;
- screenshot;
- SHA-256;
- included/excluded decision;
- report use;
- limitation.

## DataLab

### Valid use

- compare relative movement among configured groups;
- inspect seasonality;
- inspect differences under an explicit device or demographic filter;
- use wording as one signal among several.

### Invalid use

- call a ratio “monthly searches”;
- compare values from different query configurations as if they share a denominator;
- omit filters or time range;
- use a cropped graph without readable legend;
- use visual values without checking the workbook.

### Capture policy

Store separate readable captures for:

1. query and filters;
2. graph;
3. legend.

Do not stretch a narrow capture to fill a report column. Preserve aspect ratio. Excluded captures remain in the AI audit area with filename, hash, and exclusion reason; they do not appear as affirmative report evidence.

## Autocomplete

Autocomplete is expression evidence. It can help answer:

- what phrasing is currently surfaced;
- which modifiers may form a long-tail candidate;
- whether a candidate has a recognizable query form.

It cannot answer:

- how many people searched;
- whether the first suggestion is most popular;
- whether all users see the same list;
- whether a phrase converts to inquiries.

Record authentication and personalization indicators because the list may depend on session context.

## Blog search

The sample should use the Naver Blog tab and record its sort mode. Read a bounded number of results to identify:

- repeated user questions;
- common content structures;
- missing practical details;
- overused generic claims;
- opportunities for verified local experience.

Do not copy sentences, headings, photos, or templates. Do not infer traffic or conversion from rank.

## Optional absolute-volume source

If the operator connects a legitimate source that explicitly reports search volume, preserve:

- provider;
- request parameters;
- response date;
- PC/mobile units;
- raw response;
- hash;
- access limitations.

Without such a source, write `absolute_volume: UNKNOWN`.

## Decision matrix

An implementation may use a comparison matrix, but scores are decision aids rather than measured truth.

| Criterion | Question |
| --- | --- |
| listing fit | Does the phrase accurately describe verified facts? |
| intent clarity | Is the probable task behind the query understandable? |
| answerability | Can this post answer it with original information? |
| local specificity | Does it support the office's real area expertise? |
| evidence breadth | Do independent surfaces support the wording or intent? |
| risk | Does the phrase invite unsupported promises or wrong audiences? |

For every selected keyword, include a counterargument and overturn condition.

Example:

```yaml
candidate: "신촌 단기임대"
selected: true
mode: limited_evidence
reason:
  - "가상 매물의 거래 유형과 직접 일치"
  - "자동완성에서 단기임대 표현 확인"
  - "블로그 표본에서 단기 거주 조건 질문 반복"
counterargument:
  - "절대 검색량이 없어 수요 규모는 알 수 없음"
overturn_if:
  - "정량 소스에서 검색량이 극히 낮고 대체어가 더 높은 문의 의도를 보임"
```

## Cache

Evidence can be reused only when all relevant scope values match:

- collection date;
- region;
- property and transaction type;
- candidate set;
- device;
- age/gender filters;
- query surface;
- sort;
- session/personalization policy.

Cache reuse records the original run ID, collection time, source paths, and hashes. A new date normally requires fresh collection because surfaces can change.
