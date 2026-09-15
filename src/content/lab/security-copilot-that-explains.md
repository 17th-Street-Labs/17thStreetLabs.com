---
slug: security-copilot-that-explains
---

A terminal full of fast-moving commands can look impressive. To the person responsible for the system, it can also look like a very expensive way to lose track of what is happening.

One idea from our team’s experiments is a companion that watches the agent’s work and explains it as it happens: what the current step is trying to establish, what the result means, and which decision comes next.

The useful part is knowing when to let the work continue—and when to step in.

## Explain the decision, not every line

A useful explanation should help someone answer four questions:

- What is the agent trying to learn?
- What has the tool actually shown?
- What is still uncertain?
- What action, if any, needs approval?

Those answers can fit in a small panel beside the work. They do not need to become another scrolling transcript competing for attention.

For an experienced engineer, the panel may be a quick orientation aid. For someone learning security work, it can make unfamiliar results easier to interpret without hiding the evidence.

## Give the explanation its own evidence

Consider an illustrative read-only configuration review. A result shows that a protective setting is absent, but the agent has not established whether the affected component is reachable.

A useful companion might say:

> The configuration check found a missing setting. That could matter if this component is exposed, but exposure has not been established. The next step is to review the approved deployment information. No change has been made.

That explanation connects an observation to its limits. It does not turn a possible concern into a confirmed incident.

To do this reliably, the companion needs the relevant tool call, its returned result, and the current task context. It should cite the event it is explaining. If it cannot see enough of the record, it should say so.

## An explanation is not a permission check

A model can give a persuasive explanation of a dangerous action. It can also misread whether an action already happened.

Keep authorization in the application. The companion can explain why approval is being requested, but it should not grant its own approval or treat a helpful-sounding rationale as permission.

The underlying record should distinguish proposed, approved, running, completed, and failed actions. An explanation generated from those states is easier to audit than one inferred from conversational wording alone.

Start with the companion observing work rather than taking additional actions. That makes it possible to evaluate whether its explanations help before giving it another way to affect the system.

## Test whether people understand more

A smooth explanation can still be wrong. Give reviewers recorded scenarios and ask whether the explanation identifies the actual result, preserves uncertainty, and flags the right decision.

Include failed commands, partial outputs, conflicting evidence, and steps awaiting approval. Watch for the companion claiming that a proposed action is complete or that a hypothesis is a verified finding.

Then test with the intended readers. Can they tell what happened? Can they identify what needs review? Do they know where to inspect the evidence? A shorter explanation that supports those decisions is more useful than a polished paragraph that merely sounds informed.

## Make the work easier to question

A copilot should help an engineer interrupt a mistaken assumption, ask for the missing check, or reject an unsupported conclusion. That is a more valuable outcome than making every run feel smooth.

The idea is still a design direction to validate, rather than a claim that every part has been delivered. Start with one workflow, a reliable event record, and a small set of explanations people can judge.

The best version leaves the reader with a clearer understanding of both the system and their own next decision. The commands can keep moving. The human should be able to keep up.
