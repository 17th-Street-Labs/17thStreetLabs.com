---
slug: cost-per-completed-task
---

The price of a model call is easy to compare. The cost of getting useful work out of it is less cooperative.

Our ExploitHunter experiments included inexpensive models that made serious experimentation much more affordable. They also reinforced a distinction worth putting in every AI budget: an attempt and an outcome are different things.

A cheap model that needs repeated help can cost more than a stronger model that finishes cleanly. A frontier model handling routine extraction can be an expensive habit. You have to measure the workflow to know which situation you have.

## Pick a unit the business recognizes

Tokens—the pieces of text a model processes—are a billing unit. They are rarely the outcome someone wanted.

Choose a unit such as a reviewed document, a verified finding, or a completed support task. Define what counts as complete before comparing models. An answer that needs an engineer to rewrite it has not passed the same bar as one ready to use.

Then calculate:

> Cost per accepted result = total workflow cost ÷ results that meet the quality requirements.

Count model calls, tool use, retries, checking the result, computing resources, and human review. If you leave a cost out because you cannot yet measure it, label that omission. Missing data should not become free labor by accident.

## A little arithmetic changes the conversation

Here’s an illustrative example, not a benchmark or a provider quote.

| Batch of 100 tasks | Workflow A | Workflow B |
| --- | ---: | ---: |
| Initial model calls | $10 | $40 |
| Retries and verification | $20 | $10 |
| Human review and correction | $90 | $20 |
| Accepted results | 80 | 95 |
| Total cost per accepted result | $1.50 | About $0.74 |

Workflow A has the cheaper initial calls. Workflow B costs less per accepted result in this example. Neither total tells you whether the remaining failures are tolerable. A low average cost can still hide a failure you cannot ship.

Keep quality and risk as requirements, rather than allowing a cost saving to cancel them out in one blended score.

## Routing can help. Measure the handoff.

One approach is to send routine tasks to a smaller model and escalate difficult cases. That only works if the system can recognize when escalation is needed.

A model saying it is confident is a weak gate on its own. More useful signals include missing required evidence, failed validation, an exhausted retry budget, or a task category that requires specialist review.

Measure how often work escalates and whether the first attempt adds useful information. If nearly everything gets repeated by the expensive model, you may have added a tollbooth rather than saved money.

## A local model still has a bill

When you pay a provider for model access through an API, the bill is relatively visible. When you run the model yourself, the cost includes hardware, energy, maintenance, and how much the machine actually gets used. An idle GPU still belongs in the calculation.

Hosted compute adds its own questions: startup time, storage, data transfer, and whether resources remain billable between runs. Price the actual operating pattern, not a best-case hour on a product page.

Our companion piece on [renting versus buying GPUs](/lab/renting-vs-buying-gpus/) explains how to test that decision without committing too early.

## Keep the evidence behind the number

Save the model version, harness configuration, inputs, quality requirements, and resource usage for each comparison. Repeat enough cases to see whether a promising result holds up. Report the failures alongside the savings.

A useful cost comparison does more than lower a bill. It tells you where stronger reasoning earns its keep, where routine work can move, and which part of the system needs attention next.

That’s a much better procurement conversation than “this model is cheaper.”
