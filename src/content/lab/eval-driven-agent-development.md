---
slug: eval-driven-agent-development
---

An agent says it finished. Another model says “PASS.”

That looks reassuring. It can also be two models agreeing about something neither has proved.

Eval-driven development means deciding what good behavior looks like, testing for it, and using the failures to guide the next change. For agents, the final answer is only part of the result. The steps taken to get there can matter just as much.

Dan has been experimenting with a compact way to evaluate that journey: describe the expected shape of the work in an outline, then compare the recorded interaction against it.

## Describe what must happen

A trajectory is the sequence of actions, observations, and decisions during a run. You do not always need one rigid sequence. You do need to identify dependencies and conditions that cannot be skipped.

Here is an illustrative rubric for reviewing a finding in an authorized test environment:

```text
Confirm the permitted scope.
Gather evidence. These checks may happen in either order:
  Inspect the relevant configuration.
  Review the supplied execution trace.
Assess whether the evidence supports the finding.
If evidence is missing, mark the finding unresolved.
Report the conclusion with references to the evidence.
```

The wording makes the allowed parallelism explicit. It also distinguishes an unresolved result from a successful finding. A system should not need to invent an answer to finish the task.

This outline is a grading aid. It is not the mechanism that enforces authorization.

## Give the judge something to inspect

Supply the task, the rubric, and the recorded interaction, including tool results. Ask the judge to identify which requirements were met and point to the supporting events. Allow “uncertain” when the record is insufficient.

If the judge claims that approval happened, its output should reference the recorded approval event. If that event cannot be found, the verdict needs review.

Dan’s early experience with this approach was promising. That is a reason to test it on more representative cases, rather than assume it generalizes to every workflow.

## Put exact checks in code

Some requirements do not need interpretation. Whether a required artifact exists, a tool call stayed inside an allowlist, or an output matches a schema can often be checked directly.

Use a model for judgments that need context, such as whether a conclusion follows from the evidence. Keep operational permissions enforced by the application. A judge assessing a trace after the fact cannot undo an unauthorized action.

[Anthropic’s agent-evaluation guidance](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) distinguishes the recorded trajectory from the outcome and discusses using different kinds of graders. Both are useful distinctions when deciding what your evaluation should inspect.

## Now test the judge

Build a set of human-reviewed examples: a valid run, a skipped dependency, an unsupported conclusion, and a legitimate alternative route. Include incomplete records and cases where the order can vary.

Run identical examples repeatedly. Check both agreement with the reviewed labels and consistency across repeats. A judge can be consistently wrong; it can also be correct often enough on average while changing decisions on a critical case.

Dan’s [Auto-Tune Your LLM Judge](https://danlevy.net/auto-tune-your-llm-judge/) goes deeper into measuring that variability and checking improvements against held-out cases.

## Let failures guide the next change

Suppose the agent repeatedly drafts its conclusion before checking the relevant evidence. That suggests a specific experiment: alter the workflow so evidence collection has a clear completion condition, then rerun the same cases.

Save the model, harness, grading rules, and judge settings with the results. Change one variable at a time where practical. Check new examples as well as the ones that motivated the fix.

A useful eval tells you which behavior failed and whether your change improved it. “PASS” is only valuable when you can explain what passed.
