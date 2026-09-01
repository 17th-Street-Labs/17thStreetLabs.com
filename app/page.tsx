"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Braces, Menu, ShieldCheck, Sparkles, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type View = "home" | "services" | "about" | "contact";

const services = [
  { number: "01", title: "Agentic systems", tag: "BUILD", detail: "Architecture and production engineering for multi-agent workflows, tool use, memory, orchestration, and human oversight.", outcome: "From impressive demo to dependable operating system." },
  { number: "02", title: "AI security", tag: "DEFEND", detail: "Threat modeling, adversarial testing, red teaming, permissions, control design, and operational defenses for systems that reason and act.", outcome: "Know how the system breaks before an attacker does." },
  { number: "03", title: "Evals & assurance", tag: "PROVE", detail: "Curated datasets, evaluation architecture, judges, failure taxonomies, study contracts, and measurable improvement loops.", outcome: "Replace launch anxiety with decision-quality evidence." },
  { number: "04", title: "Technical advisory", tag: "LEAD", detail: "Architecture direction, build-vs-buy decisions, platform strategy, executive counsel, and hands-on enablement for senior teams.", outcome: "Move faster without mortgaging the system." },
];

function Mark() {
  return <span className="brand-mark" aria-hidden="true"><i>1</i><i>7</i><b /></span>;
}

function LightRays() {
  return <div className="light-rays" aria-hidden="true"><i /><i /><i /><i /><i /></div>;
}

function MagneticButton({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const move = (event: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(event.clientX - r.left - r.width / 2) * .14}px, ${(event.clientY - r.top - r.height / 2) * .14}px)`;
  };
  return <button ref={ref} className={`magnetic ${className}`} onMouseMove={move} onMouseLeave={() => { if (ref.current) ref.current.style.transform = "translate(0,0)"; }} onClick={onClick}>{children}</button>;
}

function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const move = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };
  return <article className={`spotlight-card ${className}`} onMouseMove={move}>{children}</article>;
}

function ContactDialog({ children }: { children: ReactNode }) {
  return <Dialog><DialogTrigger asChild>{children}</DialogTrigger><DialogContent className="contact-dialog sm:max-w-2xl"><DialogHeader><span className="micro">NEW ENGAGEMENT</span><DialogTitle>What hard problem are you carrying?</DialogTitle><DialogDescription>Give us the useful version: what you are building, what is uncertain, and what happens if it fails.</DialogDescription></DialogHeader><form onSubmit={e => e.preventDefault()}><div className="form-row"><label>Name<input placeholder="Your name" /></label><label>Work email<input type="email" placeholder="you@company.com" /></label></div><label>Focus<select defaultValue=""><option value="" disabled>Select an area</option><option>Agentic systems</option><option>AI security</option><option>Evals & assurance</option><option>Technical advisory</option></select></label><label>Context<textarea rows={5} placeholder="What are you building?" /></label><button type="submit" className="submit-button">Send the brief <ArrowUpRight size={17} /></button><small>Concept form. Connect a form endpoint before public launch.</small></form></DialogContent></Dialog>;
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (next: View) => { setView(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return <main className="prism-site">
    <LightRays />
    <header className="topbar"><button className="brand" onClick={() => navigate("home")}><Mark /><span>17th Street Labs</span></button><nav className={menuOpen ? "open" : ""}>{(["home", "services", "about", "contact"] as View[]).map(item => <button key={item} className={view === item ? "active" : ""} onClick={() => navigate(item)}>{item}</button>)}</nav><ContactDialog><MagneticButton className="header-cta">Start a conversation <ArrowUpRight size={15} /></MagneticButton></ContactDialog><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button></header>
    <div className="page-wrap" key={view}>
      {view === "home" && <HomeView navigate={navigate} />}
      {view === "services" && <ServicesView navigate={navigate} />}
      {view === "about" && <AboutView />}
      {view === "contact" && <ContactView />}
    </div>
    <Footer navigate={navigate} />
  </main>;
}

function HomeView({ navigate }: { navigate: (v: View) => void }) {
  return <>
    <section className="hero-section">
      <div className="hero-copy"><div className="status-pill"><span /> Accepting select Q4 engagements</div><h1 className="split-heading"><span>Engineering intelligence.</span><span>Securing <em>agency.</em></span></h1><p>We design, attack, evaluate, and ship consequential AI systems for leaders who need more than a convincing prototype.</p><div className="hero-actions"><ContactDialog><MagneticButton className="button-primary">Bring us the hard problem <ArrowUpRight size={18} /></MagneticButton></ContactDialog><MagneticButton className="button-quiet" onClick={() => navigate("services")}>Explore capabilities <ArrowRight size={18} /></MagneticButton></div></div>
      <div className="prism-object" aria-hidden="true"><div className="prism-core"><span>17</span></div><div className="orbit orbit-one"><i /></div><div className="orbit orbit-two"><i /></div><div className="orbit orbit-three"><i /></div><span className="signal-label l1">EVAL / 99.7</span><span className="signal-label l2">CONTROL / ACTIVE</span><span className="signal-label l3">AGENT / 07</span></div>
      <div className="hero-index"><span>INDEPENDENT AI LAB + ADVISORY</span><span>DENVER · WORKING GLOBALLY</span></div>
    </section>
    <Marquee />
    <section className="premise-section"><div className="section-label"><span>01</span> THE PREMISE</div><div><h2>Agency changes<br />the risk model.</h2><p>When software can plan, choose tools, spend resources, and act on someone’s behalf, every abstraction becomes a trust boundary. We help teams make those boundaries explicit, testable, and resilient.</p><button className="text-link" onClick={() => navigate("services")}>How we work <ArrowUpRight size={16} /></button></div></section>
    <section className="capability-section"><div className="section-heading"><div className="section-label"><span>02</span> CAPABILITIES</div><h2>Four ways into the problem.</h2></div><div className="bento-grid">{services.map((service, index) => <SpotlightCard key={service.title} className={index === 0 ? "featured" : ""}><div className="card-top"><span>{service.number}</span><b>{service.tag}</b></div><div className="card-icon">{index === 1 ? <ShieldCheck /> : index === 2 ? <Sparkles /> : <Braces />}</div><h3>{service.title}</h3><p>{service.detail}</p><button onClick={() => navigate("services")} aria-label={`Learn about ${service.title}`}><ArrowUpRight /></button></SpotlightCard>)}</div></section>
    <section className="research-feature"><div className="research-visual" aria-hidden="true"><div className="scan-grid"/><span className="scan-line"/><div className="finding f1"><i/>prompt boundary</div><div className="finding f2"><i/>tool escalation</div><div className="finding f3"><i/>evidence captured</div></div><div className="research-copy"><div className="section-label"><span>03</span> FIELD WORK</div><span className="micro">INDEPENDENT RESEARCH</span><h2>ExploitHunter</h2><p>A live research platform for studying how models discover, reason through, and communicate security findings across long-running attack workflows.</p><ul><li>Capability and cost-efficiency studies</li><li>Purpose-built findings graph</li><li>Eval and judge-driven tuning loops</li></ul><a href="https://exploithunter.app" target="_blank" rel="noreferrer">Explore the research <ArrowUpRight size={17}/></a></div></section>
    <section className="closing-cta"><span className="micro">THE NEXT SYSTEM</span><h2>Make it ambitious.<br /><em>Make it defensible.</em></h2><ContactDialog><MagneticButton className="button-primary">Start a conversation <ArrowUpRight size={18}/></MagneticButton></ContactDialog></section>
  </>;
}

function Marquee() {
  const words = ["AGENTIC SYSTEMS", "AI SECURITY", "EVALUATION", "ASSURANCE", "PRODUCT ENGINEERING"];
  return <div className="marquee" aria-label={words.join(", ")}><div>{[...words, ...words].map((word, i) => <span key={`${word}-${i}`}>{word}<i>✦</i></span>)}</div></div>;
}

function ServicesView({ navigate }: { navigate: (v: View) => void }) {
  return <><section className="interior-hero"><div className="section-label"><span>01</span> SERVICES</div><h1>Senior leverage,<br /><em>at the fault line.</em></h1><p>We enter where capability, uncertainty, and consequence meet. Every engagement is led hands-on by senior practitioners.</p></section><section className="service-list">{services.map(service => <SpotlightCard key={service.title} className="service-row"><span className="service-number">{service.number}</span><div><span className="micro">{service.tag}</span><h2>{service.title}</h2></div><div><p>{service.detail}</p><b>{service.outcome}</b></div><ArrowUpRight /></SpotlightCard>)}</section><section className="engagement-model"><div className="section-label"><span>02</span> ENGAGEMENT MODEL</div><div><h2>Clarity before ceremony.</h2><Accordion type="single" collapsible defaultValue="item-1"><AccordionItem value="item-1"><AccordionTrigger>01 · Frame the consequential question</AccordionTrigger><AccordionContent>We identify the decision, failure mode, or capability that matters. Success criteria are explicit before implementation expands.</AccordionContent></AccordionItem><AccordionItem value="item-2"><AccordionTrigger>02 · Build the smallest credible proof</AccordionTrigger><AccordionContent>Architecture, research, and evaluation proceed together. Evidence arrives early enough to change direction.</AccordionContent></AccordionItem><AccordionItem value="item-3"><AccordionTrigger>03 · Harden what survives contact</AccordionTrigger><AccordionContent>We pressure-test the system, turn findings into controls, and transfer the operating capability to your team.</AccordionContent></AccordionItem></Accordion></div></section><section className="closing-cta compact"><h2>Need a precise engagement?</h2><MagneticButton className="button-primary" onClick={() => navigate("contact")}>Tell us what is stuck <ArrowRight size={18}/></MagneticButton></section></>;
}

function AboutView() {
  return <><section className="interior-hero about-hero"><div className="section-label"><span>01</span> THE LAB</div><h1>Experience without<br /><em>the institution.</em></h1><p>17th Street Labs is a senior-led AI engineering and security practice. Small by design, direct by default, and built for work where judgment matters.</p></section><section className="numbers"><div><b>25+</b><span>years engineering and leading systems</span></div><div><b>5</b><span>unicorn environments informed by experience</span></div><div><b>250k/s</b><span>events at scale in prior platform work</span></div><div><b>1:1</b><span>senior attention, from framing through transfer</span></div></section><section className="principles-section"><div className="section-label"><span>02</span> OPERATING PRINCIPLES</div><div className="principle-stack"><div><span>01</span><h3>Evidence over theater.</h3><p>A fluent demo is not a reliable system. We design measurement that can survive scrutiny.</p></div><div><span>02</span><h3>Security is architecture.</h3><p>Permissions, boundaries, data flows, and failure recovery belong in the design, not the launch checklist.</p></div><div><span>03</span><h3>Capability must transfer.</h3><p>The engagement compounds when your team leaves with sharper systems and stronger judgment.</p></div></div></section><section className="founders"><div className="section-label"><span>03</span> PRINCIPALS</div><div className="founder-grid"><SpotlightCard><div className="founder-monogram">DL</div><span className="micro">ENGINEERING · RESEARCH · SECURITY</span><h2>Dan Levy</h2><p>Engineer, educator, founder, and technical leader focused on agentic architectures, evaluation systems, AI security, and high-leverage engineering organizations.</p><a href="mailto:dan@17thstreetlabs.com">dan@17thstreetlabs.com <ArrowUpRight size={15}/></a></SpotlightCard><SpotlightCard><div className="founder-monogram marina">M</div><span className="micro">STRATEGY · OPERATIONS · PARTNERSHIPS</span><h2>Marina</h2><p>Turning ambitious ideas into clear engagements, durable client partnerships, and work that creates measurable value.</p><a href="mailto:marina@17thstreetlabs.com">marina@17thstreetlabs.com <ArrowUpRight size={15}/></a></SpotlightCard></div><small className="draft-note">Draft contact addresses. Confirm before public launch.</small></section></>;
}

function ContactView() {
  return <section className="contact-view"><div><div className="section-label"><span>01</span> CONTACT</div><h1>Bring the<br /><em>hard problem.</em></h1><p>Tell us what you are building, where confidence breaks down, and what a meaningful result would change.</p><div className="contact-people"><span>GENERAL</span><a href="mailto:hello@17thstreetlabs.com">hello@17thstreetlabs.com</a><span>DAN LEVY</span><a href="mailto:dan@17thstreetlabs.com">dan@17thstreetlabs.com</a><span>MARINA</span><a href="mailto:marina@17thstreetlabs.com">marina@17thstreetlabs.com</a></div><small className="draft-note">Draft contact addresses. Confirm before public launch.</small></div><SpotlightCard className="contact-panel"><span className="micro">START HERE</span><h2>Three useful sentences are enough.</h2><form onSubmit={e => e.preventDefault()}><label>Name<input placeholder="Your name" /></label><label>Work email<input type="email" placeholder="you@company.com" /></label><label>What is at stake?<textarea rows={6} placeholder="The system, the uncertainty, and the consequence." /></label><button className="submit-button" type="submit">Send the brief <ArrowUpRight size={17}/></button><small>Concept form. Connect a form endpoint before public launch.</small></form></SpotlightCard></section>;
}

function Footer({ navigate }: { navigate: (v: View) => void }) {
  return <footer><div><button className="brand" onClick={() => navigate("home")}><Mark/><span>17th Street Labs</span></button><p>Engineering intelligence.<br/>Securing agency.</p></div><div className="footer-nav">{(["home", "services", "about", "contact"] as View[]).map(item => <button key={item} onClick={() => navigate(item)}>{item}</button>)}</div><div className="footer-meta"><span>DENVER · WORKING GLOBALLY</span><span>© 2026 17TH STREET LABS</span></div></footer>;
}
