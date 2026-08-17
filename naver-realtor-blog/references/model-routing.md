# Model routing and token policy

Preserve all ten logical roles. Reduce cost through model tier, context isolation,
bounded receipts, deterministic checks, and role-local escalation rather than
by merging independent collectors or QA gates.

## Mode selection

- Use `efficient` when the user does not name a mode. This is the default.
- Use `ultra_precision` only when the user explicitly asks for 초정밀,
  최고 정밀도, 최고 성능, or equivalent wording.
- Do not silently switch the whole run to `ultra_precision`.
- Allow a single role in an `efficient` run to escalate without changing the
  run mode. Record the role, trigger, prior attempt, replacement model, and cost
  reason in `ai/system/execution-agents.yaml`.

## Efficient mode — default

| Role | Model | Effort | Execution |
| --- | --- | --- | --- |
| DataLab collector | gpt-5.6-luna | medium | 3A parallel |
| Autocomplete collector | gpt-5.6-luna | low | 3B parallel |
| Blog-search collector | gpt-5.6-luna | medium | 3C parallel |
| Keyword decider | gpt-5.6-terra | medium | after 3A/3B/3C |
| Content planner/writer | gpt-5.6-terra | medium | after keyword decision |
| Audience QA | gpt-5.6-luna | medium | QA parallel |
| Evidence QA | gpt-5.6-luna | medium | QA parallel, script-first |
| Content QA | gpt-5.6-terra | medium | QA parallel |
| Browser publisher | gpt-5.6-terra | medium | single owner, sequential |
| Report builder | gpt-5.6-terra | low | after locked inputs |

## Ultra-precision mode — preserved former default

| Role | Model | Effort |
| --- | --- | --- |
| DataLab collector | gpt-5.6-luna | high |
| Autocomplete collector | gpt-5.6-luna | high |
| Blog-search collector | gpt-5.6-luna | high |
| Keyword decider | gpt-5.6-sol | high |
| Content planner/writer | gpt-5.6-sol | high |
| Audience QA | gpt-5.6-sol | high |
| Evidence QA | gpt-5.6-sol | high |
| Content QA | gpt-5.6-sol | high |
| Browser publisher | gpt-5.6-terra | high |
| Report builder | gpt-5.6-terra | high |

## Context isolation

Spawn every bounded subagent with `fork_turns: "none"`. Never copy the full
conversation into a collector, decider, writer, QA, browser, or report task.
Give the agent only:

1. role and one responsibility;
2. run directory and the specific skill reference it must read;
3. exact read-only input paths with SHA-256;
4. exact owned output paths;
5. schema version and execution mode;
6. stop conditions and prohibited mutations;
7. a compact return contract.

Normalize new user corrections into the run files first, then pass the changed
file and hash. Do not forward the raw chat transcript. Pass screenshots and
workbooks by local path; do not embed their bytes or base64 in prompts.

Detailed reasoning, evidence, and limitations belong in owned files. The chat
receipt should contain only status, output paths, critical blocker, actual
model/effort, and whether escalation is requested—normally ten lines or fewer.
Do not ask agents to restate their inputs.

## Script-first checks

Use deterministic code before model judgment for SHA-256, required files,
arithmetic, DataLab workbook recomputation, MIME/extension matching, paragraph
length, heading separation flags, image count/order, and publication safety.
The evidence QA agent reviews the script receipt and only judges provenance,
semantic consistency, inclusion policy, and unresolved limitations.

## Role-local escalation

In `efficient` mode, retry or escalate only the affected role. Escalate once
to `gpt-5.6-sol` at `high` when at least one recorded trigger applies:

- two bounded attempts fail on the same non-browser issue;
- independent evidence sources materially conflict;
- a factual, audience, or promotional claim remains ambiguous after the
  deterministic checks;
- keyword selection changes depending on an unresolved interpretation;
- content QA cannot distinguish a material overclaim from safe wording.

For editor interaction failures, first retry the browser publisher once at
`gpt-5.6-terra` high; do not use a reasoning model merely to click the UI.
Do not escalate for verbosity, cosmetic preference, a cache hit, or a result
that already passes its contract.

## Cache behavior

Keep the collector roles even when evidence is reusable. On an exact cache
fingerprint match, each collector validates lineage and hashes, records
`cache_reused: true`, and avoids fresh browsing. A cache mismatch triggers
fresh collection only for the affected surface.

## Substitution

If a named model is unavailable, select the closest model in the same cost and
capability tier. Record requested and actual model/effort plus the reason.
Never claim a model ran when it did not.
