export const services = [
  {
    slug: "evals",
    title: "Evals & reliability",
    summary:
      "Behavioral evals, LLM judges, trajectory evals, regression suites, adversarial scenarios, and production feedback loops. Measurement your team runs every week, so you know what changed, what improved, what broke, and why.",
    outcome: "Know when your AI gets better. Know when it gets worse. Know why.",
    fits: [
      "Quality is judged by vibes and a spreadsheet of screenshots",
      "A prompt or model change fixed one thing and quietly broke another",
      "Your eval says pass. Your users say otherwise.",
    ],
  },
  {
    slug: "agents",
    title: "Agentic systems",
    summary:
      "Agents that research, use tools, write code, delegate, operate software, and run in parallel. We design the harness, context, memory, orchestration, and recovery that make the whole system coherent, not just capable.",
    outcome: "An agent that finishes the task. Verifiably.",
    fits: [
      "An agent works 90% of the time and nobody knows what happens in the other 10%",
      "One agent is interesting and fifty is architecture you do not have yet",
      "The agent needs tools, then boundaries, then proof it did the job",
    ],
  },
  {
    slug: "products",
    title: "AI-native products & model strategy",
    summary:
      "Products where intelligence is a first-class citizen, not a chatbot in the corner. Plus the model strategy underneath: frontier, small, local, or a hundred cheap agents in parallel, chosen by measurement, not habit.",
    outcome: "The model is a component. The system is the product.",
    fits: [
      "You want to build what you would have built if AI had existed from day one",
      "You are paying frontier prices for commodity work",
      "Sensitive data cannot go anywhere near a third-party model",
    ],
  },
  {
    slug: "security",
    title: "AI security",
    summary:
      "Automated vulnerability discovery, AI-assisted exploit research, adversarial testing, and proactive defense. Attackers now have cheap, patient, parallel intelligence. We research what defense has to become.",
    outcome: "You learn how it breaks before an attacker does.",
    fits: [
      "An agent has access to customer data, money, or production systems",
      "Prompt injection and tool escalation are on the risk register",
      "Reactive security is running out of time and you know it",
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
  "the agent completed the task. allegedly.",
  "prompt injection through tool output",
  "LLM judges that quietly disagree with humans",
  "a prompt fix that broke three other things",
  "retrieval that leaks across tenants",
  "agent loops with no spend ceiling",
  "regressions nobody measured after a model swap",
  "evals that grade the demo, not the product",
  "frontier prices for commodity work",
];
