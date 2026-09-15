# Reader invitation concepts

Three interactive proposals; no production signup behavior has been changed.

## Shared proposed behavior

- Let visitors read three distinct articles freely. On the fourth article, invite them to subscribe after the introduction is visible.
- Remember the count across visits in browser storage when implemented. Reopening the same article should not inflate the distinct-article count.
- Keep an obvious skip and close control. Skipping immediately restores the article and does not trigger another prompt on that same page.
- Continue inviting on subsequent article visits until the visitor subscribes. This follows the later instruction and supersedes the earlier two-dismissal/month-long cooldown idea.
- The mockups start at article four. “Next article” demonstrates repeat invitations; “Replay” restores the invitation and replays its motion. The optional timing control explores starting after two articles.
- A successful mock signup shows a clearly labeled simulation; no data leaves the mockup. Actual implementation would use the existing Telegram-backed newsletter route and stop prompting only after confirmed delivery.
- Actual article content must remain intact. The typewriter treatment edits a decorative excerpt, not the source article; skipping restores normal reading immediately. Reduced-motion users get the final invitation without typing or sliding.
- Production implementation would need persistent visit/subscription state, storage-unavailable fallback, accessible focus management, and delivery integration. These are design proposals for selection, not a claim that those behaviors have shipped.

## 1. The side note

A small lavender invitation occupies a separate sidebar on desktop and follows the reading excerpt on mobile. It never covers or dims the article. “Your refund bot is feeling generous” introduces a clearly hypothetical failure and a concrete path to investigate and test it. The skip says “Just here to read.” This is the lightest interruption and the recommended default.

## 2. The soft pause

A compact paper-colored invitation appears over a gently dimmed reading area. “A $1 car. An expensive screenshot.” introduces a sourced chatbot incident and asks what an agent can actually authorize. The skip says “Not today. Keep reading.” It has more presence without a paywall or a fabricated content restriction.

## 3. The editorial interruption

A sage editing note erases and retypes a short decorative excerpt. “It seems fine” becomes “Here’s the evidence.” The invitation closes with “Fixed is good. Proven is better.” The skip says “Finish the article first.” Keep this as a one-time playful variation rather than making repeat readers watch the same joke on every visit.

All copy is original: conversational, dry, self-aware, and lightly mischievous. It is not a reproduction of any named writer's prose.


## Browser verification after clarification

For each of the three prototypes, drove the demo through three different sample articles with no invitation, revisited article two without increasing the count, opened article four and confirmed the invitation, skipped it, opened article five and confirmed it returned, then simulated signup and confirmed subsequent navigation stayed quiet.

The side-note variant was measured at 736px and 360px: article/invitation rectangles do not overlap; article opacity stays at 1; no horizontal overflow at 360px. At narrow widths the note follows the article excerpt rather than covering it.

These are browser-driven checks of the isolated interactive demos. The demo count lives only in the current demo session. Persistent history across browser reloads and actual website integration remain implementation work after selecting a design.


## Updated voice direction

The latest copy replaces tired-writer jokes and vague useful-bits language with concrete risks and evidence. See `reader-invitation-copy-library.md` for eight grounded messages, optional reading links, source checks, and the honest occasional-email expectation. The active demos use the refund, dealership, and proof messages. The side note tilts by one degree and straightens on pointer or keyboard interaction, with motion removed for reduced-motion preferences.

The revised demos were also checked for reading without signup, invitations on the fourth distinct article, and quiet navigation after simulated signup. Optional reading links open a relevant reading preview inside the sandboxed demo; production links are documented in the copy library. The side note straightens on pointer interaction. All three invitations fit at 360px without horizontal overflow.
