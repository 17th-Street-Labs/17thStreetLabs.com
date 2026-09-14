export const services = [
  {
    slug: "engineering",
    title: "AI product engineering",
    summary:
      "We design and build agentic products that survive contact with real users: retrieval, tool use, model routing, durable workflows, and the integrations that make them useful.",
    outcome: "You ship a product, not a demo.",
    fits: [
      "A prototype impressed leadership and now has to become a product",
      "An agent needs to take real actions in real systems",
      "Costs, latency, or reliability are blocking launch",
    ],
  },
  {
    slug: "security",
    title: "AI security",
    summary:
      "Threat modeling, adversarial testing, and red teaming for systems that reason and act. We find how the system breaks, then design the permissions and controls that stop it.",
    outcome: "You learn how it breaks before an attacker does.",
    fits: [
      "An agent has access to customer data, money, or production systems",
      "Prompt injection and tool escalation are on the risk register",
      "A customer or auditor is asking for evidence of testing",
    ],
  },
  {
    slug: "evals",
    title: "Evals & reliability",
    summary:
      "Curated datasets, scenario evaluations, deterministic and LLM judges, failure taxonomies, and regression gates. Measurement your team can run every week, not a one-off report.",
    outcome: "You replace launch anxiety with numbers you trust.",
    fits: [
      "Quality is judged by vibes and a spreadsheet of screenshots",
      "A model or prompt change broke something nobody noticed",
      "Leadership wants to know if it is actually getting better",
    ],
  },
  {
    slug: "advisory",
    title: "Technical advisory",
    summary:
      "Architecture direction, build-versus-buy decisions, platform strategy, and hands-on enablement for senior teams. Counsel from people who still write the code.",
    outcome: "You move faster without mortgaging the system.",
    fits: [
      "You are choosing a platform, vendor, or architecture you will live with for years",
      "Your senior engineers need a peer, not a slide deck",
      "The board is asking questions the team cannot yet answer",
    ],
  },
];

export const proof = [
  { value: "25+", label: "years building and leading production software" },
  { value: "13", label: "agentic systems under management" },
  { value: "22", label: "security audits" },
  { value: "4wk", label: "average turnaround" },
];

export const findings = [
  "prompt injection through tool output",
  "agent tokens scoped far wider than the task",
  "LLM judges that quietly disagree with humans",
  "retrieval that leaks across tenants",
  "tool calls with no spend ceiling",
  "regressions nobody measured after a model swap",
  "approval steps the agent learned to route around",
  "evals that grade the demo, not the product",
];
