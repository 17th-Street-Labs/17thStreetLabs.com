export interface LabEntry {
  slug: string;
  draft?: boolean;
  category: string;
  title: string;
  summary: string;
  takeaway: string;
  url: string;
}
export const allLabEntries: LabEntry[] = [
  {"slug": "lessons-from-ai-security-agents", "draft": true, "category": "Agents", "title": "We Burned Thousands of Dollars Testing AI Models. Here’s What We Learned.", "summary": "Small models surprised us. The bigger lesson was what we had to build around them.", "takeaway": "Choose the system that completes the work. The model is only one part of it.", "url": "/lab/lessons-from-ai-security-agents/"},
  {"slug": "small-local-models", "category": "Agents", "title": "Small Models. Serious Work.", "summary": "What small local models can do, where they struggle, and how to give them a fair test.", "takeaway": "Give a small model a bounded job, useful context, and a way to prove it finished.", "url": "/lab/small-local-models/"},
  {"slug": "cost-per-completed-task", "category": "Costs and Optimization", "title": "The Cheap Model Can Get Expensive.", "summary": "The number worth watching is cost per completed task. Here’s how to measure it.", "takeaway": "Include retries, verification, and human cleanup before you call a model cheap.", "url": "/lab/cost-per-completed-task/"},
  {"slug": "renting-vs-buying-gpus", "category": "Costs and Optimization", "title": "Before You Buy the GPU.", "summary": "Renting compute can buy you something more useful than hardware: room to change your mind.", "takeaway": "Benchmark your workload before committing to the hardware that will run it.", "url": "/lab/renting-vs-buying-gpus/"},
  {"slug": "one-harness-does-not-fit-every-model", "category": "Agents", "title": "One Harness Does Not Fit Every Model.", "summary": "The structure that helps a small model can get in a stronger model’s way.", "takeaway": "Test the model and its harness together. Change either, and you have a different system.", "url": "/lab/one-harness-does-not-fit-every-model/"},
  {"slug": "continuous-security-testing", "category": "Security & Privacy", "title": "The Attackers Are Getting Agents, Too.", "summary": "Cheap automation changes the pace. Your security testing needs to keep up.", "takeaway": "Turn important security failures into repeatable tests with owners and a path to a fix.", "url": "/lab/continuous-security-testing/"},
  {"slug": "eval-driven-agent-development", "category": "Testing & Evaluation", "title": "Your AI Judge Needs to Be Judged, Too.", "summary": "A practical approach to eval-driven development: test the journey, then test the grader.", "takeaway": "A passing verdict needs evidence. So does your confidence in the judge.", "url": "/lab/eval-driven-agent-development/"},
  {"slug": "agents-that-see-the-ui", "category": "Testing & Evaluation", "title": "Your Tests Passed. Your Interface Didn’t.", "summary": "Give an agent the browser recording, and it can look for what the final screenshot missed.", "takeaway": "Use recordings to find suspected failures, then turn those findings into repeatable checks.", "url": "/lab/agents-that-see-the-ui/"},
  {"slug": "local-ai-data-privacy", "category": "Security & Privacy", "title": "Some Data Doesn’t Get to Leave.", "summary": "Local AI can keep sensitive work inside your environment. Check the whole route.", "takeaway": "Local inference is one privacy control. Verify where every tool, log, and artifact goes.", "url": "/lab/local-ai-data-privacy/"},
  {"slug": "security-copilot-that-explains", "category": "Security & Privacy", "title": "The Agent Is Working. Does Anyone Know What It’s Doing?", "summary": "A security copilot should make the work easier to follow—and easier to question.", "takeaway": "Explain the evidence, the uncertainty, and the next decision while the work is happening.", "url": "/lab/security-copilot-that-explains/"},
];

// Only published entries may be used for routes, navigation, or public listings.
export const labEntries = allLabEntries.filter(entry => !entry.draft);
