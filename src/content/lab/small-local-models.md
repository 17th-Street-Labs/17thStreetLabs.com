---
slug: small-local-models
---

A small model running on a laptop does not look like an enterprise AI strategy.

Give it the right job, and it might become part of one.

While testing models for ExploitHunter, our team found that smaller models could do useful work well beyond what their size suggested. The opportunity wasn’t to pretend they were interchangeable with every frontier model. It was to find the work they could do reliably—and stop paying more for that work by default.

## Give it one job you can check

“Investigate this system” asks a model to plan, remember, use tools, recover, and decide when it has enough evidence. That’s a lot of responsibility in one sentence.

A narrower assignment is easier to evaluate. Consider a tool result with sensitive information removed: extract the affected component, summarize the observation, and identify which details are missing. Software can check whether the required fields exist. A reviewer can check whether the summary is supported.

These are candidate tasks, not promises about a particular model. The useful question is whether your chosen model can pass your checks often enough to earn a place in the workflow.

## Give it less confusion, not less evidence

A coordinator can divide a longer job into steps, give each step the context it needs, and save the outputs somewhere durable. The next step starts with a clear assignment instead of a sprawling conversation.

But summaries can drop the detail that matters. If a worker reports “nothing unusual,” the coordinator still needs access to the underlying observation. Otherwise a tidy workflow can quietly lose its ability to correct a mistake.

Keep the original evidence. Make unfinished work easy to spot. Provide a route to a stronger model or a human when the task exceeds what the smaller model can handle.

## The download size isn’t the memory budget

A model file is only part of what must fit on the machine. Runtime overhead and the working memory used for context matter too. Longer conversations and concurrent requests can change the hardware requirements considerably. [Ollama’s documentation](https://docs.ollama.com/faq) describes how context length and parallel processing affect memory use.

So test the workload you intend to run. A quick answer to a short prompt does not establish how the same setup will behave during a long, multi-step session.

Measure how long people wait when the machine is busy, too. A model that technically runs can still be a poor fit for an interactive product.

## Make the comparison fair

Use a small collection of representative tasks, including awkward inputs and incomplete evidence. For each candidate, record:

- Whether the task passed the same quality checks.
- How many retries or human corrections it needed.
- How long the complete job took.
- What resources it consumed.

Let each model use an appropriate prompt and harness, but keep the task, available evidence, and success criteria comparable. Record the configuration so you know what you actually tested.

If a small model produces acceptable results on routine work and escalates the rest cleanly, that can be a useful system. If it confidently passes bad work downstream, a low inference cost won’t save it.

## Where we would begin

Choose one repetitive task with a result you can inspect. Run the small model alongside the current process before giving it responsibility for the outcome. Look closely at the cases where it disagrees.

That gives you a bounded experiment and a decision you can defend. You may discover a valuable local component. You may discover why the stronger model is worth paying for.

Either is more useful than choosing by reputation.
