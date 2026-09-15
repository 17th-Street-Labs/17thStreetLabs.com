---
slug: lessons-from-ai-security-agents
---

We spent thousands of dollars testing AI models while building ExploitHunter, our open-source workbench for authorized security research. We expected to learn which models were best.

We came away asking a better question: best at which part of the job?

Some inexpensive models did far more than their price suggested. Some difficult tasks needed stronger reasoning. And sometimes the thing holding a model back was the system we had wrapped around it.

That distinction matters when you’re deciding where to invest. Paying for a more capable model is easy. Knowing when it helps takes work.

## The bill was also a research budget

Security agents have to do more than produce convincing text. They need to work within an agreed scope, use tools, interpret results, and leave evidence someone can check. A polished report can hide a failed investigation surprisingly well.

Our experiments made us pay attention to the whole sequence: what the agent saw, what it tried, what happened, and what it could actually support at the end. That made the model rankings less tidy. It made the engineering decisions more useful.

Here are the lessons that stayed with us.

## Small models deserve real jobs

A model does not need to solve an entire investigation to be valuable inside one. Bounded tasks—organizing observations, extracting facts, or proposing a next check for review—can be useful places to test smaller models.

The important word is *test*. A fluent answer is not proof that the work was done correctly. Decide what a correct result must include, then check for it. We explore that distinction in [Small Models. Serious Work.](/blog/small-local-models/).

## The harness changes the result

The harness is the software around the model: its tools, instructions, memory, permissions, and control flow.

Breaking work into smaller steps helped in some of our experiments. But that same structure could withhold the wider context a more capable model needed. We could improve the parts and make the overall result worse.

That’s why swapping models without testing the surrounding architecture can be misleading. [One harness does not fit every model.](/blog/one-harness-does-not-fit-every-model/)

## Cheap attempts are not the same as cheap outcomes

A low-priced call is a good start. It stops being a bargain if the system repeats it, fails to notice mistakes, and hands the cleanup to an engineer.

Compare complete workflows, including verification and recovery. A stronger model can justify its price on a difficult step while a smaller model handles routine work. The decision belongs to the workload, not the logo on the model card.

## Evidence needs a better seat at the table

A final answer tells you what the agent says happened. Tool results, saved artifacts, and browser recordings help you check what happened.

Dan’s experiments with browser recordings were particularly useful: an agent could inspect behavior over time instead of relying only on HTML or a final image. That opened up a different way to look for visual regressions. It also created a new obligation to verify what the agent claimed to see.

The same applies to an AI judge. Its verdict is another output to test.

## Start with one decision you need to make

You don’t need to repeat every experiment we ran. Pick a workflow that matters, define a successful outcome, and compare a few model-and-tool setups on the same tasks.

Save the failures. Count the retries. Check the evidence. Decide what would make a result good enough to use.

The point of spending on experiments is to stop guessing where the next dollar should go.

The rest of this series takes those decisions one at a time. For the underlying project, explore [ExploitHunter on GitHub](https://github.com/justsml/ExploitHunter.app).
