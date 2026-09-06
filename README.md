# NoteCode — Code Sharing

A small single-page web app for writing a code snippet in the browser and sharing it with a link. Type or paste your code, pick a language and an editor theme, hit **Share**, and you get a URL like `/:id` that reopens the snippet exactly as you left it.

Built with **React 19**, **TypeScript**, **Vite 8**, **Tailwind CSS v4** and the **Monaco editor** (the editor that powers VS Code).

> **Live demo:** <https://code-sharing-blue.vercel.app>
> **Backend repository:** <https://github.com/FR0K3/code-sharing-api> — the API is **not** part of this repository.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Design tokens](#design-tokens)
- [Author](#author)

---

## Features

| Feature | Description |
| --- | --- |
| **Monaco editor** | Full in-browser code editor, preloaded with an HTML starter template (`src/template.html`). |
| **Language switch** | Toggle syntax highlighting between **HTML**, **CSS** and **JavaScript**. |
| **Theme switch** | Switch between **Light** and **VS Dark** — the surrounding UI follows the editor theme. |
| **Share** | Persists the snippet through the API, copies the resulting URL to the clipboard and navigates to `/:id`. |
| **Restore from URL** | Opening `/:id` fetches the snippet and rehydrates code, language and theme. |
| **Dirty-state guard** | The Share button stays disabled until something actually changes, so re-sharing an untouched snippet is impossible. |
| **Copy link button** | Once a snippet is shared, a `.../:id` chip copies the identifier back to the clipboard with visual feedback. |
| **Validated responses** | API payloads are parsed with **Zod** before reaching the UI; anything malformed is rejected. |
| **Toast feedback** | Successes and errors surface as toasts via `react-hot-toast`. |

---

## Tech stack

| Layer | Choice | Version |
| --- | --- | --- |
| UI library | `react` / `react-dom` | `^19.2.8` |
| Language | `typescript` | `~6.0.2` |
| Build tool | `vite` + `@vitejs/plugin-react` | `^8.2.2` / `^6.1.0` |
| Styling | `tailwindcss` + `@tailwindcss/vite` | `^4.3.3` |
| Editor | `@monaco-editor/react` | `^4.7.0` |
| Routing | `react-router` | `^7.18.3` |
| HTTP client | `axios` | `^1.20.0` |
| Validation | `zod` | `^4.5.4` |
| Notifications | `react-hot-toast` | `^2.6.0` |
| Linting | `eslint` + `typescript-eslint` | `^10.9.0` / `^8.67.0` |

Tailwind v4 is configured **entirely in CSS** (`src/index.css` via `@import "tailwindcss"` and an `@theme` block) — there is no `tailwind.config.js`.

---

## Requirements

- **Node.js** `20.19+` or `22.12+` (required by Vite 8)
- **npm** `10+` (or your preferred package manager)
- A running backend exposing the snippets API — see the [backend repository](https://github.com/FR0K3/code-sharing-api)

---

## Environment variables

The checked-in reference file is `.env.template`; `.env` is gitignored.

```dotenv
# .env
VITE_API_URL=http://localhost:4000
```

| Variable | Consumed by | Required | Description |
| --- | --- | --- | --- |
| `VITE_API_URL` | The browser bundle — [`src/lib/axios.ts`](src/lib/axios.ts) | **Yes** (in production) | Base URL prepended to every request. Point it at the backend origin (e.g. `http://localhost:4000`) to call the API directly, or leave it **empty** to issue same-origin `/api/...` requests routed through the Vite dev proxy. |

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR on port `5173` |
| `npm run build` | Type-check the project (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint over the repository |

---

## Project structure

```text
code-sharing/
├── public/
│   ├── favicon.ico
│   └── images/                 Background artwork (SVG + PNG)
├── src/
│   ├── assets/icons/           SVG icons (logo, share, link, arrow)
│   ├── components/
│   │   ├── EditorContainer.tsx Monaco editor, dropdowns, share button — holds app state
│   │   ├── Dropdown.tsx        Accessible custom select
│   │   ├── ShareLink.tsx       Copy-to-clipboard link chip
│   │   └── Spinner.tsx         Loading indicator
│   ├── lib/
│   │   └── axios.ts            Axios instance configured from VITE_API_URL
│   ├── pages/
│   │   └── App.tsx             Page shell — background, heading, editor
│   ├── routes/
│   │   └── AppRoutes.tsx       "/" and "/:id" both render App
│   ├── schemas/
│   │   └── snippets.schema.ts  Zod schemas and inferred types
│   ├── services/
│   │   └── snippets.service.ts API calls + error normalization
│   ├── utils/
│   │   └── ApiError.ts         Error type carrying an HTTP status
│   ├── template.html           Starter snippet loaded into an empty editor
│   ├── index.css               Tailwind import, theme tokens, base styles
│   └── main.tsx                React root + <Toaster />
├── .env.template
├── eslint.config.js
├── vercel.json                 SPA rewrite rules
├── vite.config.ts
└── tsconfig{,.app,.node}.json
```

---

## Design tokens

Custom tokens are declared in the Tailwind v4 `@theme` block in [`src/index.css`](src/index.css):

| Token | Value | Used for |
| --- | --- | --- |
| `--color-sky` | `#406aff` | Primary Share button (light theme) |
| `--color-dark` | `#121826` | Dark surfaces |
| `--color-gray-light` | `#ced6e1` | Dropdown background |
| `--color-gray-dark` | `#364153` | Body text / dropdown label |
| `--color-dark-btn` | `#68748a` | Share button (dark theme) |
| `--color-dark-vs` | `#1e1e1e` | Editor panel background in VS Dark |
| `--text-small-heading` | `32px` | "Create & Share" |
| `--text-large-heading` | `40px` | "Your Code easily" |

The page background is a purple linear gradient applied to `html`, and the app uses the **Outfit** font loaded asynchronously from Google Fonts in `index.html`.

---

## Author

Fernando Roque - FR0K3
