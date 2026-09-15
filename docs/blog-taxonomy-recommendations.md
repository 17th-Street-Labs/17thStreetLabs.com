# Blog category and tag recommendations

**Status: categories approved and applied.** Tags remain recommendations and have not been applied. The article “We Burned Thousands of Dollars Testing AI Models” is now a draft; its source is retained but it is excluded from the public Blog and build. The table below records the full editorial inventory, including that draft. Public category counts are Agents (2), Costs and Optimization (2), Testing & Evaluation (2), and Security & Privacy (3). This recommendation compares the full text of all ten articles in `src/content/lab/` with their titles, summaries, and takeaways in `src/data/lab.ts`.

## Recommended structure

Use **one category and no more than three tags per article**. Start with these four categories; each already has at least two articles. There is no need to approach the ten-category ceiling with the current collection.

| Category | Current articles | Reader question it answers |
| --- | ---: | --- |
| Agents | 3 | How should we choose models and structure agents to complete useful work? |
| Costs and Optimization | 2 | What does useful AI work cost, and where should we spend? |
| Testing & Evaluation | 2 | How do we know the system worked, and catch regressions? |
| Security & Privacy | 3 | How do we protect data, enforce boundaries, and keep people in control? |

Categories provide the main reading sections. Tags describe specific subjects and can connect articles across categories. A tag belongs to the shared collection, rather than exclusively to one category. For example, **Model selection** connects engineering articles with the cost comparison, and **Regression testing** connects interface checks with security checks.

## Recommendations per article

| Article | Recommended category | Recommended tags | Reason for category |
| --- | --- | --- | --- |
| [We Burned Thousands of Dollars Testing AI Models. Here’s What We Learned.](../src/content/lab/lessons-from-ai-security-agents.md) | Agents | Model selection; Agent orchestration; Workflow costs | The security project supplies the examples, but the article's central lesson is choosing and testing the whole model-and-tool system. It introduces the broader engineering series. |
| [Small Models. Serious Work.](../src/content/lab/small-local-models.md) | Agents | Model selection; Local inference; Agent orchestration | Focuses on bounded jobs, appropriate context, coordination, and fair model comparisons. Local deployment is a specific subject rather than its own one-article section. |
| [The Cheap Model Can Get Expensive.](../src/content/lab/cost-per-completed-task.md) | Costs and Optimization | Workflow costs; Model selection; Model routing | Centers on cost per accepted result, including retries, verification, human cleanup, and escalation. |
| [Before You Buy the GPU.](../src/content/lab/renting-vs-buying-gpus.md) | Costs and Optimization | Workflow costs; GPU infrastructure | Frames renting versus owning as an investment decision supported by workload benchmarks, utilization, and operating costs. Two tags cover its main subjects without adding a third for its own sake. |
| [One Harness Does Not Fit Every Model.](../src/content/lab/one-harness-does-not-fit-every-model.md) | Agents | Agent orchestration; Context management; Model selection | Examines how task structure, shared evidence, and coordination interact with model capability. |
| [The Attackers Are Getting Agents, Too.](../src/content/lab/continuous-security-testing.md) | Security & Privacy | Security testing; Access controls; Regression testing | Its purpose is maintaining security boundaries through scoped, repeatable checks and verified fixes. Testing is the method; security is the reader's objective. |
| [Your AI Judge Needs to Be Judged, Too.](../src/content/lab/eval-driven-agent-development.md) | Testing & Evaluation | Agent evaluation; Evidence & traces; Human review | Explains evaluation rubrics, recorded actions, deterministic checks, and validation of model-based graders. |
| [Your Tests Passed. Your Interface Didn’t.](../src/content/lab/agents-that-see-the-ui.md) | Testing & Evaluation | Visual testing; Evidence & traces; Regression testing | Uses browser recordings to discover failures between screenshots, then turns verified observations into repeatable checks. |
| [Some Data Doesn’t Get to Leave.](../src/content/lab/local-ai-data-privacy.md) | Security & Privacy | Local inference; Data boundaries; Access controls | The primary concern is demonstrable control of data movement and permissions throughout a local AI system. |
| [The Agent Is Working. Does Anyone Know What It’s Doing?](../src/content/lab/security-copilot-that-explains.md) | Security & Privacy | Human review; Evidence & traces; Access controls | Focuses on accountable security work: evidence-backed explanations, uncertainty, authorization, and knowing when to intervene. |

## Tags represented within each category

These are the combined tags for articles in each category. The three-tag maximum applies **per article**, not to the combined list below.

| Category | Tags used by its articles |
| --- | --- |
| Agents | Model selection; Agent orchestration; Workflow costs; Local inference; Context management |
| Costs and Optimization | Workflow costs; Model selection; Model routing; GPU infrastructure |
| Testing & Evaluation | Agent evaluation; Evidence & traces; Human review; Visual testing; Regression testing |
| Security & Privacy | Security testing; Access controls; Regression testing; Local inference; Data boundaries; Human review; Evidence & traces |

## Why this grouping fits the whole collection

- The existing ten category labels each describe only one article. Four broader sections make browsing useful immediately and satisfy the goal of at least two articles per category.
- The overview article stays with the engineering pieces because its conclusion is about the complete agent system, despite its cost-focused headline and security-project context.
- The GPU article stays with economics because it helps a reader decide whether to rent or buy; there is not yet enough dedicated infrastructure coverage for a separate section.
- Evaluation and visual testing share the question “did this work?” Security testing remains in Security & Privacy because readers are looking to protect the system, with a shared regression-testing tag connecting the methods.
- The copilot article could also fit engineering. Security & Privacy is the better primary home for its current emphasis on authorization, auditability, and human intervention during security work.

## Keep it manageable as the blog grows

1. Assign the category by the article's main reader question, not every topic it mentions.
2. Reuse these tag spellings. Avoid parallel labels such as “LLM selection” and “Model selection,” or “Human oversight” and “Human review.”
3. Use two tags when two describe the article well; three is a limit, not a quota.
4. Add a new category only when at least two published articles clearly need that distinct section. None is needed now.
5. Some precise tags currently describe one article. That is acceptable for descriptive labels, but standalone tag pages can wait until they offer useful related reading.

This is an editorial classification of the current articles, not a keyword-volume or SEO research claim. No external research was needed to determine their actual themes.
