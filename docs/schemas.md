# Data Schemas

These are conceptual contracts. Implementations may add fields but should not remove provenance, limitations, or safety flags.

## business-profile.yaml

```yaml
schema_version: "1.0"
office:
  display_name: "가상사무소"
  public_contact: null
  public_address: null
specialties:
  regions: ["신촌 생활권"]
  property_types: ["원룸"]
tone:
  honorific: true
  style: "친절하고 구체적"
publishing:
  browser_surface: "codex_in_app_browser"
  target_fingerprint: null
  save_after_qa: true
  public_publish: false
privacy:
  credentials_stored: false
```

## listing.yaml

```yaml
schema_version: "1.0"
mode: fictional_demo
property:
  region:
    value: "신촌 생활권"
    source: human
  transaction_type:
    value: "단기 월세"
    source: human
prices:
  deposit_krw: 3000000
  monthly_rent_krw: 950000
  management_fee_krw: 100000
  included: ["수도", "인터넷"]
  excluded: ["전기", "가스"]
verification:
  confirmed_at: "2026-08-18T09:00:00+09:00"
```

## photo-observations.yaml

```yaml
photos:
  - id: room-01
    authorized: true
    visible:
      - "침대 두 개"
      - "창문과 블라인드"
    cannot_prove:
      - "계약상 입주 인원"
      - "전용면적"
      - "옵션 포함 여부"
    privacy_check: pass
```

## inferred-audience.yaml

```yaml
value_type: ai_inference_not_realtor_input
primary_hypothesis: "신촌에서 가구 구매 없이 단기간 거주할 1~2인"
confidence: medium
evidence: []
counterarguments: []
alternatives: []
prohibited_claims: []
```

## keyword-research.yaml

```yaml
decision_mode: limited_evidence
absolute_volume: UNKNOWN
candidates:
  - keyword: "신촌 단기임대"
    selected: true
    evidence: []
    reason: []
    counterarguments: []
    overturn_if: []
```

## naver-payload.yaml

```yaml
status: qa_approved_for_draft_save
public_publish: false
action_after_qa: save_draft_only
title: "..."
readability_profile: naver_mobile_v1
body_blocks: []
tags: []
verification:
  require_title: true
  require_visible_captions: true
  require_separate_heading_blocks: true
  require_scannable_core_conditions: true
  require_single_visual_gaps: true
  forbid_heading_body_concatenation: true
  max_paragraph_chars: 140
  forbidden_action: publish
```

## readability-receipt.yaml

```yaml
profile: naver_mobile_v1
heading_count: 4
paragraph_characters: [42, 61, 78]
longest_paragraph: 78
paragraph_exceptions: []
core_condition_bullets: 6
consecutive_images: []
emphasis_per_section:
  핵심 조건: 1
concatenation_risks: []
deviations: []
```

## QA receipt

```yaml
gate: evidence
attempt: 1
status: PASS
inputs:
  - path: "ai/research/3a-datalab/result.yaml"
    sha256: "..."
findings: []
limitations: []
produced_at: "..."
```

## save-result.yaml

```yaml
status: saved
payload_sha256: "..."
target_match: true
title_verified: true
image_count_verified: 3
captions_verified: 3
draft_confirmation: true
public_publish: false
credentials_stored: false
```
