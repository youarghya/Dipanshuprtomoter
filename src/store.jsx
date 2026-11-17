import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { defaultData } from './data.js';

const STORAGE_KEY = 'dipanshu.management.v1';
const SESSION_KEY = 'dipanshu.session.v1';

const COLLECTIONS = ['projects', 'enquiries', 'clients', 'team', 'tasks'];

/* ---------- colour helpers ---------- */

function clamp(n, min = 0, max = 255) {
  return Math.min(max, Math.max(min, n));
}

function hexToRgb(hex) {
  if (typeof hex !== 'string') return { r: 12, g: 43, b: 36 };
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return { r: 12, g: 43, b: 36 };
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  const to = (v) => clamp(Math.round(v)).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

function mix(a, b, weight = 0.5) {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return rgbToHex({
    r: x.r + (y.r - x.r) * weight,
    g: x.g + (y.g - x.g) * weight,
    b: x.b + (y.b - x.b) * weight,
  });
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channel = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function isLight(hex) {
  return luminance(hex) > 0.55;
}

export function contrastOn(hex) {
  return isLight(hex) ? '#0c2b24' : '#ffffff';
}

/* ---------- data helpers ---------- */

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Merge stored data over the defaults so that new fields added to the
 * application still appear for people with older saved data.
 */
function mergeDefaults(base, override) {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base;
  }
  if (isPlainObject(base)) {
    if (!isPlainObject(override)) return base;
    const out = {};
    for (const key of Object.keys(base)) {
      out[key] = mergeDefaults(base[key], override[key]);
    }
    for (const key of Object.keys(override)) {
      if (!(key in out)) out[key] = override[key];
    }
    return out;
  }
  return override === undefined ? base : override;
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isPlainObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function uid(prefix = 'id') {
  const random = Math.random().toString(36).slice(2, 7);
  return `${prefix}_${Date.now().toString(36)}${random}`;
}

export function themeVars(theme) {
  const accent = theme?.accent || defaultData.theme.accent;
  const accentLight = theme?.accentLight || defaultData.theme.accentLight;
  const ink = theme?.ink || defaultData.theme.ink;
  const bg = theme?.bg || defaultData.theme.bg;
  const radius = Number(theme?.radius) || defaultData.theme.radius;

  return {
    '--bg': bg,
    '--bg-soft': mix(bg, ink, 0.06),
    '--surface': mix(bg, '#ffffff', 0.62),
    '--ink': ink,
    '--ink-2': mix(ink, '#ffffff', 0.08),
    '--muted': mix(ink, bg, 0.34),
    '--gold': accent,
    '--gold-ink': mix(accent, '#000000', 0.3),
    '--gold-light': accentLight,
    '--gold-soft': mix(accent, bg, 0.8),
    '--line': rgba(ink, 0.11),
    '--line-strong': rgba(ink, 0.2),
    '--line-dark': 'rgba(255, 255, 255, 0.12)',
    '--radius-xl': `${radius + 10}px`,
    '--radius-lg': `${radius}px`,
    '--radius-md': `${Math.round(radius * 0.66)}px`,
    '--accent-contrast': contrastOn(accent),
  };
}

/* ---------- context ---------- */

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [data, setData] = useState(() => mergeDefaults(defaultData, readStored() || {}));
  const [session, setSession] = useState(() => {
    try {
      return localStorage.getItem(SESSION_KEY) || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage may be unavailable — the app still works in memory */
    }
  }, [data]);

  useEffect(() => {
    try {
      if (session) localStorage.setItem(SESSION_KEY, session);
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, [session]);

  const update = useCallback((section, value) => {
    setData((prev) => ({ ...prev, [section]: value }));
  }, []);

  const updateField = useCallback((section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }, []);

  const updateNested = useCallback((section, field, subfield, value) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: { ...prev[section][field], [subfield]: value },
      },
    }));
  }, []);

  const addItem = useCallback((collection, item) => {
    setData((prev) => ({
      ...prev,
      [collection]: [item, ...(prev[collection] || [])],
    }));
  }, []);

  const addEnquiry = useCallback(
    (enquiry) => addItem('enquiries', enquiry),
    [addItem]
  );

  const updateItem = useCallback((collection, id, patch) => {
    setData((prev) => ({
      ...prev,
      [collection]: (prev[collection] || []).map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));
  }, []);

  const removeItem = useCallback((collection, id) => {
    setData((prev) => ({
      ...prev,
      [collection]: (prev[collection] || []).filter((item) => item.id !== id),
    }));
  }, []);

  const saveProject = useCallback((project) => {
    setData((prev) => {
      const exists = (prev.projects || []).some((p) => p.id === project.id);
      const next = exists
        ? prev.projects.map((p) => (p.id === project.id ? { ...p, ...project } : p))
        : [...prev.projects, project];
      // Only one project may be featured at a time.
      const projects = project.featured
        ? next.map((p) => ({ ...p, featured: p.id === project.id }))
        : next;
      return { ...prev, projects };
    });
  }, []);

  const setFeaturedProject = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((p) => ({ ...p, featured: p.id === id })),
    }));
  }, []);

  const deleteProject = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((p) => p.id !== id),
    }));
  }, []);

  const login = useCallback(
    (email, password) => {
      const account = data.auth || {};
      const ok =
        String(email).trim().toLowerCase() === String(account.email || '').trim().toLowerCase() &&
        String(password) === String(account.password || '');
      if (ok) setSession(String(email).trim());
      return ok;
    },
    [data.auth]
  );

  const logout = useCallback(() => setSession(''), []);

  const authenticate = useCallback(
    (name, email, password) => {
      setData((prev) => ({
        ...prev,
        auth: { ...prev.auth, name, email, password },
      }));
      setSession(email);
    },
    []
  );

  const resetAll = useCallback(() => {
    setData(mergeDefaults(defaultData, {}));
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dipanshu-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((json) => {
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json;
      if (!isPlainObject(parsed)) return false;
      setData(mergeDefaults(defaultData, parsed));
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      data,
      theme: themeVars(data.theme),
      collections: COLLECTIONS,
      update,
      updateField,
      updateNested,
      addItem,
      addEnquiry,
      updateItem,
      removeItem,
      saveProject,
      deleteProject,
      setFeaturedProject,
      isAuthed: Boolean(session),
      sessionEmail: session,
      login,
      logout,
      authenticate,
      resetAll,
      exportData,
      importData,
      uid,
    }),
    [
      data,
      update,
      updateField,
      updateNested,
      addItem,
      addEnquiry,
      updateItem,
      removeItem,
      saveProject,
      deleteProject,
      setFeaturedProject,
      session,
      login,
      logout,
      authenticate,
      resetAll,
      exportData,
      importData,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}

export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#home');

  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '#home');
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return hash;
}
