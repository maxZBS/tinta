# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in Tinta, please report it
**privately**. Do **not** open a public issue.

Email **info@htmllessons.io** with:

- A description of the issue and its impact.
- Steps to reproduce (proof of concept if possible).
- The version / commit you tested.

You can expect an acknowledgement within a few days. Please give a reasonable
amount of time for a fix before any public disclosure.

## Scope

Tinta is a **local-first, privacy-first** desktop app:

- All notes are stored as Markdown files on the user's device.
- There are **no accounts, no cloud sync, and no telemetry**.
- Disk access goes through Tauri's `fs` plugin with narrowly-scoped capabilities
  (`src-tauri/capabilities/`).

Reports of particular interest:

- Path-traversal or capability-scope escapes that let the app read or write
  outside the user-chosen notes folder.
- Markdown / HTML rendering issues (the app sanitizes with DOMPurify — bypasses
  are in scope).
- Any code execution or data exfiltration vector.

## Supported versions

Only the latest released version is supported with security fixes.
