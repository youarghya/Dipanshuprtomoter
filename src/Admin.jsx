import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStore, uid, useHashRoute } from './store.jsx';
import { THEME_PRESETS, defaultData } from './data.js';
import './admin.css';

/* ============================================================
   Icons
   ============================================================ */

const ICONS = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  projects: (
    <>
      <path d="M4 21V6.5A1.5 1.5 0 0 1 5.5 5H13v16M13 21h5.5a.5.5 0 0 0 .5-.5V11a1 1 0 0 0-1-1h-5" />
      <path d="M8 9h2M8 13h2M8 17h2M16 14h1.5M16 18h1.5M3 21h18" />
    </>
  ),
  enquiries: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  clients: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M18.5 20a5.5 5.5 0 0 0-3-4.6" />
    </>
  ),
  team: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  tasks: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  content: (
    <>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z" />
      <path d="m14 6 4 4" />
    </>
  ),
  appearance: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="8" cy="6" r="2" />
      <circle cx="15" cy="12" r="2" />
      <circle cx="10" cy="18" r="2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  edit: (
    <>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z" />
      <path d="m14 6 4 4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  external: (
    <>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4.5 4.5" />
    </>
  ),
  download: <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />,
  upload: <path d="M12 21V9M7 14l5-5 5 5M4 3h16" />,
  reset: <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />,
  check: <path d="m4 12 5 5L20 6" />,
  arrow: <path d="M7 17 17 7M8 7h9v9" />,
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  phone: (
    <path d="M5 3h4l2 5-2.5 1.5a14 14 0 0 0 5 5L15 12l5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2z" />
  ),
  note: (
    <>
      <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3 2 21h20L12 3z" />
      <path d="M12 9v5M12 17.5v.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 11h18" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  folder: (
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="m4 18 5-5 4 4 3-3 4 4" />
    </>
  ),
};

function Icon({ name, size = 18, fill = 'none', className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name] || null}
    </svg>
  );
}

/* ============================================================
   Small helpers
   ============================================================ */

function initials(name = '') {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || 'A'
  );
}

function fmtDate(value, withTime = false) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}),
  });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function Field({ label, hint, full, children }) {
  return (
    <div className={`field ${full ? 'full' : ''}`}>
      {label ? <label>{label}</label> : null}
      {children}
      {hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, footer, width }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="a-modal"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="a-modal-panel" style={width ? { width } : undefined}>
        <div className="a-modal-head">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button type="button" className="a-btn a-btn-icon" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" size={17} />
          </button>
        </div>
        <div className="a-modal-body">{children}</div>
        {footer ? <div className="a-modal-foot">{footer}</div> : null}
      </div>
    </div>
  );
}

function Empty({ icon = 'folder', title, text, action }) {
  return (
    <div className="a-empty">
      <span className="ei"><Icon name={icon} size={22} /></span>
      <b>{title}</b>
      {text ? <p>{text}</p> : null}
      {action}
    </div>
  );
}

function ColorField({ value, onChange }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  return (
    <div className="color-field">
      <input
        type="color"
        value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Pick colour"
      />
      <input
        type="text"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          if (/^#[0-9a-f]{6}$/i.test(e.target.value)) onChange(e.target.value);
        }}
        onBlur={() => setDraft(value)}
        spellCheck="false"
      />
    </div>
  );
}

/* ============================================================
   Login
   ============================================================ */

function Login() {
  const { data, login, theme } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      setError('');
    } else {
      setError('Those details do not match the admin account. Check your email and password.');
    }
  };

  const fillDemo = () => {
    setEmail(data.auth?.email || '');
    setPassword(data.auth?.password || '');
    setError('');
  };

  useEffect(() => {
    const previous = document.title;
    document.title = 'Sign in · Dipanshu Management';
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="admin" style={theme}>
      <div className="login">
        <aside className="login-aside">
          <a className="login-brand" href="#home">
            <img src={data.brand.logo} alt="" />
            <span>
              <b>{data.brand.name}</b>
              <small>{data.brand.sub}</small>
            </span>
          </a>

          <div className="login-copy">
            <span className="eyebrow-mini" style={{ color: 'var(--gold-light)' }}>
              <i /> Management console
            </span>
            <h1>Run the business.<br /><em>Shape the story.</em></h1>
            <p>
              One place for projects, enquiries, clients, team and delivery — plus full control
              over every word and colour on the public website.
            </p>

            <ul className="login-points">
              <li><i>✓</i> Edit the live website content and appearance</li>
              <li><i>✓</i> Track projects, tasks and client relationships</li>
              <li><i>✓</i> Review and respond to project enquiries</li>
            </ul>
          </div>

          <div className="login-aside-foot">
            <span>© {new Date().getFullYear()} {data.brand.legal}</span>
            <a href="https://www.dipanshupromoter.com/" target="_blank" rel="noreferrer">
              dipanshupromoter.com
            </a>
          </div>
        </aside>

        <div className="login-panel">
          <div className="login-card">
            <span className="eyebrow-mini"><i /> Admin sign in</span>
            <h2>Welcome back.</h2>
            <p>Sign in to manage the Dipanshu Promoter &amp; Builder website and operations.</p>

            <form className="login-form" onSubmit={submit}>
              {error ? (
                <div className="login-error" role="alert">
                  <Icon name="warning" size={15} />
                  <span>{error}</span>
                </div>
              ) : null}

              <Field label="Email address">
                <div className="input-icon">
                  <Icon name="mail" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="username"
                    required
                  />
                </div>
              </Field>

              <Field label="Password">
                <div className="pw-wrap">
                  <input
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    autoComplete="current-password"
                    required
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShow((s) => !s)}>
                    {show ? 'Hide' : 'Show'}
                  </button>
                </div>
              </Field>

              <button type="submit" className="a-btn a-btn-primary a-btn-block">
                Sign in <Icon name="arrow" size={15} />
              </button>
            </form>

            <div className="login-demo">
              <b>Demo credentials</b>
              Email <code>{data.auth.email}</code><br />
              Password <code>{data.auth.password}</code>
              <button type="button" className="a-btn a-btn-sm" onClick={fillDemo}>
                Use demo sign in
              </button>
            </div>

            <p className="login-legal">
              Demonstration build: authentication runs in the browser and data is stored only in
              this browser. Do not use real passwords here. A production deployment needs a
              secure server-side backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Overview
   ============================================================ */

function OverviewPage({ navigate }) {
  const { data, setFeaturedProject } = useStore();
  const projects = data.projects || [];
  const enquiries = data.enquiries || [];
  const clients = data.clients || [];
  const tasks = data.tasks || [];
  const openTasks = tasks.filter((t) => t.status !== 'Done');
  const newEnquiries = enquiries.filter((e) => e.status === 'new');
  const featured = projects.find((p) => p.featured) || projects[0];

  const statusCounts = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      map[p.status] = (map[p.status] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [projects]);

  const upcoming = [...openTasks]
    .sort((a, b) => String(a.due).localeCompare(String(b.due)))
    .slice(0, 5);

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Good to see you, {data.auth.name || 'Admin'}.</h2>
          <p>
            Here is the state of the business and the website today. All figures update live as
            you edit records.
          </p>
        </div>
        <div className="page-intro-actions">
          <button type="button" className="a-btn" onClick={() => navigate('content')}>
            <Icon name="edit" size={15} /> Edit website
          </button>
          <button type="button" className="a-btn a-btn-primary" onClick={() => navigate('projects')}>
            <Icon name="plus" size={15} /> New project
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-icon"><Icon name="projects" size={18} /></span>
          <div className="stat-value">{String(projects.length).padStart(2, '0')}</div>
          <div className="stat-label">Portfolio projects</div>
          <div className="stat-note">{statusCounts.map(([s, c]) => `${c} ${s.toLowerCase()}`).slice(0, 2).join(' · ') || 'No projects yet'}</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon gold"><Icon name="enquiries" size={18} /></span>
          <div className="stat-value">{String(newEnquiries.length).padStart(2, '0')}</div>
          <div className="stat-label">New enquiries</div>
          <div className="stat-note">{enquiries.length} total received</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon blue"><Icon name="clients" size={18} /></span>
          <div className="stat-value">{String(clients.length).padStart(2, '0')}</div>
          <div className="stat-label">Client accounts</div>
          <div className="stat-note">Across all sectors</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon red"><Icon name="tasks" size={18} /></span>
          <div className="stat-value">{String(openTasks.length).padStart(2, '0')}</div>
          <div className="stat-label">Open tasks</div>
          <div className="stat-note">{tasks.filter((t) => t.status === 'Done').length} completed</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="a-card">
          <div className="a-card-head">
            <div>
              <h3>Recent enquiries</h3>
              <p>The latest project conversations from the website.</p>
            </div>
            <button type="button" className="a-btn a-btn-sm" onClick={() => navigate('enquiries')}>
              View all <Icon name="arrow" size={13} />
            </button>
          </div>
          <div className="mini-list">
            {enquiries.slice(0, 5).map((e) => (
              <div className="mini-row" key={e.id}>
                <span className="mini-avatar">{initials(e.name)}</span>
                <div style={{ minWidth: 0 }}>
                  <b>{e.name}</b>
                  <span>{e.email}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${e.status === 'new' ? 'gold' : e.status === 'replied' ? 'ok' : 'plain'}`}>
                    {e.status}
                  </span>
                  <time style={{ display: 'block', marginTop: 4 }}>{fmtDate(e.date)}</time>
                </div>
              </div>
            ))}
            {enquiries.length === 0 ? (
              <Empty icon="enquiries" title="No enquiries yet" text="Enquiries sent through the website contact form will appear here." />
            ) : null}
          </div>
        </div>

        <div className="a-card">
          <div className="a-card-head">
            <div>
              <h3>Quick actions</h3>
              <p>Jump straight into the work.</p>
            </div>
          </div>
          <div className="a-card-body quick-actions">
            <button type="button" className="quick-action" onClick={() => navigate('projects')}>
              <span className="qi"><Icon name="plus" size={16} /></span>
              <span>Add a project<small>Publish new work to the portfolio</small></span>
              <Icon name="arrow" size={14} />
            </button>
            <button type="button" className="quick-action" onClick={() => navigate('content')}>
              <span className="qi"><Icon name="content" size={16} /></span>
              <span>Edit site content<small>Headlines, services and contact details</small></span>
              <Icon name="arrow" size={14} />
            </button>
            <button type="button" className="quick-action" onClick={() => navigate('appearance')}>
              <span className="qi"><Icon name="appearance" size={16} /></span>
              <span>Change appearance<small>Colours, radius and theme presets</small></span>
              <Icon name="arrow" size={14} />
            </button>
            <button type="button" className="quick-action" onClick={() => navigate('enquiries')}>
              <span className="qi"><Icon name="enquiries" size={16} /></span>
              <span>Review enquiries<small>{newEnquiries.length} waiting for a response</small></span>
              <Icon name="arrow" size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="dash-cols">
        <div className="a-card">
          <div className="a-card-head">
            <div>
              <h3>Project pipeline</h3>
              <p>Distribution by current status.</p>
            </div>
            <span className="badge plain">{projects.length} total</span>
          </div>
          <div className="a-card-body">
            {statusCounts.length ? (
              statusCounts.map(([status, count]) => (
                <div className="progress-row" key={status}>
                  <div className="plabel">
                    <b>{status}</b>
                    <span>{count} / {projects.length}</span>
                  </div>
                  <div className="progress-line">
                    <i style={{ width: `${Math.round((count / projects.length) * 100)}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <Empty icon="projects" title="No projects yet" text="Add your first project to start building the portfolio." />
            )}
          </div>
        </div>

        <div className="a-card">
          <div className="a-card-head">
            <div>
              <h3>Tasks due soon</h3>
              <p>Open work ordered by due date.</p>
            </div>
            <button type="button" className="a-btn a-btn-sm" onClick={() => navigate('tasks')}>
              Board <Icon name="arrow" size={13} />
            </button>
          </div>
          <div className="mini-list">
            {upcoming.map((t) => (
              <div className="mini-row" key={t.id}>
                <span className="mini-avatar">{initials(t.assignee)}</span>
                <div style={{ minWidth: 0 }}>
                  <b>{t.title}</b>
                  <span>{t.assignee || 'Unassigned'} · {t.priority}</span>
                </div>
                <time className={t.due && t.due < todayISO() ? 'task-due overdue' : ''}>{fmtDate(t.due)}</time>
              </div>
            ))}
            {upcoming.length === 0 ? (
              <Empty icon="tasks" title="Everything is clear" text="There are no open tasks right now." />
            ) : null}
          </div>
        </div>
      </div>

      {featured ? (
        <div className="a-card">
          <div className="a-card-head">
            <div>
              <h3>Featured project</h3>
              <p>Highlighted at the top of the public website.</p>
            </div>
            <button type="button" className="a-btn a-btn-sm" onClick={() => navigate('projects')}>
              Manage <Icon name="arrow" size={13} />
            </button>
          </div>
          <div className="a-card-body" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <img
              src={featured.img}
              alt=""
              style={{ width: 110, height: 74, objectFit: 'cover', borderRadius: 10 }}
            />
            <div style={{ flex: 1, minWidth: 200 }}>
              <b style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>{featured.title}</b>
              <p style={{ color: 'var(--a-muted)', fontSize: 12, marginTop: 3 }}>
                {featured.sector} · {featured.location} · {featured.year}
              </p>
            </div>
            <button
              type="button"
              className="a-btn a-btn-sm"
              onClick={() => setFeaturedProject(featured.id)}
            >
              <Icon name="star" size={14} fill="currentColor" /> Featured
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ============================================================
   Projects
   ============================================================ */

const SECTORS = ['Institutional', 'Commercial', 'Residential', 'Infrastructure', 'Industrial', 'Public', 'Other'];
const STATUSES = ['Completed', 'In progress', 'Handed over', 'Planning'];
const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=85';

function ProjectForm({ initial, defaultN, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    id: initial?.id || uid('prj'),
    n: initial?.n || defaultN,
    title: initial?.title || '',
    sector: initial?.sector || 'Commercial',
    type: initial?.type || 'Building construction',
    location: initial?.location || 'Ranchi, Jharkhand',
    year: initial?.year || String(new Date().getFullYear()),
    status: initial?.status || 'In progress',
    featured: Boolean(initial?.featured),
    img: initial?.img || '',
    desc: initial?.desc || '',
    long: initial?.long || '',
    scopeText: Array.isArray(initial?.scope) ? initial.scope.join('\n') : '',
  }));

  const [error, setError] = useState('');
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('A project title is required.');
      return;
    }
    onSave({
      id: form.id,
      n: form.n,
      title: form.title.trim(),
      sector: form.sector,
      type: form.type.trim(),
      location: form.location.trim(),
      year: String(form.year).trim(),
      status: form.status,
      featured: Boolean(form.featured),
      img: form.img.trim() || FALLBACK_IMG,
      desc: form.desc.trim(),
      long: form.long.trim(),
      scope: form.scopeText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  return (
    <Modal
      title={initial ? 'Edit project' : 'Add project'}
      subtitle={initial ? 'Update the details shown on the public website.' : 'Create a new portfolio project.'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="a-btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="project-form" className="a-btn a-btn-primary">
            <Icon name="check" size={15} /> {initial ? 'Save changes' : 'Create project'}
          </button>
        </>
      }
    >
      <form id="project-form" onSubmit={submit}>
        {error ? <div className="login-error" style={{ marginBottom: 15 }}><Icon name="warning" size={15} /><span>{error}</span></div> : null}
        <div className="form-grid">
          <Field label="Project title" full>
            <input type="text" value={form.title} onChange={set('title')} placeholder="e.g. Ranchi Knowledge Campus" required />
          </Field>

          <Field label="Sector">
            <select value={form.sector} onChange={set('sector')}>
              {SECTORS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Project type">
            <input type="text" value={form.type} onChange={set('type')} placeholder="e.g. Building construction" />
          </Field>

          <Field label="Location">
            <input type="text" value={form.location} onChange={set('location')} placeholder="e.g. Ranchi, Jharkhand" />
          </Field>

          <Field label="Year">
            <input type="text" value={form.year} onChange={set('year')} placeholder="2024" />
          </Field>

          <Field label="Status">
            <select value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Project number">
            <input type="text" value={form.n} onChange={set('n')} placeholder="01" />
          </Field>

          <Field label="Cover image URL" full hint="Use a wide landscape image (1400px or wider) for the best result.">
            <input type="url" value={form.img} onChange={set('img')} placeholder="https://…" />
          </Field>

          {form.img ? (
            <div className="img-preview full">
              <img src={form.img} alt="Project cover preview" />
              <span>Cover preview</span>
            </div>
          ) : null}

          <Field label="Short description" full hint="Shown on the project card. Keep it to one or two lines.">
            <textarea value={form.desc} onChange={set('desc')} rows="2" placeholder="A short summary of the project." />
          </Field>

          <Field label="Full description" full hint="Shown in the project detail dialog.">
            <textarea value={form.long} onChange={set('long')} rows="4" placeholder="The full project story." />
          </Field>

          <Field label="Scope of work" full hint="One item per line. Each line becomes a bullet in the project details.">
            <textarea value={form.scopeText} onChange={set('scopeText')} rows="4" placeholder={'Academic blocks\nCentral library\nLandscape and site services'} />
          </Field>

          <div className="toggle-row full">
            <div>
              <b>Feature this project</b>
              <span>Show this project in the homepage featured panel.</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                aria-label="Feature this project"
              />
              <i />
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function ProjectsPage({ toast }) {
  const { data, saveProject, deleteProject, setFeaturedProject } = useStore();
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('All');
  const [editing, setEditing] = useState(null);

  const projects = data.projects || [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (sector !== 'All' && p.sector !== sector) return false;
      if (!q) return true;
      return `${p.title} ${p.location} ${p.sector} ${p.type}`.toLowerCase().includes(q);
    });
  }, [projects, query, sector]);

  const defaultN = String(
    Math.max(0, ...projects.map((p) => parseInt(p.n, 10) || 0)) + 1
  ).padStart(2, '0');

  const handleSave = (project) => {
    saveProject(project);
    setEditing(null);
    toast(project.id && projects.some((p) => p.id === project.id) ? 'Project updated.' : 'Project created.');
  };

  const handleDelete = (project) => {
    if (window.confirm(`Delete “${project.title}”? This cannot be undone.`)) {
      deleteProject(project.id);
      toast('Project deleted.');
    }
  };

  const usedSectors = [...new Set(projects.map((p) => p.sector))];
  const filterSectors = [...new Set([...usedSectors, ...SECTORS])];

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Projects</h2>
          <p>Everything in the public portfolio. Add, edit, reorder by number and choose which project is featured.</p>
        </div>
        <div className="page-intro-actions">
          <button type="button" className="a-btn a-btn-primary" onClick={() => setEditing('new')}>
            <Icon name="plus" size={15} /> Add project
          </button>
        </div>
      </div>

      <div>
        <div className="toolbar">
          <div className="search">
            <Icon name="search" size={16} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              aria-label="Search projects"
            />
          </div>
          <select value={sector} onChange={(e) => setSector(e.target.value)} aria-label="Filter by sector">
            <option value="All">All sectors</option>
            {filterSectors.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="toolbar-note">{filtered.length} of {projects.length} projects</span>
          <span className="spacer" />
          <a className="a-btn a-btn-sm" href="#projects" target="_blank" rel="noreferrer">
            <Icon name="external" size={14} /> Preview portfolio
          </a>
        </div>

        {filtered.length ? (
          <div className="table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Sector</th>
                  <th>Status</th>
                  <th>Year</th>
                  <th>Featured</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="project-row">
                        <img src={p.img} alt="" />
                        <div>
                          <b>{p.title}</b>
                          <span>{p.location || '—'} · {p.type || '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="sector-tag">{p.sector}</span></td>
                    <td>
                      <span className={`badge ${p.status === 'Completed' ? 'ok' : p.status === 'In progress' ? 'warn' : 'plain'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="num">{p.year}</td>
                    <td>
                      <button
                        type="button"
                        className={`a-btn a-btn-icon star-btn ${p.featured ? 'on' : ''}`}
                        onClick={() => setFeaturedProject(p.id)}
                        aria-label={p.featured ? 'Featured project' : 'Make featured project'}
                        title={p.featured ? 'Featured project' : 'Make featured project'}
                      >
                        <Icon name="star" size={16} fill={p.featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td>
                      <div className="cell-actions">
                        <button type="button" className="a-btn a-btn-icon" onClick={() => setEditing(p)} aria-label={`Edit ${p.title}`}>
                          <Icon name="edit" size={15} />
                        </button>
                        <button type="button" className="a-btn a-btn-icon danger" onClick={() => handleDelete(p)} aria-label={`Delete ${p.title}`}>
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="a-card">
            <Empty
              icon="projects"
              title={projects.length ? 'No matching projects' : 'No projects yet'}
              text={projects.length ? 'Try a different search term or sector.' : 'Add your first project to start the portfolio.'}
              action={<button type="button" className="a-btn a-btn-sm" onClick={() => setEditing('new')}>Add project</button>}
            />
          </div>
        )}
      </div>

      {editing ? (
        <ProjectForm
          initial={editing === 'new' ? null : editing}
          defaultN={defaultN}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}

/* ============================================================
   Enquiries
   ============================================================ */

function EnquiriesPage({ toast }) {
  const { data, updateItem, removeItem } = useStore();
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);

  const enquiries = data.enquiries || [];
  const counts = {
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === 'new').length,
    read: enquiries.filter((e) => e.status === 'read').length,
    replied: enquiries.filter((e) => e.status === 'replied').length,
  };

  const list = filter === 'all' ? enquiries : enquiries.filter((e) => e.status === filter);

  const setStatus = (enq, status) => {
    updateItem('enquiries', enq.id, { status });
    toast(`Marked as ${status}.`);
  };

  const remove = (enq) => {
    if (window.confirm(`Delete the enquiry from ${enq.name}?`)) {
      removeItem('enquiries', enq.id);
      setOpen(null);
      toast('Enquiry deleted.');
    }
  };

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Enquiries</h2>
          <p>Messages submitted through the website contact form. Mark them as read or replied as you work through them.</p>
        </div>
      </div>

      <div>
        <div className="toolbar">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter enquiries">
            <option value="all">All enquiries ({counts.all})</option>
            <option value="new">New ({counts.new})</option>
            <option value="read">Read ({counts.read})</option>
            <option value="replied">Replied ({counts.replied})</option>
          </select>
          <span className="toolbar-note">{list.length} shown</span>
        </div>

        <div className="a-card">
          {list.length ? (
            <div className="enq-list">
              {list.map((enq) => {
                const isOpen = open === enq.id;
                return (
                  <div className={`enq-item ${enq.status === 'new' ? 'is-new' : ''}`} key={enq.id}>
                    <button
                      type="button"
                      className="enq-summary"
                      onClick={() => {
                        setOpen(isOpen ? null : enq.id);
                        if (!isOpen && enq.status === 'new') updateItem('enquiries', enq.id, { status: 'read' });
                      }}
                      aria-expanded={isOpen}
                    >
                      <span className="enq-dot" aria-hidden="true" />
                      <span className="enq-main">
                        <b>{enq.name}</b>
                        <span>{enq.email}{enq.phone ? ` · ${enq.phone}` : ''}</span>
                        <span className="enq-msg-preview">{enq.message}</span>
                      </span>
                      <span className="badge plain">{enq.status}</span>
                      <span className="enq-meta">{fmtDate(enq.date)}</span>
                    </button>

                    {isOpen ? (
                      <div className="enq-detail">
                        <div className="enq-contact">
                          <span><b>Email</b> <a href={`mailto:${enq.email}`}>{enq.email}</a></span>
                          {enq.phone ? <span><b>Phone</b> <a href={`tel:${enq.phone.replace(/\s/g, '')}`}>{enq.phone}</a></span> : null}
                          <span><b>Received</b> {fmtDate(enq.date, true)}</span>
                        </div>
                        <div className="enq-bubble">{enq.message}</div>
                        <div className="enq-detail-actions">
                          <a
                            className="a-btn a-btn-sm a-btn-primary"
                            href={`mailto:${enq.email}?subject=${encodeURIComponent('Re: your project enquiry — Dipanshu Promoter & Builder')}`}
                            onClick={() => setStatus(enq, 'replied')}
                          >
                            <Icon name="mail" size={14} /> Reply by email
                          </a>
                          {enq.status !== 'read' ? (
                            <button type="button" className="a-btn a-btn-sm" onClick={() => setStatus(enq, 'read')}>
                              Mark read
                            </button>
                          ) : null}
                          {enq.status !== 'new' ? (
                            <button type="button" className="a-btn a-btn-sm" onClick={() => setStatus(enq, 'new')}>
                              Mark new
                            </button>
                          ) : null}
                          <button type="button" className="a-btn a-btn-sm a-btn-danger" onClick={() => remove(enq)}>
                            <Icon name="trash" size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty
              icon="enquiries"
              title={enquiries.length ? 'Nothing in this view' : 'No enquiries yet'}
              text="When someone submits the website contact form, their message will appear here."
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Clients
   ============================================================ */

function ClientForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    id: initial?.id || uid('cli'),
    name: initial?.name || '',
    contact: initial?.contact || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    notes: initial?.notes || '',
  });
  const [error, setError] = useState('');
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <Modal
      title={initial ? 'Edit client' : 'Add client'}
      subtitle="Client accounts are internal records — they are not shown on the public website."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="a-btn" onClick={onClose}>Cancel</button>
          <button
            type="submit"
            form="client-form"
            className="a-btn a-btn-primary"
            onClick={(e) => {
              if (!form.name.trim()) {
                e.preventDefault();
                setError('A client name is required.');
              }
            }}
          >
            <Icon name="check" size={15} /> Save client
          </button>
        </>
      }
    >
      <form
        id="client-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name.trim()) {
            setError('A client name is required.');
            return;
          }
          onSave({ ...form, name: form.name.trim() });
        }}
      >
        {error ? <div className="login-error" style={{ marginBottom: 15 }}><Icon name="warning" size={15} /><span>{error}</span></div> : null}
        <div className="form-grid">
          <Field label="Client / company" full>
            <input type="text" value={form.name} onChange={set('name')} placeholder="e.g. Vatika Group" required />
          </Field>
          <Field label="Primary contact">
            <input type="text" value={form.contact} onChange={set('contact')} placeholder="Contact person" />
          </Field>
          <Field label="Phone">
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91" />
          </Field>
          <Field label="Email" full>
            <input type="email" value={form.email} onChange={set('email')} placeholder="contact@company.com" />
          </Field>
          <Field label="Internal notes" full hint="Only visible inside the management console.">
            <textarea value={form.notes} onChange={set('notes')} rows="3" placeholder="Relationship history, preferences, active work…" />
          </Field>
        </div>
      </form>
    </Modal>
  );
}

function ClientsPage({ toast }) {
  const { data, addItem, updateItem, removeItem } = useStore();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);

  const clients = data.clients || [];
  const filtered = clients.filter((c) =>
    `${c.name} ${c.contact} ${c.email} ${c.phone} ${c.notes}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  const save = (client) => {
    if (clients.some((c) => c.id === client.id)) {
      updateItem('clients', client.id, client);
      toast('Client updated.');
    } else {
      addItem('clients', client);
      toast('Client added.');
    }
    setEditing(null);
  };

  const remove = (client) => {
    if (window.confirm(`Delete client “${client.name}”?`)) {
      removeItem('clients', client.id);
      toast('Client deleted.');
    }
  };

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Clients</h2>
          <p>Keep the relationship record for every client in one place.</p>
        </div>
        <div className="page-intro-actions">
          <button type="button" className="a-btn a-btn-primary" onClick={() => setEditing('new')}>
            <Icon name="plus" size={15} /> Add client
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <Icon name="search" size={16} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients…"
            aria-label="Search clients"
          />
        </div>
        <span className="toolbar-note">{filtered.length} of {clients.length} clients</span>
      </div>

      {filtered.length ? (
        <div className="entity-grid">
          {filtered.map((c) => (
            <div className="a-card entity-card" key={c.id}>
              <div className="entity-top">
                <span className="mini-avatar">{initials(c.name)}</span>
                <div style={{ minWidth: 0 }}>
                  <b>{c.name}</b>
                  <span>{c.contact || 'No primary contact'}</span>
                </div>
                <button type="button" className="a-btn a-btn-icon" onClick={() => setEditing(c)} aria-label={`Edit ${c.name}`}>
                  <Icon name="edit" size={15} />
                </button>
              </div>

              <div className="entity-lines">
                {c.email ? (
                  <div className="entity-line"><Icon name="mail" size={13} /><a href={`mailto:${c.email}`}>{c.email}</a></div>
                ) : null}
                {c.phone ? (
                  <div className="entity-line"><Icon name="phone" size={13} /><a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></div>
                ) : null}
                {!c.email && !c.phone ? (
                  <div className="entity-line"><Icon name="note" size={13} /><span>No contact details yet.</span></div>
                ) : null}
              </div>

              {c.notes ? <p className="entity-note">{c.notes}</p> : null}

              <div className="entity-actions">
                <button type="button" className="a-btn a-btn-sm" onClick={() => setEditing(c)}>
                  <Icon name="edit" size={13} /> Edit
                </button>
                <button type="button" className="a-btn a-btn-sm a-btn-danger" onClick={() => remove(c)}>
                  <Icon name="trash" size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="a-card">
          <Empty
            icon="clients"
            title={clients.length ? 'No matching clients' : 'No clients yet'}
            text={clients.length ? 'Try a different search.' : 'Add your first client to start building the relationship record.'}
            action={<button type="button" className="a-btn a-btn-sm" onClick={() => setEditing('new')}>Add client</button>}
          />
        </div>
      )}

      {editing ? (
        <ClientForm
          initial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      ) : null}
    </div>
  );
}

/* ============================================================
   Team
   ============================================================ */

function TeamForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    id: initial?.id || uid('tea'),
    name: initial?.name || '',
    role: initial?.role || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
  });
  const [error, setError] = useState('');
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <Modal
      title={initial ? 'Edit team member' : 'Add team member'}
      subtitle="Team members can be assigned to tasks."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="a-btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="team-form" className="a-btn a-btn-primary">
            <Icon name="check" size={15} /> Save member
          </button>
        </>
      }
    >
      <form
        id="team-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name.trim()) {
            setError('A name is required.');
            return;
          }
          onSave({ ...form, name: form.name.trim() });
        }}
      >
        {error ? <div className="login-error" style={{ marginBottom: 15 }}><Icon name="warning" size={15} /><span>{error}</span></div> : null}
        <div className="form-grid">
          <Field label="Full name" full>
            <input type="text" value={form.name} onChange={set('name')} placeholder="e.g. Anita Singh" required />
          </Field>
          <Field label="Role" full>
            <input type="text" value={form.role} onChange={set('role')} placeholder="e.g. Site Engineer" />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={set('email')} placeholder="name@dipanshu.in" />
          </Field>
          <Field label="Phone">
            <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91" />
          </Field>
        </div>
      </form>
    </Modal>
  );
}

function TeamPage({ toast }) {
  const { data, addItem, updateItem, removeItem } = useStore();
  const [editing, setEditing] = useState(null);
  const team = data.team || [];
  const tasks = data.tasks || [];

  const save = (member) => {
    if (team.some((m) => m.id === member.id)) {
      updateItem('team', member.id, member);
      toast('Team member updated.');
    } else {
      addItem('team', member);
      toast('Team member added.');
    }
    setEditing(null);
  };

  const remove = (member) => {
    if (window.confirm(`Remove ${member.name} from the team?`)) {
      removeItem('team', member.id);
      toast('Team member removed.');
    }
  };

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Team</h2>
          <p>Your people and the work they are responsible for.</p>
        </div>
        <div className="page-intro-actions">
          <button type="button" className="a-btn a-btn-primary" onClick={() => setEditing('new')}>
            <Icon name="plus" size={15} /> Add member
          </button>
        </div>
      </div>

      {team.length ? (
        <div className="entity-grid">
          {team.map((m) => {
            const assigned = tasks.filter((t) => t.assignee === m.name && t.status !== 'Done').length;
            return (
              <div className="a-card entity-card" key={m.id}>
                <div className="entity-top">
                  <span className="mini-avatar">{initials(m.name)}</span>
                  <div style={{ minWidth: 0 }}>
                    <b>{m.name}</b>
                    <span>{m.role || 'Team member'}</span>
                  </div>
                  <span className={`badge ${assigned ? 'gold' : 'plain'}`}>{assigned} open</span>
                </div>

                <div className="entity-lines">
                  {m.email ? (
                    <div className="entity-line"><Icon name="mail" size={13} /><a href={`mailto:${m.email}`}>{m.email}</a></div>
                  ) : null}
                  {m.phone ? (
                    <div className="entity-line"><Icon name="phone" size={13} /><a href={`tel:${m.phone.replace(/\s/g, '')}`}>{m.phone}</a></div>
                  ) : null}
                </div>

                <div className="entity-actions">
                  <button type="button" className="a-btn a-btn-sm" onClick={() => setEditing(m)}>
                    <Icon name="edit" size={13} /> Edit
                  </button>
                  <button type="button" className="a-btn a-btn-sm a-btn-danger" onClick={() => remove(m)}>
                    <Icon name="trash" size={13} /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="a-card">
          <Empty
            icon="team"
            title="No team members yet"
            text="Add the people who deliver your projects so tasks can be assigned."
            action={<button type="button" className="a-btn a-btn-sm" onClick={() => setEditing('new')}>Add member</button>}
          />
        </div>
      )}

      {editing ? (
        <TeamForm
          initial={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      ) : null}
    </div>
  );
}

/* ============================================================
   Tasks
   ============================================================ */

const TASK_COLUMNS = ['Open', 'In progress', 'Done'];

function TaskForm({ initial, defaultStatus, projects, team, onClose, onSave }) {
  const [form, setForm] = useState({
    id: initial?.id || uid('tsk'),
    title: initial?.title || '',
    projectId: initial?.projectId || '',
    assignee: initial?.assignee || '',
    due: initial?.due || '',
    priority: initial?.priority || 'Medium',
    status: initial?.status || defaultStatus || 'Open',
  });
  const [error, setError] = useState('');
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <Modal
      title={initial ? 'Edit task' : 'Add task'}
      subtitle="Track work against a project and an owner."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="a-btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="task-form" className="a-btn a-btn-primary">
            <Icon name="check" size={15} /> Save task
          </button>
        </>
      }
    >
      <form
        id="task-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.title.trim()) {
            setError('A task title is required.');
            return;
          }
          onSave({ ...form, title: form.title.trim() });
        }}
      >
        {error ? <div className="login-error" style={{ marginBottom: 15 }}><Icon name="warning" size={15} /><span>{error}</span></div> : null}
        <div className="form-grid">
          <Field label="Task title" full>
            <input type="text" value={form.title} onChange={set('title')} placeholder="e.g. Review façade mock-up" required />
          </Field>

          <Field label="Project">
            <select value={form.projectId} onChange={set('projectId')}>
              <option value="">No project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </Field>

          <Field label="Assignee">
            <select value={form.assignee} onChange={set('assignee')}>
              <option value="">Unassigned</option>
              {team.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
              {form.assignee && !team.some((m) => m.name === form.assignee) ? (
                <option value={form.assignee}>{form.assignee}</option>
              ) : null}
            </select>
          </Field>

          <Field label="Due date">
            <input type="date" value={form.due} onChange={set('due')} />
          </Field>

          <Field label="Priority">
            <select value={form.priority} onChange={set('priority')}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </Field>

          <Field label="Status" full>
            <select value={form.status} onChange={set('status')}>
              {TASK_COLUMNS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
      </form>
    </Modal>
  );
}

function TasksPage({ toast }) {
  const { data, addItem, updateItem, removeItem } = useStore();
  const [editing, setEditing] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('Open');

  const tasks = data.tasks || [];
  const projects = data.projects || [];
  const team = data.team || [];
  const projectName = (id) => projects.find((p) => p.id === id)?.title || 'No project';

  const save = (task) => {
    if (tasks.some((t) => t.id === task.id)) {
      updateItem('tasks', task.id, task);
      toast('Task updated.');
    } else {
      addItem('tasks', task);
      toast('Task added.');
    }
    setEditing(null);
  };

  const remove = (task) => {
    if (window.confirm(`Delete task “${task.title}”?`)) {
      removeItem('tasks', task.id);
      toast('Task deleted.');
    }
  };

  const advance = (task) => {
    const next = task.status === 'Open' ? 'In progress' : task.status === 'In progress' ? 'Done' : 'Open';
    updateItem('tasks', task.id, { status: next });
    toast(`Moved to ${next.toLowerCase()}.`);
  };

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Tasks</h2>
          <p>A simple delivery board for everything in motion. Move work across the columns as it progresses.</p>
        </div>
        <div className="page-intro-actions">
          <button
            type="button"
            className="a-btn a-btn-primary"
            onClick={() => {
              setDefaultStatus('Open');
              setEditing('new');
            }}
          >
            <Icon name="plus" size={15} /> Add task
          </button>
        </div>
      </div>

      <div className="task-board">
        {TASK_COLUMNS.map((column) => {
          const items = tasks.filter((t) => t.status === column);
          return (
            <div className="task-col" key={column}>
              <div className="task-col-head">
                {column}
                <span className="count">{items.length}</span>
              </div>

              {items.map((task) => (
                <div className={`task-card ${task.status === 'Done' ? 'done' : ''}`} key={task.id}>
                  <div className="task-card-top">
                    <b>{task.title}</b>
                    <span className={`badge ${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warn' : 'plain'}`}>
                      {task.priority}
                    </span>
                  </div>
                  <span className="task-project">{projectName(task.projectId)}</span>
                  <div className="task-foot">
                    <span className="task-person">
                      <i>{initials(task.assignee || '?')}</i>
                      {task.assignee || 'Unassigned'}
                    </span>
                    <span className={`task-due ${task.due && task.due < todayISO() && task.status !== 'Done' ? 'overdue' : ''}`}>
                      {task.due ? fmtDate(task.due) : 'No due date'}
                    </span>
                  </div>
                  <div className="entity-actions" style={{ marginTop: 10 }}>
                    <button type="button" className="a-btn a-btn-sm" onClick={() => advance(task)}>
                      <Icon name="check" size={13} /> {task.status === 'Open' ? 'Start' : task.status === 'In progress' ? 'Complete' : 'Reopen'}
                    </button>
                    <button type="button" className="a-btn a-btn-icon" onClick={() => setEditing(task)} aria-label={`Edit ${task.title}`}>
                      <Icon name="edit" size={14} />
                    </button>
                    <button type="button" className="a-btn a-btn-icon danger" onClick={() => remove(task)} aria-label={`Delete ${task.title}`}>
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="task-add"
                onClick={() => {
                  setDefaultStatus(column);
                  setEditing('new');
                }}
              >
                <Icon name="plus" size={14} /> Add {column.toLowerCase()} task
              </button>
            </div>
          );
        })}
      </div>

      {editing ? (
        <TaskForm
          initial={editing === 'new' ? null : editing}
          defaultStatus={defaultStatus}
          projects={projects}
          team={team}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      ) : null}
    </div>
  );
}

/* ============================================================
   Site content
   ============================================================ */

const CONTENT_TABS = [
  ['brand', 'Brand'],
  ['hero', 'Hero'],
  ['about', 'About'],
  ['expertise', 'Expertise'],
  ['approach', 'Approach'],
  ['contact', 'Contact'],
  ['projects', 'Projects'],
  ['cta', 'CTA band'],
  ['footer', 'Footer'],
  ['marquee', 'Marquee'],
];

function ContentPage({ toast }) {
  const { data, update, updateField } = useStore();
  const [tab, setTab] = useState('brand');
  const { brand, hero, about, expertise, approach, contact, footer, marquee, projectsSection, cta } = data;

  const note = () => toast('Saved. The public website updates immediately.');

  const setList = (section, field, next) => updateField(section, field, next);

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Site content</h2>
          <p>Every heading, paragraph, label and list on the public website is editable here. Changes save automatically.</p>
        </div>
        <div className="page-intro-actions">
          <a className="a-btn" href="#home" target="_blank" rel="noreferrer">
            <Icon name="external" size={14} /> Open website
          </a>
        </div>
      </div>

      <div className="notice info">
        <Icon name="check" size={16} />
        <span>Changes are stored in this browser and appear on the website immediately. Use <b>Settings → Export data</b> to keep a backup.</span>
      </div>

      <div className="editor-tabs" role="tablist" aria-label="Content sections">
        {CONTENT_TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={`editor-tab ${tab === key ? 'active' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'brand' ? (
        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Brand &amp; identity</h3><p>Company naming and the assets used across the site.</p></div>
          </div>
          <div className="a-card-body">
            <div className="form-grid">
              <Field label="Brand name">
                <input type="text" value={brand.name} onChange={(e) => updateField('brand', 'name', e.target.value)} />
              </Field>
              <Field label="Brand descriptor">
                <input type="text" value={brand.sub} onChange={(e) => updateField('brand', 'sub', e.target.value)} />
              </Field>
              <Field label="Legal company name" full>
                <input type="text" value={brand.legal} onChange={(e) => updateField('brand', 'legal', e.target.value)} />
              </Field>
              <Field label="Experience line">
                <input type="text" value={brand.since} onChange={(e) => updateField('brand', 'since', e.target.value)} />
              </Field>
              <Field label="Logo path" hint="Path inside the public folder, e.g. /logo.png">
                <input type="text" value={brand.logo} onChange={(e) => updateField('brand', 'logo', e.target.value)} />
              </Field>
              <Field label="Footer banner path" full hint="Wide wordmark image used in the footer, e.g. /banier.png">
                <input type="text" value={brand.banner} onChange={(e) => updateField('brand', 'banner', e.target.value)} />
              </Field>
              <div className="img-preview">
                <img src={brand.logo} alt="Brand logo preview" />
                <span>Logo preview</span>
              </div>
              <div className="img-preview">
                <img src={brand.banner} alt="Footer banner preview" />
                <span>Banner preview</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'hero' ? (
        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Hero section</h3><p>The first screen visitors see.</p></div>
          </div>
          <div className="a-card-body">
            <div className="form-grid">
              <Field label="Badge text">
                <input type="text" value={hero.badge} onChange={(e) => updateField('hero', 'badge', e.target.value)} />
              </Field>
              <Field label="Location label">
                <input type="text" value={hero.location} onChange={(e) => updateField('hero', 'location', e.target.value)} />
              </Field>
              <Field label="Headline (first part)">
                <input type="text" value={hero.title} onChange={(e) => updateField('hero', 'title', e.target.value)} />
              </Field>
              <Field label="Headline accent (italic)">
                <input type="text" value={hero.titleAccent} onChange={(e) => updateField('hero', 'titleAccent', e.target.value)} />
              </Field>
              <Field label="Lead paragraph" full>
                <textarea value={hero.lead} onChange={(e) => updateField('hero', 'lead', e.target.value)} rows="3" />
              </Field>
              <Field label="Primary button label">
                <input type="text" value={hero.primaryCta} onChange={(e) => updateField('hero', 'primaryCta', e.target.value)} />
              </Field>
              <Field label="Primary button link">
                <input type="text" value={hero.primaryHref} onChange={(e) => updateField('hero', 'primaryHref', e.target.value)} />
              </Field>
              <Field label="Secondary link label">
                <input type="text" value={hero.secondaryCta} onChange={(e) => updateField('hero', 'secondaryCta', e.target.value)} />
              </Field>
              <Field label="Secondary link target">
                <input type="text" value={hero.secondaryHref} onChange={(e) => updateField('hero', 'secondaryHref', e.target.value)} />
              </Field>
              <Field label="Background image URL" full hint="A large, dark-toned image works best behind the white headline.">
                <input type="url" value={hero.image} onChange={(e) => updateField('hero', 'image', e.target.value)} />
              </Field>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'about' ? (
        <div className="a-card">
          <div className="a-card-head">
            <div><h3>About section</h3><p>Company story, promise and experience figure.</p></div>
          </div>
          <div className="a-card-body">
            <div className="form-grid">
              <Field label="Eyebrow label">
                <input type="text" value={about.label} onChange={(e) => updateField('about', 'label', e.target.value)} />
              </Field>
              <Field label="Counter years">
                <input type="number" value={about.years} onChange={(e) => updateField('about', 'years', Number(e.target.value))} />
              </Field>
              <Field label="Headline (first part)">
                <input type="text" value={about.title} onChange={(e) => updateField('about', 'title', e.target.value)} />
              </Field>
              <Field label="Headline accent">
                <input type="text" value={about.titleAccent} onChange={(e) => updateField('about', 'titleAccent', e.target.value)} />
              </Field>
              <Field label="Lead paragraph" full>
                <textarea value={about.lead} onChange={(e) => updateField('about', 'lead', e.target.value)} rows="3" />
              </Field>
              <Field label="Body paragraph" full>
                <textarea value={about.body} onChange={(e) => updateField('about', 'body', e.target.value)} rows="3" />
              </Field>
              <Field label="Image URL" full>
                <input type="url" value={about.image} onChange={(e) => updateField('about', 'image', e.target.value)} />
              </Field>
              <Field label="Image caption tag">
                <input type="text" value={about.captionTag} onChange={(e) => updateField('about', 'captionTag', e.target.value)} />
              </Field>
              <Field label="Image caption">
                <input type="text" value={about.caption} onChange={(e) => updateField('about', 'caption', e.target.value)} />
              </Field>
              <Field label="Promise title" full>
                <input type="text" value={about.promiseTitle} onChange={(e) => updateField('about', 'promiseTitle', e.target.value)} />
              </Field>
              <Field label="Promise paragraph" full>
                <textarea value={about.promiseBody} onChange={(e) => updateField('about', 'promiseBody', e.target.value)} rows="3" />
              </Field>
              <Field label="Experience label" full>
                <input type="text" value={about.yearsLabel} onChange={(e) => updateField('about', 'yearsLabel', e.target.value)} />
              </Field>
              <Field label="Quality card title" full>
                <input type="text" value={about.qualityTitle} onChange={(e) => updateField('about', 'qualityTitle', e.target.value)} />
              </Field>
              <Field label="Quality card subtitle" full>
                <input type="text" value={about.qualityBody} onChange={(e) => updateField('about', 'qualityBody', e.target.value)} />
              </Field>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'expertise' ? (
        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Expertise / capabilities</h3><p>The four capability cards in the “What we do” section.</p></div>
          </div>
          <div className="a-card-body">
            <div className="form-grid">
              <Field label="Eyebrow label">
                <input type="text" value={expertise.label} onChange={(e) => updateField('expertise', 'label', e.target.value)} />
              </Field>
              <Field label="Subtitle" full>
                <textarea value={expertise.subtitle} onChange={(e) => updateField('expertise', 'subtitle', e.target.value)} rows="2" />
              </Field>
              <Field label="Headline (first part)">
                <input type="text" value={expertise.title} onChange={(e) => updateField('expertise', 'title', e.target.value)} />
              </Field>
              <Field label="Headline accent">
                <input type="text" value={expertise.titleAccent} onChange={(e) => updateField('expertise', 'titleAccent', e.target.value)} />
              </Field>
              <div className="full">
                <span className="field-label">Capability cards</span>
                <div className="repeat-list" style={{ marginTop: 8 }}>
                  {expertise.items.map((item, i) => (
                    <div className="repeat-item" key={i}>
                      <span className="repeat-handle">{String(i + 1).padStart(2, '0')}</span>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => setList('expertise', 'items', expertise.items.map((it, idx) => idx === i ? { ...it, title: e.target.value } : it))}
                        aria-label={`Capability ${i + 1} title`}
                      />
                      <input
                        type="text"
                        value={item.desc}
                        onChange={(e) => setList('expertise', 'items', expertise.items.map((it, idx) => idx === i ? { ...it, desc: e.target.value } : it))}
                        aria-label={`Capability ${i + 1} description`}
                      />
                      <button
                        type="button"
                        className="a-btn a-btn-icon danger"
                        onClick={() => setList('expertise', 'items', expertise.items.filter((_, idx) => idx !== i))}
                        aria-label={`Remove capability ${i + 1}`}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  ))}
                  {expertise.items.length === 0 ? <div className="repeat-empty">No capability cards. Add one below.</div> : null}
                </div>
                <button
                  type="button"
                  className="a-btn a-btn-sm"
                  style={{ marginTop: 10 }}
                  onClick={() => setList('expertise', 'items', [...expertise.items, { title: 'New capability', desc: 'Describe this capability.' }])}
                >
                  <Icon name="plus" size={13} /> Add capability
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'approach' ? (
        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Approach / process</h3><p>The numbered steps that explain how you work.</p></div>
          </div>
          <div className="a-card-body">
            <div className="form-grid">
              <Field label="Eyebrow label">
                <input type="text" value={approach.label} onChange={(e) => updateField('approach', 'label', e.target.value)} />
              </Field>
              <Field label="Intro paragraph" full>
                <textarea value={approach.lead} onChange={(e) => updateField('approach', 'lead', e.target.value)} rows="2" />
              </Field>
              <Field label="Headline (first part)">
                <input type="text" value={approach.title} onChange={(e) => updateField('approach', 'title', e.target.value)} />
              </Field>
              <Field label="Headline accent">
                <input type="text" value={approach.titleAccent} onChange={(e) => updateField('approach', 'titleAccent', e.target.value)} />
              </Field>
              <div className="full">
                <span className="field-label">Process steps</span>
                <div className="repeat-list" style={{ marginTop: 8 }}>
                  {approach.steps.map((step, i) => (
                    <div className="repeat-item" key={i}>
                      <span className="repeat-handle">{String(i + 1).padStart(2, '0')}</span>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => setList('approach', 'steps', approach.steps.map((it, idx) => idx === i ? { ...it, title: e.target.value } : it))}
                        aria-label={`Step ${i + 1} title`}
                      />
                      <input
                        type="text"
                        value={step.desc}
                        onChange={(e) => setList('approach', 'steps', approach.steps.map((it, idx) => idx === i ? { ...it, desc: e.target.value } : it))}
                        aria-label={`Step ${i + 1} description`}
                      />
                      <button
                        type="button"
                        className="a-btn a-btn-icon danger"
                        onClick={() => setList('approach', 'steps', approach.steps.filter((_, idx) => idx !== i))}
                        aria-label={`Remove step ${i + 1}`}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  ))}
                  {approach.steps.length === 0 ? <div className="repeat-empty">No steps. Add one below.</div> : null}
                </div>
                <button
                  type="button"
                  className="a-btn a-btn-sm"
                  style={{ marginTop: 10 }}
                  onClick={() => setList('approach', 'steps', [...approach.steps, { title: 'New step', desc: 'Describe this stage.' }])}
                >
                  <Icon name="plus" size={13} /> Add step
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'contact' ? (
        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Contact section</h3><p>Address, opening hours and the external website link.</p></div>
          </div>
          <div className="a-card-body">
            <div className="form-grid">
              <Field label="Eyebrow label">
                <input type="text" value={contact.label} onChange={(e) => updateField('contact', 'label', e.target.value)} />
              </Field>
              <Field label="External website URL">
                <input type="url" value={contact.website} onChange={(e) => updateField('contact', 'website', e.target.value)} />
              </Field>
              <Field label="Headline (first part)">
                <input type="text" value={contact.title} onChange={(e) => updateField('contact', 'title', e.target.value)} />
              </Field>
              <Field label="Headline accent">
                <input type="text" value={contact.titleAccent} onChange={(e) => updateField('contact', 'titleAccent', e.target.value)} />
              </Field>
              <Field label="Intro paragraph" full>
                <textarea value={contact.lead} onChange={(e) => updateField('contact', 'lead', e.target.value)} rows="3" />
              </Field>
              <Field label="Office card label">
                <input type="text" value={contact.officeLabel} onChange={(e) => updateField('contact', 'officeLabel', e.target.value)} />
              </Field>
              <Field label="Hours card label">
                <input type="text" value={contact.hoursLabel} onChange={(e) => updateField('contact', 'hoursLabel', e.target.value)} />
              </Field>
              <Field label="Office address" full hint="Use line breaks to control the layout.">
                <textarea value={contact.address} onChange={(e) => updateField('contact', 'address', e.target.value)} rows="3" />
              </Field>
              <Field label="Working hours" full hint="Use line breaks to control the layout.">
                <textarea value={contact.hours} onChange={(e) => updateField('contact', 'hours', e.target.value)} rows="2" />
              </Field>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'projects' ? (
        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Projects section</h3><p>The headings and labels around the portfolio. Individual projects are managed in the Projects page.</p></div>
          </div>
          <div className="a-card-body">
            <div className="form-grid">
              <Field label="Eyebrow label">
                <input type="text" value={projectsSection.label} onChange={(e) => updateField('projectsSection', 'label', e.target.value)} />
              </Field>
              <Field label="Featured flag label">
                <input type="text" value={projectsSection.featuredLabel} onChange={(e) => updateField('projectsSection', 'featuredLabel', e.target.value)} />
              </Field>
              <Field label="Headline (first part)">
                <input type="text" value={projectsSection.title} onChange={(e) => updateField('projectsSection', 'title', e.target.value)} />
              </Field>
              <Field label="Headline accent">
                <input type="text" value={projectsSection.titleAccent} onChange={(e) => updateField('projectsSection', 'titleAccent', e.target.value)} />
              </Field>
              <Field label="Featured kicker" full>
                <input type="text" value={projectsSection.featuredKicker} onChange={(e) => updateField('projectsSection', 'featuredKicker', e.target.value)} />
              </Field>
              <Field label="Section subtitle" full>
                <textarea value={projectsSection.subtitle} onChange={(e) => updateField('projectsSection', 'subtitle', e.target.value)} rows="2" />
              </Field>
              <Field label="Portfolio disclaimer" full hint="Shown beneath the project grid.">
                <textarea value={projectsSection.note} onChange={(e) => updateField('projectsSection', 'note', e.target.value)} rows="2" />
              </Field>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'cta' ? (
        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Call-to-action band</h3><p>The dark invitation band above the contact section.</p></div>
          </div>
          <div className="a-card-body">
            <div className="form-grid">
              <Field label="Eyebrow label" full>
                <input type="text" value={cta.label} onChange={(e) => updateField('cta', 'label', e.target.value)} />
              </Field>
              <Field label="Headline (first part)">
                <input type="text" value={cta.title} onChange={(e) => updateField('cta', 'title', e.target.value)} />
              </Field>
              <Field label="Headline accent">
                <input type="text" value={cta.titleAccent} onChange={(e) => updateField('cta', 'titleAccent', e.target.value)} />
              </Field>
              <Field label="Button label" full>
                <input type="text" value={cta.button} onChange={(e) => updateField('cta', 'button', e.target.value)} />
              </Field>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'footer' ? (
        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Footer</h3><p>The closing statement and location line.</p></div>
          </div>
          <div className="a-card-body">
            <div className="form-grid">
              <Field label="Footer tagline" full hint="Use line breaks to control the layout.">
                <textarea value={footer.tagline} onChange={(e) => updateField('footer', 'tagline', e.target.value)} rows="2" />
              </Field>
              <Field label="Location note" full>
                <input type="text" value={footer.note} onChange={(e) => updateField('footer', 'note', e.target.value)} />
              </Field>
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'marquee' ? (
        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Scrolling marquee</h3><p>The sector names that scroll beneath the hero.</p></div>
          </div>
          <div className="a-card-body">
            <div className="repeat-list">
              {marquee.map((item, i) => (
                <div className="repeat-item" key={i} style={{ gridTemplateColumns: '28px minmax(0, 1fr) 34px' }}>
                  <span className="repeat-handle">{String(i + 1).padStart(2, '0')}</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => update('marquee', marquee.map((it, idx) => (idx === i ? e.target.value : it)))}
                    aria-label={`Marquee item ${i + 1}`}
                  />
                  <button
                    type="button"
                    className="a-btn a-btn-icon danger"
                    onClick={() => update('marquee', marquee.filter((_, idx) => idx !== i))}
                    aria-label={`Remove marquee item ${i + 1}`}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              ))}
              {marquee.length === 0 ? <div className="repeat-empty">The marquee is empty. Add an item below.</div> : null}
            </div>
            <button
              type="button"
              className="a-btn a-btn-sm"
              style={{ marginTop: 10 }}
              onClick={() => update('marquee', [...marquee, 'New sector'])}
            >
              <Icon name="plus" size={13} /> Add marquee item
            </button>
          </div>
        </div>
      ) : null}

      <div className="form-actions">
        <button type="button" className="a-btn a-btn-gold" onClick={note}>
          <Icon name="check" size={15} /> Everything is saved
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Appearance
   ============================================================ */

function AppearancePage({ toast }) {
  const { data, theme, update } = useStore();
  const settings = data.theme;

  const setTheme = (patch) => update('theme', { ...settings, ...patch });

  const applyPreset = (preset) => {
    update('theme', { ...settings, preset: preset.name, accent: preset.accent, accentLight: preset.accentLight, ink: preset.ink, bg: preset.bg });
    toast(`${preset.name} theme applied.`);
  };

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Appearance</h2>
          <p>Control the colour palette and corner radius of the public website. Changes apply live.</p>
        </div>
        <div className="page-intro-actions">
          <a className="a-btn" href="#home" target="_blank" rel="noreferrer">
            <Icon name="external" size={14} /> Preview site
          </a>
        </div>
      </div>

      <div className="theme-split">
        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Theme presets</h3><p>Start from a considered palette, then fine-tune below.</p></div>
          </div>
          <div className="a-card-body">
            <div className="preset-grid">
              {THEME_PRESETS.map((preset) => {
                const active = settings.accent === preset.accent && settings.ink === preset.ink;
                return (
                  <button
                    type="button"
                    key={preset.name}
                    className={`preset-card ${active ? 'active' : ''}`}
                    onClick={() => applyPreset(preset)}
                  >
                    {active ? <span className="preset-check">✓</span> : null}
                    <span className="preset-swatch">
                      <i style={{ background: preset.ink }} />
                      <i style={{ background: preset.accent }} />
                      <i style={{ background: preset.accentLight }} />
                      <i style={{ background: preset.bg }} />
                    </span>
                    <b>{preset.name}</b>
                    <span>{preset.accent.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>

            <div className="form-grid" style={{ marginTop: 20 }}>
              <Field label="Primary accent" hint="Buttons, links and highlights.">
                <ColorField value={settings.accent} onChange={(v) => setTheme({ accent: v, preset: 'Custom' })} />
              </Field>
              <Field label="Light accent" hint="Highlights on dark backgrounds.">
                <ColorField value={settings.accentLight} onChange={(v) => setTheme({ accentLight: v, preset: 'Custom' })} />
              </Field>
              <Field label="Ink / dark colour" hint="Headings, footer and dark panels.">
                <ColorField value={settings.ink} onChange={(v) => setTheme({ ink: v, preset: 'Custom' })} />
              </Field>
              <Field label="Page background">
                <ColorField value={settings.bg} onChange={(v) => setTheme({ bg: v, preset: 'Custom' })} />
              </Field>
              <Field label="Corner radius" full hint="Controls cards, buttons and image corners across the site.">
                <div className="range-field">
                  <input
                    type="range"
                    min="6"
                    max="40"
                    step="1"
                    value={settings.radius}
                    onChange={(e) => setTheme({ radius: Number(e.target.value) })}
                    aria-label="Corner radius"
                  />
                  <output>{settings.radius}px</output>
                </div>
              </Field>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
              <button type="button" className="a-btn a-btn-sm" onClick={() => update('theme', { ...defaultData.theme })}>
                <Icon name="reset" size={13} /> Reset to brand default
              </button>
              <span className="badge plain">Preset: {settings.preset}</span>
            </div>
          </div>
        </div>

        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Live preview</h3><p>Applied to the website and this console instantly.</p></div>
          </div>
          <div className="a-card-body">
            <div className="theme-preview">
              <div className="tp-bar">
                <span className="tp-dot" /><span className="tp-dot" /><span className="tp-dot" />
                <span className="tp-word">{data.brand.name}</span>
              </div>
              <div className="tp-body">
                <span className="tp-kicker">{data.hero.badge} · {data.hero.location}</span>
                <div className="tp-title">{data.hero.title}<br /><em>{data.hero.titleAccent}</em></div>
                <p className="tp-text">{data.hero.lead}</p>
                <div className="tp-actions">
                  <span className="tp-btn">{data.hero.primaryCta}</span>
                  <span className="tp-ghost">{data.hero.secondaryCta}</span>
                </div>
              </div>
              <div className="tp-cards">
                <span className="tp-card" /><span className="tp-card" /><span className="tp-card" />
              </div>
              <div className="tp-foot">Built for the real world · {data.brand.since}</div>
            </div>

            <div className="form-grid" style={{ marginTop: 18 }}>
              {[
                ['Accent', theme['--gold']],
                ['Light accent', theme['--gold-light']],
                ['Ink', theme['--ink']],
                ['Background', theme['--bg']],
              ].map(([label, value]) => (
                <div className="field" key={label}>
                  <span className="field-label">{label}</span>
                  <div className="color-field">
                    <span style={{ width: 46, height: 40, borderRadius: 9, background: value, border: '1px solid var(--a-line)' }} />
                    <input type="text" value={value} readOnly aria-label={label} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Settings
   ============================================================ */

function SettingsPage({ toast }) {
  const { data, authenticate, logout, exportData, importData, resetAll } = useStore();
  const [account, setAccount] = useState({
    name: data.auth.name || '',
    email: data.auth.email || '',
    password: data.auth.password || '',
  });
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const saveAccount = (e) => {
    e.preventDefault();
    if (!account.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (account.password.length < 6) {
      setError('Use a password of at least 6 characters.');
      return;
    }
    setError('');
    authenticate(account.name.trim() || 'Site Admin', account.email.trim(), account.password);
    toast('Account details updated for this browser.');
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    if (importData(text)) {
      toast('Backup imported successfully.');
    } else {
      toast('That file could not be imported.');
    }
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Reset all content, records and settings to the original demo data? This cannot be undone.')) {
      resetAll();
      toast('All data reset to defaults.');
    }
  };

  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <h2>Settings</h2>
          <p>Your admin account and the data stored in this browser.</p>
        </div>
      </div>

      <div className="notice">
        <Icon name="warning" size={16} />
        <span>
          <b>Demo build.</b> Authentication and data live entirely in this browser&apos;s local storage.
          There is no server, the credentials are not encrypted, and clearing browser data will
          erase everything. Use export regularly and replace this with a secure backend before going live.
        </span>
      </div>

      <div className="settings-grid">
        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Admin account</h3><p>Sign-in details for this console.</p></div>
          </div>
          <div className="a-card-body">
            <form onSubmit={saveAccount} className="form-grid">
              {error ? <div className="login-error full"><Icon name="warning" size={15} /><span>{error}</span></div> : null}
              <Field label="Display name" full>
                <input type="text" value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} />
              </Field>
              <Field label="Email address" full>
                <input type="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} />
              </Field>
              <Field label="Password" full hint="At least 6 characters. Stored in plain text in this demo.">
                <input type="text" value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} />
              </Field>
              <div className="form-actions full">
                <button type="submit" className="a-btn a-btn-primary">
                  <Icon name="check" size={15} /> Save account
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Your data</h3><p>Back up, restore or clear the console.</p></div>
          </div>
          <div className="a-card-body">
            <div className="data-actions">
              <button type="button" className="data-action" onClick={exportData}>
                <span className="qi"><Icon name="download" size={16} /></span>
                <span><b>Export backup</b><small>Download all content and records as JSON.</small></span>
                <Icon name="arrow" size={15} />
              </button>

              <button type="button" className="data-action" onClick={() => fileRef.current?.click()}>
                <span className="qi"><Icon name="upload" size={16} /></span>
                <span><b>Import backup</b><small>Restore content from a previously exported file.</small></span>
                <Icon name="arrow" size={15} />
              </button>
              <input ref={fileRef} type="file" accept="application/json,.json" className="file-input" onChange={handleImport} />

              <button type="button" className="data-action" onClick={handleReset}>
                <span className="qi"><Icon name="reset" size={16} /></span>
                <span><b>Reset everything</b><small>Restore the original demo content and records.</small></span>
                <Icon name="arrow" size={15} />
              </button>

              <button type="button" className="data-action" onClick={() => { logout(); }}>
                <span className="qi"><Icon name="logout" size={16} /></span>
                <span><b>Sign out</b><small>End this admin session.</small></span>
                <Icon name="arrow" size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="a-card">
          <div className="a-card-head">
            <div><h3>What is stored</h3><p>At-a-glance demo information.</p></div>
          </div>
          <div className="a-card-body">
            <div className="about-demo">
              <div className="kv"><span>Storage location</span><b>This browser only</b></div>
              <div className="kv"><span>Projects</span><b>{data.projects.length}</b></div>
              <div className="kv"><span>Enquiries</span><b>{data.enquiries.length}</b></div>
              <div className="kv"><span>Clients</span><b>{data.clients.length}</b></div>
              <div className="kv"><span>Team members</span><b>{data.team.length}</b></div>
              <div className="kv"><span>Tasks</span><b>{data.tasks.length}</b></div>
              <div className="kv"><span>Theme preset</span><b>{data.theme.preset}</b></div>
            </div>
          </div>
        </div>

        <div className="a-card">
          <div className="a-card-head">
            <div><h3>Going live</h3><p>What a production version needs.</p></div>
          </div>
          <div className="a-card-body">
            <div className="notice danger">
              <Icon name="lock" size={16} />
              <span>
                This console is a front-end demonstration. Before publishing as real management
                software, connect a server-side database, use hashed passwords and sessions,
                validate uploads, and restrict access by role.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Shell & routing
   ============================================================ */

const PAGES = [
  { key: 'overview', label: 'Overview', icon: 'dashboard', title: 'Overview', sub: 'Business and website at a glance' },
  { key: 'projects', label: 'Projects', icon: 'projects', title: 'Projects', sub: 'Portfolio and delivery' },
  { key: 'enquiries', label: 'Enquiries', icon: 'enquiries', title: 'Enquiries', sub: 'Website contact requests' },
  { key: 'clients', label: 'Clients', icon: 'clients', title: 'Clients', sub: 'Relationship records' },
  { key: 'team', label: 'Team', icon: 'team', title: 'Team', sub: 'People and responsibilities' },
  { key: 'tasks', label: 'Tasks', icon: 'tasks', title: 'Tasks', sub: 'Delivery board' },
  { key: 'content', label: 'Site content', icon: 'content', title: 'Site content', sub: 'Edit every word on the website' },
  { key: 'appearance', label: 'Appearance', icon: 'appearance', title: 'Appearance', sub: 'Colours and visual style' },
  { key: 'settings', label: 'Settings', icon: 'settings', title: 'Settings', sub: 'Account and data' },
];

const NAV_GROUPS = [
  ['Workspace', ['overview', 'projects', 'enquiries', 'clients', 'team', 'tasks']],
  ['Website', ['content', 'appearance']],
  ['System', ['settings']],
];

function AdminShell() {
  const { data, theme, logout } = useStore();
  const hash = useHashRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toastData, setToastData] = useState(null);

  const pageKey = (hash.replace(/^#\/?/, '').split('/')[1] || 'overview').replace(/\/.*$/, '');
  const currentPage = PAGES.find((p) => p.key === pageKey) || PAGES[0];

  const toast = (message) => setToastData({ message, id: Date.now() });

  useEffect(() => {
    if (!toastData) return;
    const timer = setTimeout(() => setToastData(null), 2800);
    return () => clearTimeout(timer);
  }, [toastData]);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.title = `${currentPage.title} · Dipanshu Management`;
  }, [pageKey, currentPage.title]);

  useEffect(() => {
    const previous = document.body.style.background;
    document.body.style.background = '#f3f2ed';
    return () => {
      document.body.style.background = previous;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navigate = (key) => {
    window.location.hash = `#/admin/${key}`;
    setMenuOpen(false);
  };

  const newEnquiries = data.enquiries.filter((e) => e.status === 'new').length;
  const openTasks = data.tasks.filter((t) => t.status !== 'Done').length;

  const counts = {
    enquiries: newEnquiries,
    tasks: openTasks,
    projects: data.projects.length,
  };

  const pages = {
    overview: <OverviewPage navigate={navigate} />,
    projects: <ProjectsPage toast={toast} />,
    enquiries: <EnquiriesPage toast={toast} />,
    clients: <ClientsPage toast={toast} />,
    team: <TeamPage toast={toast} />,
    tasks: <TasksPage toast={toast} />,
    content: <ContentPage toast={toast} />,
    appearance: <AppearancePage toast={toast} />,
    settings: <SettingsPage toast={toast} />,
  };

  return (
    <div className="admin" style={theme}>
      <div className={`side-scrim ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)} />
      <div className="admin-shell">
        <aside className={`side ${menuOpen ? 'open' : ''}`}>
          <a className="side-brand" href="#/admin/overview" onClick={() => setMenuOpen(false)}>
            <img src={data.brand.logo} alt="" />
            <span>
              <b>{data.brand.name}</b>
              <small>{data.brand.sub}</small>
            </span>
          </a>

          <nav className="side-nav" aria-label="Management">
            {NAV_GROUPS.map(([group, keys]) => (
              <React.Fragment key={group}>
                <span className="side-label">{group}</span>
                {keys.map((key) => {
                  const p = PAGES.find((x) => x.key === key);
                  return (
                    <a
                      key={key}
                      className={`side-link ${pageKey === key ? 'active' : ''}`}
                      href={`#/admin/${key}`}
                      aria-current={pageKey === key ? 'page' : undefined}
                    >
                      <Icon name={p.icon} size={17} />
                      {p.label}
                      {counts[key] ? <span className="count">{counts[key]}</span> : null}
                    </a>
                  );
                })}
              </React.Fragment>
            ))}
          </nav>

          <div className="side-foot">
            <a className="side-site" href="#home">
              <Icon name="external" size={15} /> View public website
            </a>
            <div className="side-user">
              <span className="avatar">{initials(data.auth.name)}</span>
              <div style={{ minWidth: 0 }}>
                <b>{data.auth.name}</b>
                <span>{data.auth.email}</span>
              </div>
              <button type="button" className="a-btn a-btn-icon" onClick={logout} aria-label="Sign out" title="Sign out">
                <Icon name="logout" size={15} />
              </button>
            </div>
          </div>
        </aside>

        <div className="admin-main">
          <header className="topbar">
            <button
              type="button"
              className="a-btn a-btn-icon topbar-menu"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              aria-expanded={menuOpen}
            >
              <Icon name="menu" size={18} />
            </button>
            <div className="topbar-title">
              <h1>{currentPage.title}</h1>
              <p>{currentPage.sub}</p>
            </div>
            <div className="topbar-actions">
              <a className="a-btn a-btn-sm" href="#home">
                <Icon name="external" size={14} /> <span>View site</span>
              </a>
              <span className="topbar-user">
                <span className="avatar">{initials(data.auth.name)}</span>
                <span>{data.auth.name}</span>
              </span>
            </div>
          </header>

          <main className="admin-content">{pages[pageKey] || pages.overview}</main>
        </div>
      </div>

      {toastData ? (
        <div className="a-toast" role="status" key={toastData.id}>
          <Icon name="check" size={16} />
          {toastData.message}
        </div>
      ) : null}
    </div>
  );
}

export default function Admin() {
  const { isAuthed } = useStore();
  return isAuthed ? <AdminShell /> : <Login />;
}
