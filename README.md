# arnavm.com

Personal portfolio site for Arnav Murthi — a dark, editorial one-pager with a
WebGL globe hero, a typewriter role cycler, and a featured-projects grid with
hover video demos. Built with Next.js (App Router), React, Tailwind CSS,
shadcn/ui, and [cobe](https://github.com/shuding/cobe) for the globe.

## Setup

Requires Node.js 20+.

```bash
git clone https://github.com/aLEGEND21/portfolio.git
cd portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Create a production build |
| `npm start`     | Serve the production build |
| `npm run lint`  | Run ESLint               |

## Structure

- `app/` — routes (home, `/projects`), layout, icons
- `components/` — hero, navbar, project grid, footer
- `data/projects.ts` — the single source of truth for project content
- `assets/projects/` — project screenshots (imported as static images)
- `public/videos/` — hover demo clips for featured projects
