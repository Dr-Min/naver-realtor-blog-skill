# Fictional Sinchon Example

> 모든 사무소, 인물, 매물, 금액, 위치, 사진은 스킬 구조 설명을 위한 가상 자료입니다. 실제 문의를 받지 않으며 실제 매물의 증거가 아닙니다.

## Scenario

- 지역: 신촌 생활권
- 유형: 오픈형 원룸
- 거래: 가상 단기 월세
- 보증금: 300만 원
- 월세: 95만 원
- 관리비: 10만 원
- 입주 가능일: 2026-09-01
- 계약상 최대 2인 입주 가능이라는 가상 입력
- 주차 불가, 엘리베이터 없음이라는 가상 입력
- 사진 대신 SVG 자리표시자 세 장

## Files

- [input.yaml](input.yaml) — 인간 입력의 정규화 예
- [photo-observations.yaml](photo-observations.yaml) — 사진 관찰과 단정 금지 경계
- [inferred-audience.yaml](inferred-audience.yaml) — AI 독자 추론
- [keyword-decision.yaml](keyword-decision.yaml) — 제한 근거 모드 결정
- [readable-draft.md](readable-draft.md) — 모바일 가독성 규칙을 적용한 인간용 원고
- [naver-payload.yaml](naver-payload.yaml) — 브라우저용 결정적 입력 순서
- [readability-receipt.yaml](readability-receipt.yaml) — 모바일 문단·소제목·사진 간격 검수값
- [report-outline.md](report-outline.md) — 인간 보고서 요약 예
- [assets](assets/) — 실제 사진이 아닌 단순 자리표시자

## What this example proves

It demonstrates schema relationships and safety labels. It does not prove that the keyword has a specific search volume, that the listing exists, or that Naver will rank the resulting post.
