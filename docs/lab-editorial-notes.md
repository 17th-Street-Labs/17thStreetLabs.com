# Blog: editorial provenance

## Brief and scope

The user authorized ten complete articles for the local website, based on the shared conversation “AI Security Series Plan”: https://chatgpt.com/share/6aa85f29-204c-83e8-b00b-aca5ef951499 . The full conversation was read through the browser. User requested no article dates and the joint byline Marina Levy and Dan Levy.

All four earlier PDF previews are now complete articles: spending/model lessons, AI judges (expanded to cover trajectory evaluation), attackers/continuous testing, and model-specific harnesses. Six additional articles cover small models, economics, GPU procurement, visual testing, privacy, and an explanatory security copilot. The ten subjects match the conversation's proposed list, including the separate economics article omitted from its nine-item publishing-order recap.

## Firsthand material

The shared conversation supplies the claims about spending thousands during development, useful small-model results, harness tradeoffs, outline-based trajectory evaluation, and browser-recording experiments. These are presented as the team's observations, not independently replicated research. No unsupported throughput multipliers, exact vendor price comparisons, certifications, client identities, or student statistics were added. Copilot material is explicitly a design direction to validate, not a launched-product claim.

The cost comparison table is explicitly illustrative and does not represent measured runs. Example rubrics, configuration, and scenarios are identified as examples. No confidential security targets, attack instructions, or details from private clients are included.

## Public references consulted

- https://danlevy.net/ — voice reference: practical, direct technical writing.
- https://danlevy.net/announcing-exploithunter-app/ — project context.
- https://github.com/justsml/ExploitHunter.app — current project description and public research; no repository benchmark figures reproduced as universal savings.
- https://danlevy.net/auto-tune-your-llm-judge/ — evaluator variance; linked in the evaluation piece.
- https://danlevy.net/llm-evals-are-broken/ — contextual reading on evaluation approach, not reproduced.
- https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents — trajectory/outcome and grader distinctions.
- https://docs.ollama.com/faq — context/concurrency memory and local-only mode; configuration does not cover other applications' traffic.
- https://docs.runpod.io/pods/manage-pods — hosted resource lifecycle and storage considerations.
- https://playwright.dev/docs/videos — video capture modes and context closure.
- https://playwright.dev/docs/test-snapshots — static visual comparisons.
- https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/ — LLM application risk areas; use current project page rather than archived OWASP list.

Public references appear beside the relevant claims in the articles. Most substantive narrative comes from the user's supplied conversation and original explanatory examples. Famous editorial/brand figures mentioned by the user were inspiration lenses, not actual reviewers or endorsers.

## Files

Article metadata and order: `src/data/lab.ts`.

Article text: `src/content/lab/*.md`. Each Markdown file supplies its slug and uses `src/layouts/Article.astro`. Published article pages have no dates. Site copyright is unchanged.


## Reader invitation (supersedes the fixed article gate)

All ten complete article bodies are now rendered in public HTML. No article is restricted by its position in the collection; all index links say Read. BlogPosting metadata marks the articles as freely accessible, with authors, descriptions, canonical URLs, and sitemap entries. No article dates were added. Search engines receive the same full content as everyone else; indexing is not guaranteed.

A browser-local meter records distinct article visits. The first three distinct articles do not trigger an invitation; a fourth new article opens a dismissible email dialog. Reopening an already visited article does not consume another read. Dismissing with the close button, Escape, backdrop, or Keep reading for now snoozes automatic invitations for 24 hours. Full reading remains available without registering, including without JavaScript. The footer has a voluntary newsletter invitation. Registered browsers skip automatic prompts.

The obsolete private article endpoint was removed. The signed cookie now remembers registration rather than protecting article content. The API sends registrations to the existing Telegram chat in all environments, and uses `.local/lab-access-secret` for persistent local signing. No marketing subscription is implied or created.

Production reader access requires `LAB_ACCESS_SECRET`; newsletter collection only requires the existing `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. No production registrations were sent during testing. A future email platform can replace that sink. Local preview proxies APIs to the Astro backend on 127.0.0.1:4350. Failure of registration does not block article reading.

Reference consulted: https://developers.google.com/search/docs/appearance/structured-data/paywalled-content . Because the current invitation is optional and every article can be read without registration, isAccessibleForFree is true; no registration-restricted section is claimed.

## Newsletter invitations

Footer and article-end invitations open a separate newsletter mode in the shared dialog. Submitting explicitly agrees to newsletter emails; records have purpose=newsletter and consentVersion=from-the-lab-newsletter-v1. Article-access registrations remain separate and do not acquire newsletter consent. Telegram messages include the email, signup page, UTC timestamp, purpose, and consent version. Success is shown only after Telegram accepts delivery. There is no local-file fallback or email delivery service. Delivery success and failures are tested with a mocked Telegram transport.

## Blog naming

The public label and preferred URL are now Blog across navigation, metadata, article backlinks, and signup copy. Existing `/lab/` URLs redirect permanently to `/blog/`. New Telegram messages use the Blog name and `blog-newsletter-v1`; historical `from-the-lab-newsletter-v1` records keep their original meaning.
