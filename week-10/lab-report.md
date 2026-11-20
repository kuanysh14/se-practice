# Week 10 — Lab report

**Name:** Olzhabay Kuanysh
**Group:** Monday 18:00-19:00
**Date:** 2026-11-20

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | Claude |
| Exact model (with its version, or `not displayed`) | Claude Sonnet 5.5 |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | chat with pasted files |
| Starting point (`week-08` or `week-07`) | week-08 |
| Baseline commit — the checkpoint of Part 0 | b724929 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/` before any change. **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 19 passed (19) on the Week 08 baseline suite. |
| `npm test` | yes | pass | Runs `"test": "vitest run"` from `package.json` (19 passed). |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | `package.json` has no `test:unit` script; npm reports `Missing script: "test:unit"`. |
| `npm run build` | yes | pass | `vite build` compiles the TypeScript/React bundle cleanly. |
| `npm run lint` | yes | pass | `eslint .` exists in `package.json` and runs with `eslint.config.js`. |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text
 RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/week-10/app/project

 ✓ src/booking.test.ts (19)
   ✓ canBook (19)
     ✓ T01 AC4: touching after existing booking is accepted (660-720)
     ✓ T02 AC1: starting exactly at now is rejected (540-570)
     ✓ T03 AC1: zero-duration interval is rejected (720-720)
     ✓ T04 AC1: reversed interval is rejected (750-720)
     ✓ T05 AC1: interval ending past day end is rejected (1380-1441)
     ✓ T06 AC2: exactly 120 minutes is accepted (720-840)
     ✓ T07 AC2: 121 minutes is rejected (720-841)
     ✓ T08 AC4: touching before existing booking is accepted (570-600)
     ✓ T09 AC4: partial overlap is rejected (630-690)
     ✓ T10 AC4: interval containing existing booking is rejected (570-690)
     ✓ T11 AC4: interval inside existing booking is rejected (615-645)
     ✓ T12 AC4: identical interval is rejected (600-660)
     ✓ T13 AC3: blocked room is rejected (660-720, blocked)
     ✓ T14 AC4: empty bookings list has no overlaps (630-690)
     ✓ X1 AC1: starting 1 minute after now is accepted (541-571)
     ✓ X2 AC4: overlapping only the second of two bookings is rejected (720-780)
     ✓ T15 AC5: available request returns true and leaves bookings unchanged (660-720)
     ✓ BUG-A AC4: interval touching existing bookings on both sides is accepted (660-700)
     ✓ BUG-B AC5: non-touching available request returns true without mutating bookings (720-780)

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  17:04:11
   Duration  1.38s (transform 95ms, setup 0ms, collect 109ms, tests 24ms, environment 0ms, prepare 620ms)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text
I haven't read AGENTS.md from disk. This summary comes from the content you pasted, and nothing has been edited.

**Project**
- A React + TypeScript (Vite) page that tells a student whether a campus room is free for a requested time.
- The booking rule is `canBook` in `src/booking.ts`, the page is `src/App.tsx`, and the tests are in `src/booking.test.ts`.

**Acceptance contract**
- AC1: Reject start ≥ end and requests in the past.
- AC2: Enforce a maximum duration of 120 minutes.
- AC3: Reject a blocked room.
- AC4: Reject overlaps. Touching a booking at an endpoint also counts as an overlap.
- AC5: Return Available / Unavailable without changing booking data.

**Commands**
- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm run test:unit`
- Build: `npm run build`

**Permissions and finish steps**
- I may edit any file and add packages when a task needs them.
- If bookings need to persist, it suggests a small Supabase table and a login page.
- Before finishing, I should confirm the page still loads, and once the build passes, publish with `npx netlify deploy --prod`.

**Points I'd check with you before acting**
- **Real KBTU data:** It asks for real room names and the real timetable from the KBTU portal. I can't access the portal, and the timetable may sit behind a login. I'd use clearly labeled sample data unless you provide the real data.
- **Production deploy:** `netlify deploy --prod` publishes publicly and affects a live site. I'd ask you before running it rather than doing it automatically.
- **Supabase and login:** These are only needed if persistence is required. AC5 says availability checks must not change booking data, so I'd skip them unless you ask.

Tell me the task when you're ready and I'll start with the tests.
```

Which rules in its summary are wrong for this project, and how you know:

<!-- Write below this line -->

Five rules in the provided `AGENTS.md` summary are wrong for this project: (1) using real room names and KBTU portal timetables violates the one-fictional-room constraint; (2) AC4 saying touching endpoints count as an overlap contradicts our Week 06–08 acceptance contract and passing tests `T01`, `T08`, and `BUG-A`; (3) `npm run test:unit` does not exist in `package.json` (verified in §2.1 — the script is `npm test`); (4) allowing Supabase and a login page violates the no-login/no-database scope rule; and (5) running `npx netlify deploy --prod` violates the no-external-deployments rule and skips running tests before acceptance.

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

<!-- Write below this line -->

I ran the review in Claude web (`Claude Sonnet 5.5`) by pasting file contents into chat rather than giving file-system write access, and ran `git status` locally afterwards to verify zero working-tree changes.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
I reviewed only what you pasted, ran nothing, and edited nothing. `availability.ts` and `sampleData.ts` were only described, so findings about them are inferences. Risks are ordered roughly by severity.

## Correctness

**1. AC4 contradicts `canBook` (high)**
- **Where:** `src/booking.ts` uses `start < b.end && end > b.start`, which treats back-to-back bookings as non-overlapping. AGENTS.md says touching endpoints count as overlap.
- **Impact:** The code and the contract disagree. A request for 660-720 against an existing 600-660 booking is accepted today but should be rejected per AGENTS.md. An agent obeying AGENTS.md may "fix" it to `<=`/`>=` and flip behavior without anyone deciding which is intended.
- **Verify:** Add a test with the booking 600-660 and the request 660-720, then decide which rule the product wants.
- **Uncertainty:** Back-to-back may be intended and AGENTS.md may simply be wrong. I can't tell which.

**2. Reason logic duplicated in `availability.ts` (high)**
- **Where:** `checkAvailability` calls `canBook`, then re-implements the checks to build reason strings.
- **Impact:** The two can drift apart. From your description, the re-check doesn't cover `start < 0` or `end > 1440`, so `canBook` could return false with no matching reason, giving a blank or wrong message. `overlapsExisting` may also treat endpoints differently from `canBook`.
- **Verify:** Run a consistency test over many generated inputs and check that `canBook(x) === true` exactly when no reason is returned. Check that `overlapsExisting` agrees with the contract on endpoints.
- **Uncertainty:** I haven't seen `overlapsExisting` or the fallback path.

**4. Weak input and data validation (medium)**
- **Where:** the range check and the booking loop in `canBook`.
- **Impact:** Non-integer minutes pass. A malformed booking with `b.start >= b.end` can never match the overlap test, so it is silently ignored and double-booking becomes possible. `NaN` is rejected, which is fine.
- **Verify:** Test fractional minutes and a booking `{start: 700, end: 600}`.

## Privacy and security

**6. Real timetable and organizer names (high)**
- **Where:** AGENTS.md ("use real KBTU timetable"), `sampleData.ts` (organizer names).
- **Impact:** A Vite app bundles its data into public client JS. Combined with `netlify deploy --prod`, real names and schedules (someone's physical whereabouts) would be published.

**7. Supabase and login suggestion (medium-high)**
- **Where:** AGENTS.md, "You may" section.
- **Impact:** This is a large scope jump and sits uneasily with AC5.

## Reliability and agent operations

**9. `npm run test:unit` doesn't exist (high for agents)**
- **Where:** AGENTS.md vs. `package.json`, where the script is `test` (`vitest run`).
- **Impact:** The command fails with "missing script", so an agent may skip tests, claim they passed, or invent a script.

**10. Automatic production deploy (high)**
- **Where:** AGENTS.md "Before you finish".
- **Impact:** The deploy is triggered by "build passes", but `vite build` doesn't run tests or lint, so a failing test suite can still ship.

**11. No safety net (medium)**
- **Where:** no CI, no husky, no prettier; lint isn't in the finish steps.

**13. Mutation (AC5) is unverified (low)**
- **Impact:** `canBook` doesn't mutate its input, but I haven't seen `checkAvailability`. A sort or splice on `bookings` there would break AC5.
```

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | `AGENTS.md` tells agents to run `npx netlify deploy --prod`, use real KBTU data, and run missing `npm run test:unit`. | Agent operations | Opened `app/project/AGENTS.md` and `app/project/package.json` and ran `npm run test:unit`. | confirmed | `AGENTS.md` contains all three bad instructions verbatim, and `npm run test:unit` fails with `Missing script`. |
| 2 | `canBook` accepts non-integer (fractional) minutes like `660.5`. | Correctness | Opened `app/project/src/booking.ts` (`canBook`) and checked `0 <= start && start < end && end <= 1440`. | confirmed | `canBook` has no `Number.isInteger()` check, so `canBook({ start: 660.5, end: 720, ... })` returns `true` instead of `false`. |
| 3 | `checkAvailability` in `availability.ts` does not check `start < 0` or `end > 1440`. | Correctness | Opened `app/project/src/lib/availability.ts` and read `checkAvailability()`. | unsupported | `availability.ts` explicitly checks `if (!(0 <= start && start < end && end <= MINUTES_PER_DAY))` and pushes an interval-bounds message. |
| 4 | `checkAvailability` duplicates duration, overlap, and blocked checks from `canBook`. | Maintainability | Opened `app/project/src/lib/availability.ts` and `src/booking.ts` side by side. | confirmed | `availability.ts` re-runs `overlapsExisting()`, `end - start > 120`, and `room.blocked` after calling `canBook`. |
| 5 | `sampleData.ts` organizer names and `netlify deploy --prod` could leak real student whereabouts. | Privacy | Opened `app/project/src/data/sampleData.ts` and `AGENTS.md`. | plausible | Current names in `sampleData.ts` are fictional, so nothing real leaks today, but following `AGENTS.md` would introduce real KBTU timetables. |
| 6 | `checkAvailability` might mutate `bookings` via `sort` or `splice` (breaking AC5). | Reliability | Opened `app/project/src/lib/availability.ts` and inspected `overlapsExisting()`. | unsupported | `availability.ts` only iterates `for (const b of bookings)` without calling `push`, `sort`, or `splice`. |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Agent operations | `AGENTS.md` contains contradictory rules (real KBTU data, Supabase/login, `npx netlify deploy --prod`, wrong AC4, missing `npm run test:unit`) → an autonomous agent breaks AC4, adds out-of-scope auth/DB, or deploys untested code → contract violation and unintended production publish. | `AGENTS.md` | Inspected `app/project/AGENTS.md` and ran `npm run test:unit` (missing script). | confirmed | 3 | 3 | 9 | Apply minimal approved patch to `AGENTS.md` enforcing C1–C6 and replacing `npm run test:unit` with `npm test`. | Olzhabay Kuanysh | `python tests/check_audit.py` (`A2`, `A3`, `C1`–`C6` PASS) and `git diff app/project/AGENTS.md`. |
| R2 | Correctness | `canBook` checks only range inequalities without `Number.isInteger()` and keeps all guards inline → fractional minutes such as `660.5` are accepted → invalid non-whole-minute bookings pass AC1 and validation logic is harder to maintain. | `src/booking.ts` | Inspected `canBook` in `src/booking.ts` and ran regression test `R2` (`660.5–720` returned `true`, failing before fix). | confirmed | 2 | 3 | 6 | Refactor `src/booking.ts` into small pure guard helpers including `hasIntegerMinutes` (`Number.isInteger`) while keeping `canBook` signature unchanged. | Olzhabay Kuanysh | Regression test `R2 AC1` fails before fix (§7.1) and passes with full 20-test Vitest suite after fix (§8.4). |
| R3 | Maintainability | `checkAvailability` re-implements overlap, duration, and blocked checks to build UI reason strings → future rule changes in `canBook` are not mirrored in `availability.ts` → UI displays contradictory or blank rejection messages. | `src/lib/availability.ts` | Inspected `checkAvailability` and `overlapsExisting` in `src/lib/availability.ts`. | confirmed | 2 | 2 | 4 | Centralize rule helpers in `src/booking.ts` and have `availability.ts` import them directly. | Olzhabay Kuanysh | Code inspection and unit test comparing `canBook` verdict against reason list emptiness. |
| R4 | Reliability | Repository lacks CI workflow and pre-commit hooks → broken code or failing tests can be pushed to a branch without automated gating → regressions reach review unnoticed. | `missing: CI workflow and pre-commit hooks` | Checked repo root and `app/project/` — no `.github/workflows/` or `.husky/`. | confirmed | 2 | 2 | 4 | Require local `npm test` and `npm run build` before PR submission and add a GitHub Actions workflow in a follow-up PR. | Olzhabay Kuanysh | Readiness audit §5.1 (`3a`, `3b`) and manual `npm test` output attached to PR. |
| R5 | Privacy | `sampleData.ts` includes organizer names alongside time slots → if replaced with real student data, Vite bundles personal schedules into client JS → privacy exposure of student whereabouts. | `src/data/sampleData.ts` | Inspected `src/data/sampleData.ts` (currently fictional names only). | plausible | 1 | 3 | 3 | Keep strictly fictional data in `AGENTS.md` (C1) and avoid real names in sample fixtures. | Olzhabay Kuanysh | `AGENTS.md` C1 rule and inspection of `src/data/sampleData.ts`. |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R1** — Confirmed (`3 × 3 = 9`): `AGENTS.md` directly instructs agents to run `npx netlify deploy --prod`, use real KBTU portal data, add Supabase/login, break AC4, and run non-existent `npm run test:unit`, making severe scope and deployment failures likely on any agent run.
2. **R2** — Confirmed (`2 × 3 = 6`): `src/booking.ts` lacks integer-minute validation (`Number.isInteger`) and mixes all five checks inline, verified by regression test `R2` (`660.5–720`) failing on the baseline code.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | No `.prettierrc` / `prettier.config.*` file and no `prettier` dependency in `package.json`. |
| 1b | Linter | yes | `eslint.config.js` exists and `eslint` (`"lint": "eslint ."`) is configured in `package.json`. |
| 1c | Type checks | yes | `tsconfig.json` exists and `typescript` is installed in `package.json` `devDependencies`. |
| 1d | Unit tests | yes | `src/booking.test.ts` exists with 20 Vitest tests and `vitest` is in `package.json`. |
| 1e | Pinned dependencies (lockfile) | yes | `package-lock.json` is committed in `app/project/`. |
| 2a | `.env.example` | no | No `.env.example` file exists in `app/project/` (no environment variables are used). |
| 2b | Architecture notes | no | No `README.md` or architecture overview exists inside `app/project/`. |
| 2c | `AGENTS.md` | yes | `app/project/AGENTS.md` exists and was patched in Task 6 to match project constraints. |
| 3a | CI | no | No `.github/workflows/` pipeline exists to run `npm test` or `npm run build` automatically. |
| 3b | Pre-commit hooks | no | No `.husky/`, `.pre-commit-config.yaml`, or `lint-staged` configuration exists. |
| 3c | Integration checks | no | Tests only unit-test `canBook()` directly; no React DOM or end-to-end integration tests exist. |
| 3d | Reviewable evidence | yes | `lab-report.md`, git diffs, real Vitest runs, and desktop/mobile screenshots (`evidence/`) are committed. |

### 5.2 The level and the gaps

**Level:** 1

**Missing evidence for the next level:**

- Level 1 clears at 80% (`4/5`: `1b`, `1c`, `1d`, `1e` are `yes`; only `1a` Prettier is missing). Level 2 currently has only `1/3` (`2c` `AGENTS.md` is `yes`), so advancing to Level 2 requires adding `2a` (`.env.example` documenting zero required secrets) and `2b` (an accurate `app/project/README.md` documenting setup, folder layout, and `npm test` / `npm run dev` commands).

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
I read only the AGENTS.md text you pasted. Nothing has been edited, and no tests or commands were run.

## Conflicts with your constraints

| Your constraint | What AGENTS.md says now |
|---|---|
| One fictional room | "Use real room names and the real timetable from the KBTU portal." |
| No login or database | "You may... add a small Supabase table and a login page." |
| No external deployments | "Run `npx netlify deploy --prod`" before finishing. |
| Run tests before proposing acceptance | It lists `npm run test:unit`, which doesn't exist in `package.json` (the script is `test`). Deploy is gated on "build passes", not on tests. |

## Missing rules
- **AC6:** AGENTS.md defines only AC1 to AC5. I won't invent AC6, so please tell me what it should say.
- **No secrets:** nothing forbids committing keys, tokens or `.env` files.
- **Honest reporting:** nothing says to report real command output only, or to flag a conflict between rules and code instead of resolving it quietly.
- **Vague finish step:** "Make sure the page still loads" isn't checkable.

## Conflict I would not fix in this patch
AC4 says touching endpoints count as an overlap, but `canBook` uses strict `<`/`>`, so back-to-back bookings are allowed. Since you want the ACs preserved, I left the AC text alone. Whether the code or the AC is wrong is your decision, and the patch tells agents to report it rather than change either.

## Proposed patch (not applied)

-For realism, use real room names and the real timetable from the KBTU portal.
+Scope: exactly one fictional room (e.g. "Room A101") with invented sample bookings.
+No real room names, timetables, people or other personal data.
+No login and no database.
...
-- Tests: `npm run test:unit`
+- Tests: `npm test`
...
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` and `npm run build`, and report their actual output.
+- Do not call work accepted until the tests have run and passed.
```

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | "use real room names and the real timetable from the KBTU portal" | Conflicting (C1) | approve | Replaces real portal data with a strict one-fictional-room rule so no personal timetable data is ever introduced. |
| 2 | AC4 says touching endpoints count as an overlap; AC6 is missing | Conflicting & Missing (C3) | modify | Claude left AC4 wrong and used a placeholder for AC6; I fixed AC4 to allow touching endpoints (matching our contract) and added AC6 for responsive desktop/mobile UI feedback. |
| 3 | `npm run test:unit` in Commands | Conflicting (A3) | approve | `package.json` defines `"test": "vitest run"` (`npm test`), not `test:unit`. |
| 4 | "add a small Supabase table and a login page" and missing secrets rule | Conflicting & Missing (C2, C4) | modify | Combined into one concise line under `## You may` (keeping the original headings intact) forbidding login, database, and committing secrets or `.env` files. |
| 5 | `npx netlify deploy --prod` and missing test gate in `## Before you finish` | Conflicting & Missing (C5, C6) | approve | Removes external deployment and requires running `npm test` with all tests passing before proposing acceptance. |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```diff
--- a/week-10/app/project/AGENTS.md
+++ b/week-10/app/project/AGENTS.md
@@ -10,3 +10,3 @@
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional booking data only; never use real room names or KBTU portal data.

@@ -17,3 +17,4 @@
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; bookings that only touch at an endpoint are allowed.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI validation feedback on desktop and mobile widths.

@@ -25,1 +26,1 @@
-- Tests: `npm run test:unit`
+- Tests: `npm test`

@@ -31,1 +32,1 @@
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add a login page, database, or backend persistence, and never commit secrets or `.env` files.

@@ -35,2 +36,2 @@
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run the tests (`npm test`) and ensure all tests pass before proposing acceptance.
+- Do not run external deployments or publish to production.
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R2**. The real run, with the new test failing:

```text
 RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/week-10/app/project

 ❯ src/booking.test.ts (20)
   ❯ canBook (20)
     ✓ T01 AC4: touching after existing booking is accepted (660-720)
     ✓ T02 AC1: starting exactly at now is rejected (540-570)
     ✓ T03 AC1: zero-duration interval is rejected (720-720)
     ✓ T04 AC1: reversed interval is rejected (750-720)
     ✓ T05 AC1: interval ending past day end is rejected (1380-1441)
     ✓ T06 AC2: exactly 120 minutes is accepted (720-840)
     ✓ T07 AC2: 121 minutes is rejected (720-841)
     ✓ T08 AC4: touching before existing booking is accepted (570-600)
     ✓ T09 AC4: partial overlap is rejected (630-690)
     ✓ T10 AC4: interval containing existing booking is rejected (570-690)
     ✓ T11 AC4: interval inside existing booking is rejected (615-645)
     ✓ T12 AC4: identical interval is rejected (600-660)
     ✓ T13 AC3: blocked room is rejected (660-720, blocked)
     ✓ T14 AC4: empty bookings list has no overlaps (630-690)
     ✓ X1 AC1: starting 1 minute after now is accepted (541-571)
     ✓ X2 AC4: overlapping only the second of two bookings is rejected (720-780)
     ✓ T15 AC5: available request returns true and leaves bookings unchanged (660-720)
     ✓ BUG-A AC4: interval touching existing bookings on both sides is accepted (660-700)
     ✓ BUG-B AC5: non-touching available request returns true without mutating bookings (720-780)
     × R2 AC1: fractional minutes are rejected (660.5-720)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook > R2 AC1: fractional minutes are rejected (660.5-720)
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:122:61
    120| 
    121|   test('R2 AC1: fractional minutes are rejected (660.5-720)', () => {
    122|     expect(canBook(makeParams({ start: 660.5, end: 720 }))).toBe(false);
       |                                                             ^
    123|   });
    124| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 19 passed (20)
   Start at  17:34:35
   Duration  1.86s (transform 109ms, setup 0ms, collect 144ms, tests 55ms, environment 0ms, prepare 879ms)
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1280 px | Checked `11:00–12:00` on Beacon Room (`now = 09:00`) → `Available`, blocked room → `Unavailable`, and verified existing bookings remain unchanged. | Pass | `evidence/ui-desktop.png` |
| Mobile | 375 px | Opened DevTools portrait mobile viewport (`375 × 812`) and verified time inputs, room selector, decision card, and booking list remain readable without overflow. | Pass | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

- I did not run `npm run test:unit` after patching `AGENTS.md` because that script does not exist in `package.json`; I did not run automated DOM/E2E tests on `App.tsx` (no Playwright or Testing Library installed); and I did not run `npx netlify deploy --prod` because external deployments are prohibited.

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:** I rejected Claude's choice to leave AC4 contradicting our contract and rejected adding a new `## You must not` heading (keeping the original headings from `provided/AGENTS.md` intact for a minimal 7-line patch).

The diff I approved (`git diff`):

```diff
--- a/week-10/app/project/AGENTS.md
+++ b/week-10/app/project/AGENTS.md
@@ -10,3 +10,3 @@
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional booking data only; never use real room names or KBTU portal data.
@@ -17,3 +17,4 @@
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; bookings that only touch at an endpoint are allowed.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI validation feedback on desktop and mobile widths.
@@ -25,1 +26,1 @@
-- Tests: `npm run test:unit`
+- Tests: `npm test`
@@ -31,1 +32,1 @@
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add a login page, database, or backend persistence, and never commit secrets or `.env` files.
@@ -35,2 +36,2 @@
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run the tests (`npm test`) and ensure all tests pass before proposing acceptance.
+- Do not run external deployments or publish to production.
```

### 8.2 The second mitigation

**Risk:** R2

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

**Problem → pattern → benefit:** Validation checks in `src/booking.ts` were inlined with magic numbers (`1440`, `120`) and lacked an integer guard → decomposed into small pure predicate helpers (`hasIntegerMinutes`, `isValidRange`, `startsAfter`, `withinMaxDuration`, `overlaps`) with no unnecessary OOP pattern → fractional inputs like `660.5` are cleanly rejected (`R2` passes) while keeping `canBook`'s signature, readability, and AC1–AC5 behavior intact.

**What I rejected from the agent's patch, and why:** I accepted the pure predicate helpers in `src/booking.ts` and rejected adding extra `NaN`/`Infinity` tests or editing `availability.ts` so the patch stays minimal and focused strictly on `R2`.

The diff I approved (`git diff`):

```diff
--- a/week-10/app/project/src/booking.ts
+++ b/week-10/app/project/src/booking.ts
@@ -10,16 +10,30 @@ export interface CanBookParams {
   bookings: BookingSlot[];
 }
 
+const MINUTES_PER_DAY = 1440;
+const MAX_DURATION_MIN = 120;
+
+const hasIntegerMinutes = (start: number, end: number, now: number): boolean =>
+  Number.isInteger(start) && Number.isInteger(end) && Number.isInteger(now);
+
+const isValidRange = (start: number, end: number): boolean =>
+  0 <= start && start < end && end <= MINUTES_PER_DAY;
+
+const startsAfter = (start: number, now: number): boolean => start > now;
+
+const withinMaxDuration = (start: number, end: number): boolean =>
+  end - start <= MAX_DURATION_MIN;
+
+const overlaps = (start: number, end: number, b: BookingSlot): boolean =>
+  start < b.end && end > b.start;
+
 export function canBook({ start, end, now, blocked, bookings }: {
   start: number;
   end: number;
   now: number;
   blocked: boolean;
   bookings: { start: number; end: number }[];
 }): boolean {
-  if (!(0 <= start && start < end && end <= 1440)) return false;
-  if (!(start > now)) return false;
-  if (end - start > 120) return false;
+  if (!hasIntegerMinutes(start, end, now)) return false;
+  if (!isValidRange(start, end)) return false;
+  if (!startsAfter(start, now)) return false;
+  if (!withinMaxDuration(start, end)) return false;
   if (blocked) return false;
-  for (const b of bookings) {
-    if (start < b.end && end > b.start) return false;
-  }
-  return true;
+  return !bookings.some((b) => overlaps(start, end, b));
 }
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 3 | 3 | 9 | 1 | 3 | 3 | `AGENTS.md` patched (7 lines); `check_audit.py` passes `A2`, `A3`, and `C1`–`C6`. |
| R2 | 2 | 3 | 6 | 1 | 2 | 2 | `hasIntegerMinutes` added in `src/booking.ts`; `R2 AC1` and all 20 Vitest tests pass (§8.4). |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
 RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/week-10/app/project

 ✓ src/booking.test.ts (20)
   ✓ canBook (20)
     ✓ T01 AC4: touching after existing booking is accepted (660-720)
     ✓ T02 AC1: starting exactly at now is rejected (540-570)
     ✓ T03 AC1: zero-duration interval is rejected (720-720)
     ✓ T04 AC1: reversed interval is rejected (750-720)
     ✓ T05 AC1: interval ending past day end is rejected (1380-1441)
     ✓ T06 AC2: exactly 120 minutes is accepted (720-840)
     ✓ T07 AC2: 121 minutes is rejected (720-841)
     ✓ T08 AC4: touching before existing booking is accepted (570-600)
     ✓ T09 AC4: partial overlap is rejected (630-690)
     ✓ T10 AC4: interval containing existing booking is rejected (570-690)
     ✓ T11 AC4: interval inside existing booking is rejected (615-645)
     ✓ T12 AC4: identical interval is rejected (600-660)
     ✓ T13 AC3: blocked room is rejected (660-720, blocked)
     ✓ T14 AC4: empty bookings list has no overlaps (630-690)
     ✓ X1 AC1: starting 1 minute after now is accepted (541-571)
     ✓ X2 AC4: overlapping only the second of two bookings is rejected (720-780)
     ✓ T15 AC5: available request returns true and leaves bookings unchanged (660-720)
     ✓ BUG-A AC4: interval touching existing bookings on both sides is accepted (660-700)
     ✓ BUG-B AC5: non-touching available request returns true without mutating bookings (720-780)
     ✓ R2 AC1: fractional minutes are rejected (660.5-720)

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  17:35:32
   Duration  1.62s (transform 138ms, setup 0ms, collect 190ms, tests 33ms, environment 1ms, prepare 743ms)
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | Work only on a dedicated feature branch (never `main`) inside `week-10/app/project/` with no network access or external accounts. |
| Permitted files | May edit `src/booking.ts`, `src/booking.test.ts`, `src/lib/availability.ts`, and `src/App.tsx`; must not touch `provided/AGENTS.md` or `tests/check_audit.py`. |
| Commands | Allowed to run `npm test`, `npx vitest run`, `npm run build`, `npm run lint`, and `git diff` locally. |
| Prohibited actions | Must never run `git push --force`, `git reset --hard`, `npx netlify deploy`, install unapproved packages, add login/database code, or read `.env`. |
| Required evidence | Must attach unedited `npm test` output, `npm run build` output, and the exact `git diff` for every modified file in the PR. |
| Before merging or deploying | Human reviewer must inspect every diff, verify AC1–AC6 against the test output, confirm zero `node_modules/` committed, and keep external deploys disabled. |

### 9.2 Optional — the deck's checklist prompt (not graded)

Not used.

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All 31 checks in `python tests/check_audit.py` pass (`SUMMARY pass=31 fail=0 error=0`). |

---

## 10. Release decision and conclusion

**Decision:** CONDITIONAL

<!-- Write your conclusion below this line -->

**CONDITIONAL.** Our two highest confirmed risks are mitigated: **R1** (contradictory `AGENTS.md` rules allowing production Netlify deploys, real KBTU data, and missing `npm run test:unit`, originally `3 × 3 = 9`) dropped to `1 × 3 = 3` after applying the approved 7-line patch, and **R2** (fractional minutes accepted in `src/booking.ts`, originally `2 × 3 = 6`) dropped to `1 × 2 = 2` after refactoring `canBook` with pure helpers and passing regression test `R2` alongside all 20 Vitest tests. No confirmed risk remains at score 6 or above, and desktop/mobile UI checks passed (`evidence/ui-desktop.png`, `ui-mobile.png`). However, release stays conditional rather than unconditional GO because **R3** (duplicated reason logic in `availability.ts`, `2 × 2 = 4`) and **R4** (missing CI and pre-commit hooks, `2 × 2 = 4`) remain open at Readiness Level 1.
