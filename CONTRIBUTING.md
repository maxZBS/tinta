# Contributing to Tinta

Thanks for your interest in Tinta. Contributions are welcome under the terms
below.

## Licensing of contributions

Tinta is **source-available** under the
[PolyForm Noncommercial License](./LICENSE) — it is **not** open source, and
**commercial use requires a separate license** (see
[`COMMERCIAL-LICENSE.md`](./COMMERCIAL-LICENSE.md)).

By submitting a contribution (a pull request, patch, or similar), you agree
that:

- Your contribution is your own original work, and you have the right to submit
  it.
- You license your contribution to the project owner under terms that allow the
  owner to distribute it under the project's current license **and** under the
  separate commercial license. In short: you grant the owner a perpetual,
  worldwide, royalty-free license to use and relicense your contribution as part
  of Tinta.

If you cannot agree to this, please do not submit a contribution.

## Before you start

- Read [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) — it is the single source of truth
  for architecture, code style, and conventions.
- For anything non-trivial, **open an issue first** to discuss the approach.

## Development setup

Prerequisites: [Bun](https://bun.sh), the
[Rust toolchain](https://www.rust-lang.org/tools/install), and the
[Tauri 2 prerequisites](https://v2.tauri.app/start/prerequisites/) for your OS.

```bash
bun install          # install JS deps
bun run tauri dev    # run the desktop app in dev mode
bun run ts-check     # type-check (TypeScript strict)
bun run tauri build  # produce a release build
```

## Code style (summary)

The full rules live in `INSTRUCTIONS.md`. Highlights:

- ≤150 lines per file, **one component per file**, grouped into theme folders.
- Named exports, `@/*` import aliases, `cn()` for class names, 4-pt spacing grid.
- Blank-line statement grouping; **always use braces** (never collapse
  conditionals onto one line); single-arg arrows omit parens.
- Files kebab-case with a category suffix (`.util` / `.types` / `.store` /
  `.schema` / `.const`); components PascalCase; types live in `.types.ts`.
- **Zustand** for global/persisted state; **Solid signals** for hot local UI.
- All disk access goes through Rust / the `fs` plugin with narrowly-scoped
  capabilities.

## Pull requests

- Keep PRs focused and reasonably small.
- Make sure `bun run ts-check` passes and the app builds.
- Describe what changed and why.
- Performance is the product — call out any change that could affect typing
  latency, autosave, or behavior at long document length.