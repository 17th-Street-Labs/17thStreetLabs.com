---
slug: agents-that-see-the-ui
---

The test clicked the button. The expected text appeared. Everything passed.

Meanwhile, the interface flashed, jumped, and briefly showed the wrong state. The test had checked the destination. The user had experienced the journey.

Our team has been experimenting with giving agents browser recordings as well as page structure. The useful surprise was that an agent could flag behavior we had not explicitly written a test for. That makes recordings an interesting source of evidence, especially for problems that disappear before the final screenshot.

## Show it what happened between screenshots

HTML can tell you that an element exists. A screenshot shows how a moment looked. A recording adds the transitions between those moments.

That can help an agent investigate a suspected flicker, a loading state that repeats, or a control that shifts while someone is trying to use it. Frame-by-frame inspection provides a way to point to the behavior instead of vaguely reporting that the page “felt off.”

The agent still needs a clear task. Ask it to compare an approved baseline with a candidate run, identify specific differences, and provide timestamps or frame references for anything worth reviewing.

## Record successful runs, too

[Playwright supports test video recording](https://playwright.dev/docs/videos). For this experiment, recording only failed tests would miss the point: the suspected visual problem may occur during a test that passes.

A minimal configuration for a controlled comparison is:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    viewport: { width: 1280, height: 720 },
    video: 'on',
  },
});
```

Record the same journey for the approved baseline and the candidate. Keep browser, viewport, test data, and environment consistent. Preserve the artifacts with a clear relationship to the build they represent.

A baseline is an approved reference, not simply the most recent passing run. Replacing it automatically after every test can quietly approve the regression you wanted to catch.

## Ask for observations before conclusions

A useful review request might be:

> Compare these recordings of the same task. Flag unexpected movement, repeated loading states, or briefly incorrect content. Give a timestamp and describe the visible evidence for each suspected issue. Separate intentional differences from problems that need review.

Inspect the flagged segment in the original recording. Selected frames can miss fast behavior, and compression or timing differences can make a harmless change look suspicious. The agent’s report is a lead to investigate, not a definitive verdict.

Where possible, connect the observation to browser events or a trace. That makes it easier to distinguish a rendering problem from a slow response or a different test state.

## Turn a discovery into a durable check

Once a person confirms the issue, reproduce it and decide how to test it reliably. A specific layout check, a state assertion, or a focused screenshot comparison may be cheaper and more stable than asking a model to review the entire recording every time.

[Playwright’s visual comparisons](https://playwright.dev/docs/test-snapshots) provide one option for checking rendered output against an approved image. Use them where a static comparison matches the failure. Keep recording-based checks for problems that happen between frames.

## Spend attention where it helps

Reviewing every frame of every test can be expensive. Start with a few important journeys, then narrow analysis to changed or suspicious segments. Keep a representative sample of apparently clean runs so you can check what the process misses.

Use test data and control access to recordings. A video can capture private information just as easily as a log can.

The useful outcome is a better feedback loop: the agent spots something, an engineer verifies it, and the test suite learns a new failure mode. That is how a surprising observation becomes reliable engineering.
