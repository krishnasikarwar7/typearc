# TypeArc

Type. Play. Code.

A premium, dark-first typing platform combining competitive typing games (**Play**) and developer-focused code typing (**Coder**). This is the frontend foundation: a fully functional local typing engine with mock data for leaderboards, profiles, and history — no backend required yet.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS (design tokens as CSS variables — see `src/styles/index.css`)
- Framer Motion
- React Router
- Lucide React icons

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

To type-check and build for production:

```bash
npm run build
npm run preview
```

## Structure

```text
src/
├── components/
│   ├── ui/          GlassCard, Button, Tabs, ProgressBar, Modal
│   ├── navbar/       Floating/shrinking Navbar
│   ├── typing/       TypingArea, TypingText, TypingTest, Stats, ResultsScreen, HeroPreview
│   ├── gaming/       GameHud, SpeedRun, Hardcore, TypeAttack, Race (Play sub-modes)
│   ├── coder/        CodeEditor (typing-on-code surface)
│   └── dashboard/    LeaderboardRow, WpmChart
├── pages/            Home, Play, Coder, Leaderboard, Profile
├── hooks/            useTypingEngine — the core local typing test engine
├── data/             mockData.ts — words, code snippets, leaderboard, profile stats
├── lib/              utils.ts — cn, generateWords, clamp, formatNumber
├── types/            Shared TS types
└── styles/           index.css — design tokens (colors, radii, shadows, blur)
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing page + core typing test |
| `/play` | Speed Run, Hardcore, Type Attack, Race |
| `/coder` | Language/difficulty selector + code typing |
| `/leaderboard` | Global / Weekly / Friends / Play / Coder tabs |
| `/profile` | Level, stats, WPM history, strengths, recent tests, achievements |

## Design tokens

All color, radius, shadow, and blur values live as CSS variables in `src/styles/index.css` and are wired into Tailwind via `tailwind.config.js`. Change a value once there and it propagates everywhere — no ad hoc hex codes in components.

## What's mocked vs. real

- **Real**: the typing engine (WPM, raw WPM, accuracy, consistency, mistakes), Speed Run, Hardcore, Type Attack, and Race are all playable against live keystroke input.
- **Mocked**: leaderboard entries, profile stats/history, achievements, and race "ghost" opponents are generated from `src/data/mockData.ts`. Swap these for real API calls when the backend exists — component props are already shaped for it.

## Not yet implemented (by design, per spec)

Authentication, a database, real multiplayer, payments, and AI features are intentionally out of scope for this phase.

## Notes for the next pass

- No network access was available while generating this project, so `npm install` has not been run or verified here — please run it locally and report any dependency/build issues.
- Google Fonts (Space Grotesk, Inter, JetBrains Mono) are loaded via `<link>` in `index.html`; swap for self-hosted fonts if you need offline/air-gapped builds.
