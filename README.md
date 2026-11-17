# Dipanshu Promoter & Builder — Website & Management Console

A modern, project-led website for **Dipanshu Promoter & Builder Pvt. Ltd.**, plus a fully
editable management console for projects, enquiries, clients, team, tasks and every piece of
website content.

Built with **React, Vite, and plain CSS** — no backend services or extra dependencies.

---

## Two connected experiences

| Experience | URL | Purpose |
| --- | --- | --- |
| Public website | `/` | Featured project, filterable portfolio, project details, company story and enquiry form |
| Management console | `/#/admin` | Login-protected dashboard for content, projects, enquiries, clients, team, tasks, appearance and settings |

The public site and the console share one data store, so edits made in the console appear on the
website immediately.

## Demo sign-in

The console ships with a demo account:

```text
Email:    admin@dipanshu.in
Password: admin123
```

You can sign in manually or use the **Use demo sign in** button on the login screen.

> ⚠️ **Demo security only.** Authentication runs entirely in the browser. Credentials are stored
> in plain text inside `localStorage`, there is no server-side session, and anyone with access to
> the browser or the source can read or change the data. This is suitable for a prototype or
> internal demonstration only — **not for production use**.

## What you can customise

### Website content
- Brand name, descriptor, legal name, logo path, footer banner and experience line
- Hero badge, headline, accent line, lead text, buttons, links and background image
- About section copy, image, captions, promise text, experience counter and quality card
- Expertise heading, subtitle and every capability card (add/remove)
- Approach heading, lead and every process step (add/remove)
- Contact heading, address, working hours and external website link
- Projects section labels, featured labels, subtitle and disclaimer
- Call-to-action band copy and button label
- Footer tagline and location note
- Scrolling marquee items (add/remove)

### Projects
- Add, edit and delete portfolio projects
- Fields include title, sector, type, location, year, status, cover image, short and long
  descriptions, scope of work, project number and featured flag
- Star any project to feature it on the homepage
- Live preview of the selected cover image while editing

### Appearance
- Five curated theme presets
- Custom accent, light accent, ink and background colours
- Corner-radius slider
- Live preview inside the console
- Theme is applied to both the public site and the console

### Operations
- **Enquiries:** review messages from the website form, mark new/read/replied, reply by email
- **Clients:** company, contact person, email, phone and internal notes
- **Team:** people, roles and contact details, with open-task counts
- **Tasks:** Open / In progress / Done board, project and assignee links, due dates and priority

### Data controls
- **Export backup:** download all content and records as JSON
- **Import backup:** restore a previously exported file
- **Reset everything:** restore the original demo data
- **Account settings:** change display name, sign-in email and password

## Features

- Modern editorial design system with forest green, warm gold and neutral tones
- Project-led homepage with a featured project showcase
- Filterable project portfolio across five sectors
- Clickable project detail dialogs with scope, facts and status
- Full management console with login gate and responsive sidebar
- Shared data store with automatic `localStorage` persistence
- Theme presets plus custom colour and radius controls
- Scroll-reveal animations and refined hover interactions
- Responsive desktop, tablet and mobile layouts
- Accessible focus states, reduced-motion support and SEO metadata
- Lighthouse scores of 100 for accessibility, best practices and SEO

## Tech stack

- React
- Vite
- HTML5 and CSS3
- Google Fonts (Manrope, DM Sans and Instrument Serif)
- Unsplash imagery for visual placeholders

## Requirements

- Node.js 18 or newer recommended
- npm
- Internet connection for externally hosted fonts and images

## Getting started

```bash
npm install
npm run dev
```

Vite will print a local URL, typically <http://localhost:5173>.

Open the website at the printed URL. Open the console at:

```text
http://localhost:5173/#/admin
```

## Production build

```bash
npm run build
```

The optimized files are written to `dist/`.

Preview the production build locally:

```bash
npm run preview
```

## Project structure

```text
dipanshu-promoter-builder/
├── index.html
├── package.json
├── README.md
├── public/
│   ├── logo.png              # Real brand logo
│   ├── banier.png            # Footer wordmark banner
│   └── robots.txt
└── src/
    ├── App.jsx               # Public website
    ├── Admin.jsx             # Login, dashboard and all management pages
    ├── data.js               # Default content, demo records and theme presets
    ├── main.jsx              # App entry and hash router
    ├── store.jsx             # Shared state, persistence, auth, CRUD, theme engine
    ├── styles.css            # Public website styles
    └── admin.css             # Management console styles
```

## Routes

The app uses lightweight hash routing, so no server rewrite rules are required:

- `/#home`, `/#projects`, `/#expertise`, `/#about`, `/#approach`, `/#contact` — public site
- `/#/admin` — console overview
- `/#/admin/projects`, `/#/admin/enquiries`, `/#/admin/clients`, `/#/admin/team`,
  `/#/admin/tasks`, `/#/admin/content`, `/#/admin/appearance`, `/#/admin/settings` — console pages

## Data and persistence

All data lives in the browser under the `dipanshu.management.v1` local-storage key, and the
signed-in session under `dipanshu.session.v1`.

- Data persists across reloads in the same browser.
- Data is **not** shared between browsers or devices.
- Clearing browser data erases everything.
- Use **Settings → Export backup** regularly.
- Importing a backup merges it over the current defaults, so missing fields are filled in safely.

## Enquiry form

Submitting the website contact form now creates an enquiry record in the management console. It
does **not** send email or transmit data to a server. A production deployment should connect the
form to a secure backend, CRM or approved form service with validation, spam protection and
privacy information.

## Before publishing

- Replace the demo account and move authentication to a secure server-side backend
- Use hashed passwords, secure sessions, rate limiting and role-based access
- Store content and records in a real database with backups
- Replace Unsplash placeholders with company-owned or approved project images
- Verify company name, address, phone, email and project references
- Connect the enquiry form to the company's actual contact workflow
- Add privacy policy, terms and any legally required disclosures
- Test on mobile, tablet and desktop and re-check accessibility and SEO
- Confirm image and font licensing or usage rights

## Deployment

Build the project and deploy the contents of `dist/` to a static host such as Netlify, Vercel or
an existing web host.

```text
Build command: npm run build
Output folder: dist
```

The hash-based admin route works on static hosting without additional rewrite configuration.
Because data is stored in the browser, a static deployment is a demonstration — real
multi-user management requires a backend.

## Disclaimer

This is a redesign and management-software prototype. It is not an official company website or a
production management system until reviewed, approved and deployed by the company. Project names,
descriptions, images and records are illustrative and should not be presented as verified company
data.
