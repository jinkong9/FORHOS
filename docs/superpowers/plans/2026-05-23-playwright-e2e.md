# Playwright E2E Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add browser-level E2E coverage and a GitHub Actions workflow for the Vite React app.

**Architecture:** Playwright runs against the built Vite app served by `vite preview`. Tests focus on route-level smoke coverage and protected-route behavior so CI catches broken navigation and rendering quickly.

**Tech Stack:** React, Vite, TypeScript, Playwright, GitHub Actions.

---

### Task 1: Add Playwright Test Runner

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] Install `@playwright/test` as a dev dependency.
- [ ] Add `e2e` and `e2e:ui` npm scripts.

### Task 2: Add E2E Configuration

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/app.spec.ts`

- [ ] Configure Playwright to build and preview the app on `127.0.0.1:4173`.
- [ ] Add smoke tests for public routes and signed-out protected-route redirection.

### Task 3: Add GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/e2e.yml`

- [ ] Install Node dependencies with `npm ci` inside `hos`.
- [ ] Install Playwright browsers.
- [ ] Run `npm run e2e`.
- [ ] Upload the Playwright HTML report on every run.

### Task 4: Verify Locally

- [ ] Run `npm run build`.
- [ ] Run `npm run e2e`.
- [ ] Report any existing app errors that block E2E execution.
