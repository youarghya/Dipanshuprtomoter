import React, { useEffect, useRef, useState } from 'react';
import { useStore, uid } from './store.jsx';

const NAV = [
  ['Projects', '#projects'],
  ['Expertise', '#expertise'],
  ['About', '#about'],
  ['Approach', '#approach'],
  ['Contact', '#contact'],
];

const IMG_FALLBACK =
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=85';

function Arrow({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 21V6.5a1.5 1.5 0 0 1 1.5-1.5H13v16M13 21h6.5a.5.5 0 0 0 .5-.5V11a1 1 0 0 0-1-1h-6M8 9h2M8 13h2M8 17h2M16 14h1.5M16 18h1.5M3 21h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BridgeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 18h20M4 18v-5M20 18v-5M4 13c4.5 0 8-5 8-8 0 3 3.5 8 8 8M8 18v-3M12 18v-4M16 18v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9" y="3" width="6" height="4" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m8.5 13 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LandmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9.5 12 4l9 5.5M4 21h16M6 21v-8M10 21v-8M14 21v-8M18 21v-8M3 13h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CAP_ICONS = [<BuildingIcon />, <BridgeIcon />, <ClipboardIcon />, <LandmarkIcon />];

function Reveal({ children, delay = 0, className = '', as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'in' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1300;
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return <span ref={ref}>{value}{suffix}</span>;
}

function Lines({ text }) {
  return String(text || '')
    .split('\n')
    .map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 ? <br /> : null}
      </React.Fragment>
    ));
}

export default function App() {
  const { data, theme, addEnquiry } = useStore();
  const { brand, hero, about, expertise, approach, contact, footer, marquee, projectsSection, cta } = data;
  const PROJECTS = data.projects || [];

  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const closeRef = useRef(null);

  const filters = ['All', ...new Set(PROJECTS.map((p) => p.sector).filter(Boolean))];
  const currentFilter = filters.includes(filter) ? filter : 'All';
  const shownProjects =
    currentFilter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.sector === currentFilter);
  const sectorCount = new Set(PROJECTS.map((p) => p.sector).filter(Boolean)).size;
  const featured = PROJECTS.find((p) => p.featured) || PROJECTS[0];

  useEffect(() => {
    document.title = 'Dipanshu Promoter & Builder | Building What Matters';
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      setScrolled(window.scrollY > 24);
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? (doc.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu || active ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menu, active]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenu(false);
        setActive(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (active) closeRef.current?.focus();
  }, [active]);

  const submit = (e) => {
    e.preventDefault();
    addEnquiry({
      id: uid('enq'),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
      date: new Date().toISOString(),
      status: 'new',
    });
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="site" style={theme}>
      <div className="progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />

      <header className={`header ${scrolled ? 'scrolled' : ''} ${menu ? 'menu-open' : ''}`}>
        <div className="wrap">
          <div className="nav-shell">
            <a className="brand" href="#home" onClick={() => setMenu(false)}>
              <span className="brand-mark"><img src={brand.logo} alt="" /></span>
              <span className="brand-name">{brand.name}<small>{brand.sub}</small></span>
            </a>

            <nav className={`nav-links ${menu ? 'open' : ''}`} id="primary-nav" aria-label="Primary">
              {NAV.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setMenu(false)}>{label}</a>
              ))}
              <a className="nav-cta" href="#contact" onClick={() => setMenu(false)}>
                Discuss a project <Arrow size={14} />
              </a>
            </nav>

            <button
              className="menu-toggle"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menu}
              aria-controls="primary-nav"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div
            className="hero-bg"
            style={hero.image ? { backgroundImage: `url("${hero.image}")` } : undefined}
            aria-hidden="true"
          />
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="orb orb-a" aria-hidden="true" />
          <div className="orb orb-b" aria-hidden="true" />

          <div className="wrap hero-inner">
            <div className="hero-copy">
              <Reveal className="hero-badge">
                <span className="pulse" aria-hidden="true" /> {hero.badge} <i /> {hero.location}
              </Reveal>
              <Reveal delay={90}>
                <h1>{hero.title}<br /><em>{hero.titleAccent}</em></h1>
              </Reveal>
              <Reveal delay={180}>
                <p className="hero-lead">{hero.lead}</p>
              </Reveal>
              <Reveal delay={260} className="hero-actions">
                <a className="btn btn-primary" href={hero.primaryHref}>
                  {hero.primaryCta} <span className="btn-arrow"><Arrow /></span>
                </a>
                <a className="text-link" href={hero.secondaryHref}>
                  {hero.secondaryCta} <span className="text-link-arrow">↓</span>
                </a>
              </Reveal>
            </div>

            {featured ? (
              <a className="hero-project" href="#featured">
                <span className="hero-project-img">
                  <img src={featured.img || IMG_FALLBACK} alt="" />
                </span>
                <span className="hero-project-copy">
                  <span>{projectsSection.featuredLabel}</span>
                  <b>{featured.title}</b>
                  <small>{featured.sector} · {featured.location}</small>
                </span>
                <Arrow size={16} />
              </a>
            ) : null}

            <Reveal delay={360} className="hero-foot">
              <div className="hero-stat">
                <b>{String(PROJECTS.length).padStart(2, '0')} references</b>
                <span>Across sectors and scales</span>
              </div>
              <div className="hero-stat">
                <b>{String(sectorCount).padStart(2, '0')} sectors</b>
                <span>From civic to commercial</span>
              </div>
              <div className="hero-stat">
                <b>{brand.since}</b>
                <span>Building with purpose in Ranchi</span>
              </div>
              <a className="scroll-cue" href="#featured">
                <span className="scroll-line" aria-hidden="true" /> Scroll to explore
              </a>
            </Reveal>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...marquee, ...marquee].map((item, i) => (
              <span key={i}>{item}<i>✦</i></span>
            ))}
          </div>
        </div>

        {featured ? (
          <section className="featured" id="featured">
            <div className="wrap">
              <Reveal className="featured-panel">
                <div className="featured-media">
                  <img src={featured.img || IMG_FALLBACK} alt={featured.title} />
                  <span className="featured-flag">{projectsSection.featuredLabel}</span>
                  <span className="featured-index">
                    {featured.n || '01'} / {String(PROJECTS.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="featured-body">
                  <span className="eyebrow light"><i />{projectsSection.featuredKicker}</span>
                  <h2>{featured.title}</h2>
                  <p>{featured.long || featured.desc}</p>

                  <div className="featured-facts">
                    <div><span>Location</span><b>{featured.location}</b></div>
                    <div><span>Sector</span><b>{featured.sector}</b></div>
                    <div><span>Status</span><b>{featured.status}</b></div>
                    <div><span>Year</span><b>{featured.year}</b></div>
                  </div>

                  <button type="button" className="btn btn-gold" onClick={() => setActive(featured)}>
                    View project <span className="btn-arrow"><Arrow /></span>
                  </button>
                </div>
              </Reveal>
            </div>
          </section>
        ) : null}

        <section className="section projects" id="projects">
          <div className="wrap">
            <div className="section-head">
              <div>
                <Reveal className="eyebrow"><i />{projectsSection.label}</Reveal>
                <Reveal delay={80} as="h2">{projectsSection.title} <em>{projectsSection.titleAccent}</em></Reveal>
              </div>
              <Reveal delay={160} as="p" className="section-sub">
                {projectsSection.subtitle}
              </Reveal>
            </div>

            {filters.length > 1 ? (
              <Reveal className="filters" role="group" aria-label="Filter projects by sector">
                {filters.map((f) => {
                  const count = f === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.sector === f).length;
                  return (
                    <button
                      key={f}
                      type="button"
                      className={`filter ${currentFilter === f ? 'active' : ''}`}
                      aria-pressed={currentFilter === f}
                      onClick={() => setFilter(f)}
                    >
                      {f} <span>{count}</span>
                    </button>
                  );
                })}
              </Reveal>
            ) : null}

            {shownProjects.length ? (
              <div className="project-grid">
                {shownProjects.map((p, i) => (
                  <article className="project-card" key={`${currentFilter}-${p.id}`} style={{ animationDelay: `${i * 60}ms` }}>
                    <button
                      type="button"
                      className="project-image"
                      onClick={() => setActive(p)}
                    >
                      <img src={p.img || IMG_FALLBACK} alt={p.title} loading="lazy" />
                      <span className="project-shade" aria-hidden="true" />
                      <span className="project-status">{p.status}</span>
                      <span className="project-tag">{p.n}</span>
                      <span className="project-go" aria-hidden="true"><Arrow size={18} /></span>
                    </button>

                    <div className="project-meta">
                      <span>{p.sector}</span>
                      <span className="project-loc">{String(p.location || '').split(',')[0]} · {p.year}</span>
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <button type="button" className="project-link" onClick={() => setActive(p)}>
                      View project <Arrow size={13} />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className="portfolio-note" style={{ marginTop: 0 }}>
                Projects will appear here as soon as they are added in the management console.
              </p>
            )}

            {projectsSection.note ? <p className="portfolio-note">{projectsSection.note}</p> : null}
          </div>
        </section>

        <section className="section about" id="about">
          <div className="wrap">
            <div className="about-head">
              <Reveal className="eyebrow"><i />{about.label}</Reveal>
              <Reveal delay={80} as="h2">
                {about.title} <em>{about.titleAccent}</em>
              </Reveal>
              <Reveal delay={160} className="about-intro">
                <p className="lead">{about.lead}</p>
                <p>{about.body}</p>
              </Reveal>
            </div>

            <div className="bento">
              <Reveal className="bento-img">
                <img src={about.image} alt="Architect drawing building plans on a drafting table" />
                <div className="bento-img-shade" aria-hidden="true" />
                <div className="bento-caption">
                  <span>{about.captionTag}</span>
                  <b>{about.caption}</b>
                </div>
              </Reveal>

              <div className="bento-side">
                <Reveal delay={90} className="bento-card bento-dark">
                  <span className="bento-kicker">Our promise</span>
                  <h3>{about.promiseTitle}</h3>
                  <p>{about.promiseBody}</p>
                  <a className="under-link" href="#approach">The way we work <Arrow size={14} /></a>
                </Reveal>

                <Reveal delay={150} className="bento-card bento-stat">
                  <b><Counter to={Number(about.years) || 0} suffix="+" /></b>
                  <span>{about.yearsLabel}</span>
                </Reveal>

                <Reveal delay={210} className="bento-card bento-quality">
                  <div className="mini-icon"><ClipboardIcon /></div>
                  <b>{about.qualityTitle}</b>
                  <span>{about.qualityBody}</span>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section className="section expertise" id="expertise">
          <div className="expertise-glow" aria-hidden="true" />
          <div className="wrap">
            <div className="section-head">
              <div>
                <Reveal className="eyebrow light"><i />{expertise.label}</Reveal>
                <Reveal delay={80} as="h2">{expertise.title} <em>{expertise.titleAccent}</em></Reveal>
              </div>
              <Reveal delay={160} as="p" className="section-sub">
                {expertise.subtitle}
              </Reveal>
            </div>

            <div className="cap-grid">
              {expertise.items.map((c, i) => (
                <Reveal key={`${c.title}-${i}`} delay={i * 90} className="cap-card">
                  <div className="cap-top">
                    <span className="cap-icon">{CAP_ICONS[i % CAP_ICONS.length]}</span>
                    <span className="cap-num">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <span className="cap-link" aria-hidden="true"><Arrow size={18} /></span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section approach" id="approach">
          <div className="wrap approach-grid">
            <div className="approach-intro">
              <Reveal className="eyebrow"><i />{approach.label}</Reveal>
              <Reveal delay={80} as="h2">{approach.title} <em>{approach.titleAccent}</em></Reveal>
              <Reveal delay={160} as="p" className="approach-lead">
                {approach.lead}
              </Reveal>
              <Reveal delay={240}>
                <a className="btn btn-outline" href="#contact">
                  Start a conversation <span className="btn-arrow"><Arrow /></span>
                </a>
              </Reveal>
            </div>

            <div className="steps">
              {approach.steps.map((step, i) => (
                <Reveal key={`${step.title}-${i}`} delay={i * 80} className="step">
                  <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                  <span className="step-mark" aria-hidden="true">↗</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="wrap">
            <Reveal className="cta-inner">
              <div className="cta-rings" aria-hidden="true" />
              <div>
                <span className="eyebrow light"><i />{cta.label}</span>
                <h2>{cta.title} <em>{cta.titleAccent}</em></h2>
              </div>
              <a className="btn btn-gold" href="#contact">
                {cta.button} <span className="btn-arrow"><Arrow /></span>
              </a>
            </Reveal>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="wrap contact-grid">
            <div className="contact-copy">
              <Reveal className="eyebrow"><i />{contact.label}</Reveal>
              <Reveal delay={80} as="h2">{contact.title} <em>{contact.titleAccent}</em></Reveal>
              <Reveal delay={160} as="p">{contact.lead}</Reveal>

              <Reveal delay={220} className="contact-cards">
                <div className="contact-card">
                  <span>{contact.officeLabel}</span>
                  <b><Lines text={contact.address} /></b>
                </div>
                <div className="contact-card">
                  <span>{contact.hoursLabel}</span>
                  <b><Lines text={contact.hours} /></b>
                </div>
              </Reveal>

              <Reveal delay={280}>
                <a className="under-link" href={contact.website} target="_blank" rel="noreferrer">
                  Visit current website <Arrow size={14} />
                </a>
              </Reveal>
            </div>

            <Reveal delay={120} className="contact-form-wrap">
              <form className="contact-form" onSubmit={submit}>
                {sent ? (
                  <div className="success">
                    <div className="success-icon">✓</div>
                    <h3>Thank you for reaching out.</h3>
                    <p>
                      Your enquiry has been saved to the management console. The team can review it
                      from the admin dashboard.
                    </p>
                    <button type="button" className="under-link" onClick={() => setSent(false)}>
                      Send another enquiry <Arrow size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="form-title">
                      <span>Project enquiry</span>
                      <b>Let’s get started.</b>
                    </div>
                    <div className="form-row">
                      <label>
                        Name
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name"
                          autoComplete="name"
                        />
                      </label>
                      <label>
                        Email address
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@company.com"
                          autoComplete="email"
                        />
                      </label>
                    </div>
                    <label>
                      Phone <small>(optional)</small>
                      <input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91"
                        autoComplete="tel"
                      />
                    </label>
                    <label>
                      Tell us about your project
                      <textarea
                        required
                        rows="4"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="A little about your requirements…"
                      />
                    </label>
                    <button className="btn btn-primary btn-block" type="submit">
                      Send enquiry <span className="btn-arrow"><Arrow /></span>
                    </button>
                    <small className="form-disclaimer">
                      Demo build — your enquiry is saved in this browser and appears in the admin
                      dashboard. It is not sent by email or to a server.
                    </small>
                  </>
                )}
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="footer-top-row">
            <a className="brand footer-brand" href="#home">
              <span className="brand-mark"><img src={brand.logo} alt="" /></span>
              <span className="brand-name">{brand.name}<small>{brand.sub}</small></span>
            </a>
            <p><Lines text={footer.tagline} /></p>
            <a className="footer-top" href="#home">Back to top ↑</a>
          </div>

          <div className="footer-wordmark" aria-hidden="true">
            <img src={brand.banner} alt="" />
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {brand.legal}</span>
            <div className="footer-links">
              {NAV.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
              <a href="#/admin" className="footer-admin-link">Management</a>
            </div>
            <span>{footer.note}</span>
          </div>
        </div>
      </footer>

      {active && (
        <div
          className="project-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setActive(null); }}
        >
          <div className="project-modal-panel">
            <button
              type="button"
              className="project-modal-close"
              onClick={() => setActive(null)}
              aria-label="Close project details"
              ref={closeRef}
            >
              ✕
            </button>

            <div className="project-modal-media">
              <img src={active.img || IMG_FALLBACK} alt={active.title} />
              <span className="project-status">{active.status}</span>
            </div>

            <div className="project-modal-body">
              <span className="eyebrow"><i />{active.sector}</span>
              <h2 id="project-modal-title">{active.title}</h2>
              <p>{active.long || active.desc}</p>

              <div className="modal-facts">
                <div><span>Location</span><b>{active.location}</b></div>
                <div><span>Year</span><b>{active.year}</b></div>
                <div><span>Project type</span><b>{active.type}</b></div>
                <div><span>Status</span><b>{active.status}</b></div>
              </div>

              {Array.isArray(active.scope) && active.scope.length ? (
                <div className="modal-scope">
                  <span>Scope of work</span>
                  <ul>
                    {active.scope.map((s, i) => <li key={`${s}-${i}`}>{s}</li>)}
                  </ul>
                </div>
              ) : null}

              <p className="modal-note">Illustrative project reference for design demonstration.</p>
              <a className="btn btn-primary" href="#contact" onClick={() => setActive(null)}>
                Discuss a similar project <span className="btn-arrow"><Arrow /></span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
