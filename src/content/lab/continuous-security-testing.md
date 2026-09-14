---
slug: continuous-security-testing
---

An attacker does not need a brilliant idea every time. Sometimes the advantage is having enough time to keep trying.

Cheap AI models make it more affordable to generate and organize candidate approaches. Tools and available compute determine how much of that work can run. In Dan’s controlled security experiments, the volume of ideas a small model could produce was striking.

That does not make every attempt effective, or defense impossible. It does make a security program built around occasional checks harder to justify.

## Keep detection. Add a tighter testing loop.

Alerts, incident response, and human investigation still matter. Continuous testing serves a different purpose: checking important defenses before an incident, then checking them again when the system changes.

“Continuous” does not mean letting an agent hammer production all day. It means making the relevant checks a regular part of how the system is maintained, with scope, ownership, and limits.

A new integration, permission change, or agent tool can alter what the system is able to do. That is a useful trigger to revisit the controls around it.

## Start with the failures that hurt

For an AI application, useful starting points include whether untrusted input can redirect behavior, whether tools enforce their own permissions, and whether outputs are handled safely. The [OWASP guidance for LLM applications](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) identifies these as distinct areas of risk.

Turn each relevant concern into a testable question. For example: can a user obtain information outside their account? Does a tool refuse an action the user is not authorized to perform? Does the system preserve that boundary when a retrieved document contains conflicting instructions?

Those questions are more actionable than asking whether the AI is “secure.”

## A finding needs a path to a fix

A useful security loop has a few concrete outputs:

1. A test within a documented, authorized scope.
2. Evidence that supports the observed failure.
3. A person responsible for deciding and implementing the fix.
4. A repeatable check that verifies the fix and catches a recurrence.

An agent-generated report without those connections can increase the review burden without reducing risk. A longer report is not the same as a safer system.

Track which results were verified, which were false positives, and which important checks remain uncovered. The number of commands executed is interesting operationally. It is a weak measure of whether the system became safer.

## Scale the controls with the work

More parallel activity creates more need for coordination. Limit request rates and concurrency, isolate test accounts, define stop conditions, and keep active testing inside the agreed environment. Someone must be able to halt the run.

These controls protect the validity of the experiment as well as the target. If a test overwhelms a service, subsequent failures may tell you little about the question you meant to investigate.

Agents should also leave enough context for a reviewer to distinguish an observed behavior from a hypothesis. “Worth investigating” and “confirmed vulnerability” belong in different buckets.

## Put one recurring failure out of business

Start with a known weakness or a critical permission boundary. Make the check reliable in a controlled environment. Connect it to the changes likely to affect that boundary, and assign an owner to failed runs.

Then expand from evidence of what the program is catching and missing.

The practical advantage of automation is that important checks can happen more consistently. It should shorten the distance between a change, a discovered problem, and a verified fix.

If your security testing produces activity without closing that distance, adding more agents will mostly make it louder.
