---
slug: one-harness-does-not-fit-every-model
---

We made a task easier to manage. That did not always make it easier to solve.

During our experiments, breaking work into tightly controlled steps helped some smaller models. Each worker received a focused assignment and returned a short update. A coordinator kept the job moving.

Apply the same approach to a more capable model, and something could go missing: the bigger picture. The structure that reduced confusion for one model could limit another model’s ability to connect evidence across the investigation.

A harness can help. It can also get in the way.

## What the harness actually does

An agent’s harness is the software that determines how it works: which tools it can call, what context it receives, where it stores progress, how it handles errors, and when it stops or asks for approval.

Those choices shape the task the model experiences. A model with access to complete evidence is solving a different problem from one that sees only summaries produced by other workers.

“We tried that model” leaves out quite a lot.

## The case for smaller steps

Imagine a controlled investigation with three jobs: collect observations, assess which observations support a concern, and prepare an evidence-backed report.

A staged workflow gives each worker less information to juggle and a clear description of what to return. It also creates useful checkpoints. If the observation record is missing, the system can stop before drafting a report around it.

This approach is worth testing when a model loses track of long assignments, struggles to maintain structured output, or needs explicit help recovering from a failed tool call.

But the stages need a way to ask for more information. Otherwise an early misunderstanding becomes the next worker’s starting assumption.

## The cost of a tidy summary

Suppose one worker notices an unusual response, while another records a permission change. Neither observation seems decisive alone. Together, they might warrant a closer look.

If both updates are compressed to “no finding,” the coordinator never sees the relationship. More reasoning capacity cannot recover evidence it was never given.

Keep source artifacts accessible. Let workers reference exact observations. Give the coordinator a way to reopen a step rather than treating each summary as final.

A short update is useful when it points to the evidence. It becomes a problem when it replaces it.

## Run a model-by-harness comparison

Choose a few representative tasks and compare two or more harness designs with each candidate model. Keep scope, available tools, evidence, and acceptance criteria comparable.

Useful variants might include:

- A single agent with access to the relevant shared context.
- A staged workflow with explicit checkpoints.
- A coordinator with specialist workers and access to their source artifacts.

Measure task completion, unsupported conclusions, recovery behavior, latency, and total cost. Read a sample of the unsuccessful runs. Aggregate scores tell you where to look; the sequence tells you what to change.

These variants are experiments, not a ranking of architectures. A capable model can benefit from delegation too. The point is to discover which structure helps on your workload.

## Change one thing you can explain

If a new harness improves results, identify the likely reason. Better context? Clearer tool descriptions? A checkpoint that catches incomplete work? Then test that explanation against more cases.

Do not remove permission checks or spending limits just because a model appears capable. Reasoning freedom and operational authority are separate decisions.

The architecture should give the model enough room to solve the problem while keeping the system accountable for what it does. That is more demanding than choosing a fashionable agent pattern. It is also where much of the useful engineering happens.
