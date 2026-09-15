# Blog design directions

## Selected implementation

The user's supplied screenshot supersedes the earlier editorial interpretation. The implemented Blog uses bold sans-serif typography, compact, equally sized illustrated cards in a three-column desktop grid, warm paper and plum/sage/lavender/lime colors, search, and a dark subscription banner. Original vector artwork is in `src/components/BlogArtwork.astro`. All ten articles remain available. The four approved categories are Agents (3), Costs and Optimization (2), Testing & Evaluation (2), and Security & Privacy (3). Category filters include article counts and combine with search. Tags remain recommendations only in `blog-taxonomy-recommendations.md`.

The research and original proposals below describe the exploration before selection.

## Recommendation

Use **The Editorial Front Page** as the leading direction for 17th Street Labs. It gives the existing writing the presence of a serious publication while keeping several useful articles visible near the top. Borrow the three-topic organization from **The Reading Guide**. Keep **The Visual Index** as the stronger alternative if the studio wants illustration to become a recognizable part of its publishing identity.

All three concepts use the name **Blog**. The design task is to help readers choose something useful, understand the studio’s judgment, and find a natural next step. The blog should earn confidence through specific writing before asking for a conversation or an email address.

These are design proposals, not evidence of improved conversion. No competitor analytics, audience testing, or conversion experiments were available. Research was reviewed on September 14, 2026. Competitor observations come from official pages; recommendations below are design judgments.

## What the current page needs

The current implementation opens with a large introductory section, then an illustrated feature, followed by nine numbered article rows. It has strong headlines and readable excerpts, but the introductory copy delays the first reading decision. After the feature, the repeated rows provide little variation in emphasis. Numbers can also suggest a series or a recommended sequence even though these are independent articles.

The ten existing articles have ten individual category labels. Those labels describe each article accurately, but they do not yet make a useful browsing system. A reader interested in model selection has to scan titles across local models, model economics, infrastructure, and architecture. A small set of broader themes would help the content work as a collection.

The page’s strongest existing material is its specific point of view: cost per completed task, judging AI graders, understanding what an agent is doing, and testing the system around a model. That is more distinctive than a generic promise to publish AI insights. The redesign should expose those subjects quickly.

The repository currently has ten complete, undated articles. The concepts use those real titles and do not invent publication dates, read times, benchmark values, or customer claims. The current palette—warm ivory, aubergine, lavender, lime, and sage—is enough to build a distinctive publication without a separate rebrand.

## Comparable agencies

The comparison set is based on overlapping services and audience, not evidence that these firms directly compete in individual deals. Faculty and deepsense.ai are close applied-AI comparators; HatchWorks is relevant to enterprise AI implementation; thoughtbot is a broader product-engineering comparator.

| Firm | Observed publishing structure | Useful lesson for 17th Street Labs | What to treat cautiously |
| --- | --- | --- | --- |
| Faculty | The Insights landing page distinguishes featured articles, latest articles, and a newsroom. Its visual presentation combines a large typographic introduction with image-led features. | Give selected stories meaningful editorial prominence and separate educational content from company announcements. | Its large opening statement and separate content streams suit a bigger institution. Ten articles do not need a large newsroom architecture. |
| thoughtbot | Its Blog presents topic navigation, article titles, summaries, authors, dates, and an embedded subscription invitation in a readable text-led archive. | Make titles and excerpts do the work. A few broad topics can support navigation without requiring a custom image for every post. | A long continuous feed can flatten priority; the new 17th Street Labs page should still have a deliberate opening selection. |
| HatchWorks AI | Its blog exposes search, categories, tags, and date controls, with content spanning agent engineering and business decisions. | Let readers approach the archive through the problem or vocabulary they already know. | The volume of controls and overlapping tags would be excessive for the current ten-article collection. |
| deepsense.ai | Its applied-AI blog combines technical articles, benchmarks, product updates, and company announcements across a broad category list. | Technical specificity can support an agency’s credibility. Preserve the sharp titles rather than replacing them with vague thought-leadership language. | Its taxonomy includes closely related labels such as LLM, LLM & RAG, and RAG. Avoid reproducing that complexity at a smaller scale. |

Sources: [Faculty Insights](https://faculty.ai/en-gb/insights), [thoughtbot Blog](https://thoughtbot.com/blog), [HatchWorks Blog](https://hatchworks.com/resources/blog/), [deepsense.ai Blog](https://deepsense.ai/blog/). Faculty and thoughtbot were also visually inspected in the browser; the other two comparisons are based on their published page structure and content.

## Lessons from Koto’s work

### Faculty: technical authority through editorial design

Koto’s Faculty case study explicitly connects applied AI with real-world impact. Its identity uses a recurring threshold graphic, custom typography, and editorial layouts. The applications extend from the website into reports and publications. The case-study imagery shows that the system can carry both technical categories and substantial reading material.

**Application to this project:** treat article selection as editorial design. Use strong headline hierarchy, useful whitespace, and a repeatable visual vocabulary. The recommendation is to adopt these principles, not Faculty’s typeface, marks, or exact layouts. Faculty is particularly relevant because it operates in applied AI, rather than being only a visual reference from an unrelated category. [Koto: Faculty](https://koto.com/projects/faculty)

### Coda: organize around what the buyer needs

Koto describes repositioning Coda from payment processing toward a wider enterprise role. The case study says the website is structured around solutions and outcomes, with an Impact section demonstrating value. This Coda is the digital-content commerce company, not the collaborative document product.

**Application to this project:** a blog can begin with the reader’s decision—choose a model, build a reliable agent, keep a system safe—and then present the relevant writing. That is the basis of the Reading Guide concept. It is a proposed translation of the strategy, not a claim that Koto designed this exact blog structure. [Koto: Coda](https://koto.com/projects/coda)

### Stack Overflow: one flexible graphic system

Koto describes a visual language derived from Stack Overflow’s logo geometry, supported by a generative tool. Its digital system varies in intensity: quieter inside the product, more expressive in campaigns and editorial material. Its voice aims for clear language with human wit.

**Application to this project:** use a small family of original engineering-themed shapes for covers, rather than commissioning unrelated images for every post. Turn down visual intensity on reading pages. This gives the Visual Index a sustainable art direction while protecting the article experience. The Stack Overflow case-study text was inspected; some embedded media did not play, so no detailed motion behavior is inferred from those videos. [Koto: Stack Overflow](https://koto.com/projects/stack-overflow)

### Kit: typography can carry personality

Hot Type documents its collaboration with Koto on Kit Sans. Kit’s own brand page describes the custom headline type alongside Libre Franklin body text and a focused color system. This provides a useful cross-check on the earlier Koto/ConvertKit reference without relying on an unavailable Koto Kit project page.

**Application to this project:** establish one memorable display voice and one comfortable reading voice. The blog does not need decorative effects everywhere to feel distinctive. The Editorial Front Page explores a serif display option; the other concepts retain a more direct sans-serif voice. These are proposed font roles, not a recommendation to copy or license Kit’s proprietary face. [Hot Type: Kit](https://www.hottype.co/projects/kit), [Kit Brand](https://kit.com/brand)

### Koto’s own website: design with real content

Koto’s development partner ON describes prototyping layouts with real content and using modular architecture to preserve editorial flexibility. It also discusses responsive imagery and performance for a media-rich portfolio.

**Application to this project:** test the long benchmark headline, short model headline, and text-only posts before choosing the layout. Make the page work when there is no new hero image available. A visual system should make publishing easier, not force each article through a separate design project. [ON: Koto](https://madebyon.com/case-studies/koto/)

## Concept 1: The Editorial Front Page

**Structure:** compact Blog masthead → one lead story and two supporting stories → broad topic navigation → two-column archive → subscription invitation.

The opening selection gives readers three useful entry points at once. The strongest broad-interest field report anchors the page, while local models and model economics act as shorter alternatives. A quieter two-column archive follows. Fine rules and a restrained display serif provide an editorial tone; the existing sans-serif remains appropriate for navigation and summaries.

**Why it fits:** the writing already has distinct, opinionated headlines. This structure turns that strength into a recognizable publication and makes the page feel considered without requiring a large catalog. It has the best balance of brand character, reading clarity, and maintenance effort.

**Mobile behavior:** masthead, lead story, then the two supporting stories in reading order. Images sit below or beside text depending on available width; no overlay headlines on small screens. Topic links wrap. Archive entries become a single column.

**Motion:** one short entrance for the opening article group; restrained arrow movement on links. Avoid separately animating every title, caption, and thumbnail.

**Tradeoff:** someone needs to choose the lead and supporting stories. That editorial choice should be explicit rather than permanently treating array position as importance. A feature image is useful but should not be required.

## Concept 2: The Reading Guide

**Structure:** Blog masthead → three problem links → three curated reading chapters → complete archive link → contextual contact invitation.

The chapters are “Choose a model,” “Build a reliable agent,” and “Keep it safe.” Each chapter begins with one recommended article, followed by related reading. Chapter numbers indicate topic groups; individual articles are not numbered. The page answers “Where should I start?” before it answers “What was published most recently?”

**Why it fits:** the agency sells judgment and implementation around difficult systems. A problem-led route connects the writing to that work while staying useful to readers who are not ready to contact the team.

**Mobile behavior:** the three topic links become wrapping anchor links at the top. The chapter rail moves above its articles. All text remains in the document; this is not a tabbed interface that hides most of the collection.

**Motion:** a short entrance at each chapter break, with stable anchor targets and reduced-motion support. No pinned scrolling narrative or automatic topic switching.

**Tradeoff:** new posts need a place in the reading path, and multidisciplinary posts may belong to more than one topic. Keep a complete archive available so curation does not bury older work.

## Concept 3: The Visual Index

**Structure:** compact Blog masthead → topic navigation and optional search → asymmetric cover grid → archive continuation → subscription strip.

Original covers use the same family of blocks, frames, balances, and measurement motifs. The first story spans two columns; the rest settle into a repeatable grid. Titles and categories remain selectable HTML in an implementation, even when the mockup treats them as cover typography. Graphics do not contain fake benchmark data.

**Why it fits:** it would give 17th Street Labs the most immediately recognizable publishing surface and produce a consistent family of social previews. It connects naturally to the existing geometric illustrations on the services page.

**Mobile behavior:** the feature becomes one column, followed by a vertical series of covers and titles. All article names remain fully readable. Search is optional at the current collection size and should only appear if it works well.

**Motion:** a minimal crop or arrow shift on hover; a brief entrance for a row as it arrives. No animated art on every cover, no masonry reordering, and no compulsory motion to reveal a title.

**Tradeoff:** this has the highest ongoing art-direction cost. A reusable cover template and a graceful text-only fallback are prerequisites, otherwise quality will become uneven as the archive grows.

## Proposed content grouping

| Reader theme | Existing articles |
| --- | --- |
| Models & cost | We Burned Thousands of Dollars Testing AI Models. Here’s What We Learned.; Small Models. Serious Work.; The Cheap Model Can Get Expensive.; Before You Buy the GPU. |
| Agents & evals | One Harness Does Not Fit Every Model.; Your AI Judge Needs to Be Judged, Too.; Your Tests Passed. Your Interface Didn’t. |
| Security & privacy | The Attackers Are Getting Agents, Too.; Some Data Doesn’t Get to Leave.; The Agent Is Working. Does Anyone Know What It’s Doing? |

These are proposed primary categories, not changes to the published articles. Secondary tags can preserve more specific labels. The model-testing field report could also appear in an Agents & evals reading path.

## Naming and implementation boundaries

The immediate code change replaces the public-facing name with Blog in navigation, footer, article backlinks, page metadata, signup copy, and new Telegram notification text. New signup records use `blog-newsletter-v1` to match the displayed wording; historical consent records are not rewritten.

Existing `/lab/` and article URLs remain intact. A name change does not require breaking links or introducing a route migration. If `/blog/` becomes the preferred address later, migrate with permanent redirects and updated canonicals, internal links, and sitemap entries as one coordinated change.

The three images are concept mockups only. None of the proposed page structures has replaced the existing blog layout. Newsletter collection continues to use the configured Telegram destination; the research does not propose adopting a mailing platform.

## Selection criteria

Choose the Editorial Front Page if the priority is a premium publication that is easy to maintain. Choose the Reading Guide if the priority is helping technical buyers find a useful starting point. Choose the Visual Index if the priority is a distinctive visual publishing identity and the team is willing to maintain a cover system.

Before implementation, test the preferred structure at mobile width with all ten real titles, keyboard navigation, reduced motion, and no JavaScript. Verify that every post remains discoverable and that the subscription and conversation invitations remain separate choices. Use article-open and topic-navigation behavior to assess the eventual design; no conversion lift is assumed here.

## Sources

All accessed September 14, 2026. Dates below identify project years where explicitly supplied; continuously updated pages are marked undated.

1. Koto. [Faculty](https://koto.com/projects/faculty). Project dated 2024. Brand strategy, editorial layouts, typography, and publication applications.
2. Koto. [Coda](https://koto.com/projects/coda). Project dated 2025. Enterprise positioning and solutions/outcomes architecture.
3. Koto. [Stack Overflow](https://koto.com/projects/stack-overflow). Project dated 2026. Modular graphics, contextual visual intensity, typography, and tone.
4. Hot Type. [Kit](https://www.hottype.co/projects/kit). Undated. Direct account of its typography collaboration with Koto.
5. Kit. [Kit Brand Assets](https://kit.com/brand). Undated. Official typography and color system.
6. ON. [Koto](https://madebyon.com/case-studies/koto/). Undated. Real-content prototyping, modularity, and performance principles.
7. Faculty. [Insights, News & Updates](https://faculty.ai/en-gb/insights). Continuously updated. Current publishing structure and visual presentation.
8. thoughtbot. [Giant Robots: thoughtbot Blog](https://thoughtbot.com/blog). Continuously updated. Topic navigation, article metadata, readable archive, and subscription placement.
9. HatchWorks AI. [Blog](https://hatchworks.com/resources/blog/). Continuously updated. Search, taxonomy, date filters, and enterprise AI subject matter.
10. deepsense.ai. [Applied AI Experts Blog](https://deepsense.ai/blog/). Continuously updated. Applied-AI content coverage and archive taxonomy.
11. Koto. [De-extinction](https://koto.com/projects/de-extinction). Project dated 2023. Additional contrast reference: expressive category differentiation; its provocative illustration approach was not adopted for the senior engineering audience.

The local implementation and article inventory were reviewed in `src/pages/lab.astro`, `src/data/lab.ts`, `src/layouts/Article.astro`, and the shared layout and signup components.
