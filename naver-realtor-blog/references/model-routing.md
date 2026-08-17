# Model routing

Use these defaults when the models are available. Preserve the actual resolved model and effort in ai/system/execution-agents.yaml.

| Role | Default model | Effort | Execution |
| --- | --- | --- | --- |
| DataLab collector | gpt-5.6-luna | high | 3A parallel |
| Autocomplete collector | gpt-5.6-luna | high | 3B parallel |
| Blog-search collector | gpt-5.6-luna | high | 3C parallel |
| Keyword decider | gpt-5.6-sol | high | after 3A/3B/3C |
| Content planner/writer | gpt-5.6-sol | high | after keyword decision |
| Audience QA | gpt-5.6-sol | high | QA parallel |
| Evidence QA | gpt-5.6-sol | high | QA parallel |
| Content QA | gpt-5.6-sol | high | QA parallel |
| Browser publisher | gpt-5.6-terra | high | single owner, sequential |
| Report builder | gpt-5.6-terra | high | after locked inputs |

Give each agent only its bounded responsibility, exact owned output paths, input file paths and hashes, stop conditions, and required schema. Tell all agents they share the workspace, must preserve other agents' files, and must not rewrite inputs they do not own.

Collectors do not choose the keyword. The keyword decider does not rewrite raw evidence. QA roles do not silently fix production files; they report findings to the orchestrator. The browser publisher does not improvise content. The report builder consumes only locked files.

If model names are unavailable, choose the closest available fast collector, strongest reasoning decider/QA model, and reliable browser/report model. Record the substitution; never claim the requested model ran when it did not.
