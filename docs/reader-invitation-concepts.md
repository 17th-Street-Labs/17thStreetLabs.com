# Article reading prompts

The approved implementation uses three short email invitations:

1. Lavender side note: “Good read? There’s more where that came from.”
2. Sage paragraph insert: “Enjoying the rabbit hole? We’ll email you the next one.”
3. Lime slide-in: “One more read? We’ll let you know when it’s ready.”

Each offers “Email for new articles,” “Send me more reads,” and “Keep reading.” These replace the earlier long-copy mockups and automatic article-access dialog.

## Behavior

- One invitation per article load, after a complete prose block near the midpoint by word count reaches the lower portion of the viewport.
- Rotate through the three variants as invitations appear; retain rotation in browser storage. If storage is blocked, choose a stable variant from the article slug.
- Side notes sit beside the prose on desktop. All variants sit between paragraphs on mobile. No backdrop, content lock, or automatic focus grab.
- Dismissal keeps the invitation closed for that page load. Escape works while interacting with it. Future article loads may invite again.
- Reduced-motion preferences disable arrival movement and tilt.
- Submit as `purpose: newsletter` to the existing `/api/lab-access/` Telegram integration. Confirm only after the endpoint reports successful delivery; preserve the email and allow retry on errors.
- Successful signup from either the article note or voluntary newsletter dialog suppresses future automatic notes in that browser. Article-access registration alone does not imply newsletter consent. No email is retained in browser storage.

## Validation

Browser checks cover all nine published articles, rotation, midpoint timing, dismissal, Escape, 320/390/1280px layouts, blocked storage, reduced motion, failure/retry, and suppression after confirmed signup. Delivery is mocked in browser tests; backend tests exercise the Telegram delivery contract with mocked transport. No real subscriber was created during verification.
