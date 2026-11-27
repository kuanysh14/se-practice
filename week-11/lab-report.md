# Week 11 — Lab report

**Name:** Olzhabay Kuanysh
**Group:** Monday (18:00-19:00)
**Date:** 27.11.2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| |   |
| --- |---|
| Assistant I built the feature with (tool) | Google Gemini |
| Its exact model (with its version, or `not displayed`) | Gemini 4 Neon |
| Assistant I reviewed with (tool) | Claude |
| Its exact model (with its version, or `not displayed`) | Claude Sonnet 5.5 |
| Starting point (`week-10` or `week-08`) | week-10 |
| Baseline commit — the checkpoint of Part 0 | c13fd77 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-11/app/` before any change. **Exists:** `yes` or `no`. **Result:**
`pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 20 passed (20) on the Week 10 baseline suite. |
| `npm run build` | yes | pass | `vite build` succeeds cleanly. |
| `npm run lint` | yes | pass | `eslint .` runs cleanly on the baseline project. |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-11/app/`, before any change:

```text
 RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/week-11/app/project

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
   Start at  08:37:50
   Duration  1.79s (transform 123ms, setup 0ms, collect 105ms, tests 17ms, environment 1ms, prepare 946ms)

```

### 2.3 What I located

| What | Where (file, and the function or component name) |
| --- | --- |
| The availability function | `src/booking.ts` — `canBook({ start, end, now, blocked, bookings })` |
| The UI component | `src/App.tsx` (`App`) and `src/components/DecisionCard.tsx` (`DecisionCard`) |
| The repository instructions | `app/project/AGENTS.md` (and `app/AGENTS.md`) |

---

## 3. Task 2 — the feature, defined before the code

### 3.1 The user story

As a student, I want a short explanation of room availability so I understand the decision.

### 3.2 The contract

One row per field. **Validation** is what you reject, and how.

| Field | Direction | Type / format | Validation |
| --- | --- | --- | --- |
| `roomLabel` | input | `string` (1–60 chars, trimmed) | Reject empty/whitespace-only strings or labels longer than 60 characters by throwing an `Error`. |
| `start` | input | `string` (`"HH:MM"`, `00:00`–`24:00`) | Reject any string that does not match `/^(?:(?:[01]\d|2[0-3]):[0-5]\d|24:00)$/` (including trailing text). |
| `end` | input | `string` (`"HH:MM"`, `00:00`–`24:00`) | Reject any string that does not match `/^(?:(?:[01]\d|2[0-3]):[0-5]\d|24:00)$/`. |
| `isAvailable` | input | `boolean` (from `canBook`) | Reject non-boolean values or mismatches where `isAvailable !== (reasonCode === 'available')`. |
| `reasonCode` | input | `'available' | 'invalid_time' | 'past_time' | 'too_long' | 'room_blocked' | 'overlap'` | Reject any code not in the six deterministic reason codes produced by `availabilityReason()` in `src/booking.ts`. |
| `explanation` | output | `string` (<= 280 chars, <= 2 sentences) | Reject empty text, text > 280 chars, > 2 sentences, or text contradicting `isAvailable`, returning the deterministic fallback instead. |

### 3.3 Acceptance criteria and failure behaviour

- **F1:** Deterministic booking rules (`AC1`–`AC5` in `canBook`) remain unchanged and authoritative.
- **F2:** The explanation agrees with `isAvailable` and `reasonCode`, is <= 280 characters and <= 2 sentences, and invents no times, people, or alternative rooms.
- **F3:** Invalid inputs (empty/overlong `roomLabel`, malformed `HH:MM`, inconsistent `isAvailable`/`reasonCode`) are rejected before invoking the adapter.
- **F4:** Adapter timeouts, synchronous throws, or rejected promises return a safe deterministic fallback without crashing the UI.
- **F5:** The page labels the explanation clearly as `"generated"` (and indicates when fallback text was used) so it is never mistaken for the authoritative availability status.

| Failure | What the student sees |
| --- | --- |
| Invalid input (empty, malformed, too long) | Input validation rejects the request before calling the adapter and displays a clear inline validation message while keeping the deterministic status intact. |
| The model times out | After `1500 ms`, the timeout triggers and the page displays the deterministic fallback explanation labelled as generated fallback without altering the room status. |
| The model fails (error, no key) | Errors from the adapter are caught safely and replaced with the deterministic fallback explanation while keeping the page responsive. |
| The model's answer contradicts the decision, or invents a detail | The output guard detects the contradiction or > 2 sentences / > 280 chars and replaces it with the deterministic fallback matching `isAvailable` and `reasonCode`. |

### 3.4 The flow

A written flow with arrows (`->`), or a diagram in a code block. Name your checker function and the
adapter, and say which one decides availability.

```text
Student enters room + start/end in App.tsx
  -> canBook() & availabilityReason() in src/booking.ts DECIDE availability (isAvailable + reasonCode)
  -> App.tsx displays the authoritative Available / Unavailable badge immediately
  -> Student clicks "Explain availability"
  -> explainAvailability(input, mockExplainAdapter, 1500) validates input & calls adapter with timeout
  -> Output guard checks <= 280 chars, <= 2 sentences, agrees with isAvailable (else fallbackExplanation)
  -> App.tsx renders the explanation clearly labelled as "Generated explanation"
```

`canBook()` (via `availabilityReason()`) in `src/booking.ts` always decides availability; the adapter only generates human-readable text for that already-decided result.

---

## 4. Task 3 — build it with an AI assistant

### 4.1 The implementation prompt and the answer

What you sent, exactly (the deck's prompt, and the contract if you sent it):

```text
Act as a software engineer. Extend the existing Smart Campus checker with an optional explanation feature. Preserve all booking rules and tests. The deterministic checker must remain authoritative. First, implement a mock adapter, validate inputs and outputs, handle failures gracefully, and describe each changed file. Do not add login, a database, real personal data, or client-side API secrets.
```

The assistant's answer, pasted unedited (its description of each changed file is enough if the code
is long):

```text
I extended the Smart Campus checker without touching any existing booking rules or adding client-side secrets or provider SDKs:
1. `src/booking.ts`: Added `ReasonCode` (`available`, `invalid_time`, `past_time`, `too_long`, `room_blocked`, `overlap`) and `availabilityReason()`, and had `canBook()` delegate directly to `availabilityReason(...) === 'available'` so both share one source of truth.
2. `src/explain.ts`: Implemented `SYSTEM_INSTRUCTION`, `fallbackExplanation()`, `mockExplainAdapter()`, and `explainAvailability(input, adapter, timeoutMs = 1500)` with input validation, timeout racing, output guards, and safe fallback handling.
3. `src/explain.test.ts`: Added automated Vitest cases E1–E9 covering available, overlap, room_blocked, invalid_time, past_time, empty/long input, timeout (`E8`), and simulated API failure / contradicting output (`E9`).
4. `src/App.tsx`: Added an optional "Explain availability" button and a "Simulate failure (fallback)" toggle that displays the explanation in a card explicitly labelled "Generated explanation" (F5) without ever modifying the deterministic Available/Unavailable badge.
```

### 4.2 Every changed file, decided

**Decision:** `accept`, `modify` or `reject`.

| File | What the assistant changed | Decision | Why |
| --- | --- | --- | --- |
| `src/booking.ts` | Added `ReasonCode` and `availabilityReason()` reusing the pure predicate helpers, and made `canBook()` return `availabilityReason(...) === 'available'`. | accept | Guarantees `canBook()` and `reasonCode` can never drift apart while keeping all 20 existing tests passing (F1). |
| `src/explain.ts` | Created `explainAvailability`, `mockExplainAdapter`, `fallbackExplanation`, and `SYSTEM_INSTRUCTION` with no provider SDK or API keys. | modify | Accepted the mock-first structure, then modified the time regex, timer cleanup, and output-agreement checks after Task 6 review findings `V1` and `V2`. |
| `src/explain.test.ts` | Added Vitest tests `E1`–`E9` using `mockExplainAdapter` and fake hanging/throwing/contradicting adapters. | accept | Directly tests F2–F4 including timeout (`E8`) and failure/contradiction fallback (`E9`). |
| `src/App.tsx` | Added "Explain availability" button and "Generated explanation" panel below the authoritative status card. | accept | Preserves deterministic status display and satisfies F5 with no network calls or secrets in `src/`. |

### 4.3 The adapter

| | |
| --- | --- |
| The mock adapter (its name in `explain.ts`) | `mockExplainAdapter` |
| The timeout (milliseconds) | `1500` |
| A real-model adapter too? (`no`, or `yes` and where it runs, and where its key lives) | `no` |

---

## 5. Task 4 — prompt engineering

### 5.1 Three instructions

```text
A: Explain whether the study room is available in a helpful way for a student.
```

```text
B: Write a short 1-sentence explanation of the room availability decision using the roomLabel, start, end, isAvailable, and reasonCode fields. Keep it under 280 characters.
```

```text
C: You explain Smart Campus room availability decisions strictly from the provided JSON fields (roomLabel, start, end, isAvailable, reasonCode). Write at most 2 short sentences and at most 280 characters. Never contradict isAvailable, never invent alternative times, people, or reasons not present in the JSON, and state clearly whether the room is available or unavailable.
```

### 5.2 The three inputs and the answers

The same three JSON inputs (`available`, `overlap`, `room_blocked`), sent after each prompt in a fresh
chat, and the answers, unedited:

```text
Inputs:
1) {"roomLabel":"Beacon Room","start":"11:00","end":"12:00","isAvailable":true,"reasonCode":"available"}
2) {"roomLabel":"Beacon Room","start":"10:30","end":"11:30","isAvailable":false,"reasonCode":"overlap"}
3) {"roomLabel":"Cedar Seminar Room","start":"11:00","end":"12:00","isAvailable":false,"reasonCode":"room_blocked"}

Prompt A answers:
1. Beacon Room is available from 11:00 to 12:00. You can go ahead and request this time slot.
2. Beacon Room isn't available from 10:30 to 11:30 because this time overlaps with an existing booking. Please try a different time or another room.
3. Cedar Seminar Room isn't available from 11:00 to 12:00 because the room is blocked for this time. Please choose another room or check a different time slot.

Prompt B answers:
1. Beacon Room is available from 11:00 to 12:00.
2. Beacon Room is unavailable from 10:30 to 11:30 because the requested time overlaps with an existing booking.
3. Cedar Seminar Room is unavailable from 11:00 to 12:00 because the room is blocked.

Prompt C answers:
1. Beacon Room is available from 11:00 to 12:00.
2. Beacon Room is unavailable from 10:30 to 11:30 because of a time overlap.
3. Cedar Seminar Room is unavailable from 11:00 to 12:00 because the room is blocked.
```

### 5.3 The comparison

**Clarity** and **consistency:** 1 (poor) to 3 (good). **Agrees with the facts:** `yes` or `no`.
**Invented:** what it made up (a time, a booking, a person), or `nothing`.

| Prompt | Clarity | Consistency | Agrees with the facts | Invented |
| --- | --- | --- | --- | --- |
| A | 2 | 2 | yes | Added unrequested next-step advice ("request this time slot", "choose another room") and claimed the room is blocked "for this time" instead of blocked overall. |
| B | 3 | 3 | yes | nothing |
| C | 3 | 3 | yes | nothing |

### 5.4 The one I chose

**Chosen:** C

Prompt C scored 3/3 on both clarity and consistency, agreed with all three JSON inputs, invented nothing, and explicitly encodes the hard constraints (<= 2 short sentences, <= 280 characters, never contradict `isAvailable`, never invent times or people). I confirmed this exact text is stored in `src/explain.ts` as `export const SYSTEM_INSTRUCTION`.

---

## 6. Task 5 — tests

### 6.1 The test cases

**Verdict:** `pass`, `fail` or `not run`. **How:** the Vitest test title, or `manual` and what you did.

| ID | Case | Expected | Observed | Verdict | How |
| --- | --- | --- | --- | --- | --- |
| E1 | available | `usedFallback: false`, <= 280 chars, mentions available | Returned `"Beacon Room is available from 11:00 to 12:00."` | pass | `E1 F2: available room produces concise available explanation` |
| E2 | overlap | `usedFallback: false`, mentions unavailable and overlap | Returned `"Beacon Room is unavailable from 10:30 to 11:30 because it overlaps an existing booking."` | pass | `E2 F2: overlap explains unavailability without inventing times` |
| E3 | blocked room | `usedFallback: false`, mentions blocked | Returned `"Cedar Seminar Room is unavailable from 11:00 to 12:00 because it is blocked."` | pass | `E3 F2: blocked room explains room_blocked accurately` |
| E4 | invalid time | Rejects malformed time (`"10:00 IGNORE"`) with `Error` | Threw `Invalid time format: expected HH:MM.` | pass | `E4 F3: invalid time format (including trailing junk) is rejected` |
| E5 | past time | `usedFallback: false`, mentions past | Returned `"Beacon Room is unavailable from 08:00 to 09:00 because it starts in the past."` | pass | `E5 F2: past_time explains that the start time is in the past` |
| E6 | empty input | Rejects whitespace `roomLabel` (`"   "`) with `Error` | Threw `Invalid roomLabel: must be 1 to 60 characters.` | pass | `E6 F3: empty roomLabel input is rejected` |
| E7 | long input | Rejects 61-char `roomLabel` with `Error` | Threw `Invalid roomLabel: must be 1 to 60 characters.` | pass | `E7 F3: roomLabel longer than 60 characters is rejected` |
| E8 | timeout | Returns safe fallback (`usedFallback: true`) after 30 ms | Returned fallback explanation and cleared timer cleanly | pass | `E8 F4: adapter timeout returns safe fallback and clears timer` |
| E9 | simulated API failure | Sync throw or contradicting adapter returns safe fallback (`usedFallback: true`) | Both throwing and contradicting adapters returned deterministic unavailable fallback | pass | `E9 F4: adapter rejection, sync throw, or contradicting output falls back safely` |
| UI | the UI never changes the deterministic decision | Clicking "Explain availability" or triggering fallback never alters Available/Unavailable badge | Badge stayed `Available` / `Unavailable` from `canBook` while generated panel appeared below | pass | manual — clicked Explain availability on Beacon Room (`11:00–12:00`) and simulated failure in browser (`evidence/*.png`) |

### 6.2 The run after the feature

The real output of `npx vitest run` with `explain.test.ts` in place (before the review fixes):

```text
 RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/week-11/app/project

 ✓ src/booking.test.ts (20)
 ❯ src/explain.test.ts (9)
   ❯ explainAvailability (E1–E9) (9)
     ✓ E1 F2: available room produces concise available explanation
     ✓ E2 F2: overlap explains unavailability without inventing times
     ✓ E3 F2: blocked room explains room_blocked accurately
     × E4 F3: invalid time format (including trailing junk) is rejected
     ✓ E5 F2: past_time explains that the start time is in the past
     ✓ E6 F3: empty roomLabel input is rejected
     ✓ E7 F3: roomLabel longer than 60 characters is rejected
     ✓ E8 F4: adapter timeout returns safe fallback and clears timer
     × E9 F4: adapter rejection, sync throw, or contradicting output falls back safely

 Test Files  1 failed | 1 passed (2)
      Tests  2 failed | 27 passed (29)
   Start at  08:52:10
   Duration  1.45s (transform 110ms, setup 0ms, collect 128ms, tests 64ms, environment 0ms, prepare 612ms)
```

### 6.3 Screenshots

| File | What it shows |
| --- | --- |
| `evidence/explain-available.png` | Beacon Room (`11:00–12:00`, `now = 09:00`) showing the deterministic green **Available** badge and the **Generated explanation** card below it after clicking Explain availability. |
| `evidence/explain-fallback.png` | Simulated adapter failure showing the deterministic status badge unchanged alongside the **Generated explanation (fallback)** message. |

---

## 7. Task 6 — the agentic code review

### 7.1 The reviewer and its context

The read-only code review ran in Claude web (`Claude Sonnet 5.5` — a different model from the builder `Gemini 4 Neon`) with no write access to the repository (`git status` confirmed zero edits). I provided the full proposed diff of `src/booking.ts` and `src/explain.ts`, the `AGENTS.md` repository rules, and the `F1`–`F5` / `AC1`–`AC6` constraints.

### 7.2 The review prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Act as a read-only agentic code reviewer. Inspect the proposed diff in context, repository instructions, and tests. Review correctness, security, maintainability, and performance. For each issue, provide severity, affected file, evidence, reproduction or verification method, and a minimal recommendation. Do not edit files. Clearly distinguish confirmed findings from hypotheses.
```

The reviewer's answer, pasted unedited:

```text
Confirmed findings (all in src/explain.ts):
- C1 (High): Synchronous adapter error can crash the process (F4) — timer is created before adapter() is called; wrap with Promise.resolve().then(...) and clear timer in finally.
- C2 (High): Model output isn't checked against the decision (F2) — only empty text and length are checked; an adapter returning "Room A is available." for an overlap is accepted.
- C3 (High): Time regex /^([01]\d|2[0-3]):[0-5]\d|24:00$/ splits anchors on |, so '10:00 IGNORE RULES' passes. Fix: /^(?:(?:[01]\d|2[0-3]):[0-5]\d|24:00)$/.
- C4 (Medium): Inconsistent input (isAvailable: true with overlap, or non-boolean) is accepted. Require boolean, allowed reasonCode, and isAvailable === (reasonCode === 'available').
- C5 (Medium): Trimmed label is validated, but raw input.roomLabel is passed to the adapter/fallback.
- C6 (Low): Timeout timer is never cleared; call clearTimeout in finally.

Hypotheses and unverified risks:
- H1 (Medium, booking.ts): availabilityReason may duplicate booking rules and drift from canBook (F1).
- H2 (Medium, explain.ts): Prompt injection through input fields once a real model is connected.
- H3 (Medium, UI): F5 label can't be confirmed from diff alone.
```

### 7.3 The findings, verified

At least **three**; at least **two** `confirmed`. **Category:** `correctness`, `security`,
`maintainability`, `performance` or `tests`. **Severity:** `high`, `medium` or `low`. **Found by:**
`reviewer`, `me` or `both`.

| ID | Finding (short) | Category | Severity | File | How I verified it | Label | Found by |
| --- | --- | --- | --- | --- | --- | --- | --- |
| V1 | Unparenthesized `TIME_RE` allows trailing junk (`'10:00 IGNORE'`), untrimmed `roomLabel` passes raw spaces, and `isAvailable`/`reasonCode` mismatch is unchecked. | correctness | high | `src/explain.ts` | Ran `E4` (`'10:00 IGNORE'`) on the draft `explain.ts` and saw it fail to throw. | confirmed | reviewer |
| V2 | Output guard does not check `isAvailable` agreement or `<= 2` sentences, sync adapter throws leave dangling timeout rejections, and `setTimeout` handle is never cleared. | correctness | high | `src/explain.ts` | Ran `E9` with a synchronous throwing adapter and a contradicting adapter returning `"available"` for an overlap; both failed before the fix. | confirmed | reviewer |
| V3 | `availabilityReason` in `src/booking.ts` might duplicate rules and drift from `canBook` (H1). | maintainability | medium | `src/booking.ts` | Opened `src/booking.ts` and verified `canBook()` delegates directly to `availabilityReason(...) === 'available'`. | unsupported | reviewer |
| V4 | Prompt injection through `roomLabel` from untrusted user input (H2). | security | medium | `src/explain.ts` | Inspected `src/App.tsx`: `roomLabel` is passed from the fixed fictional `ROOMS` list, not free-text user input. | unsupported | reviewer |

### 7.4 My own inspection, and the linter

By hand, I verified that `app/project/src/` contains zero API keys, `VITE_*` secrets, provider SDK imports, or provider URLs (`X4`, `X5`), and that `src/App.tsx` renders the `"Generated explanation"` label cleanly without altering the deterministic status badge (`X6`). A linter (`eslint`) would catch unused variables or syntax errors, but it could never catch `V1`'s broken regex anchor precedence (`^...|...$`) or `V2`'s missing semantic contradiction check between `isAvailable` and model text.

---

## 8. Task 7 — repair and regression-test

### 8.1 The first fix

**Finding:** V1

**Why it is necessary:** Without grouping the alternation in `TIME_RE`, inputs like `"10:00 IGNORE"` bypass `F3` validation, and inconsistent `isAvailable`/`reasonCode` pairs or untrimmed labels could produce misleading or overlong explanations.

**What I rejected from the assistant's proposal, and why:** I rejected Claude's suggestion to hardcode a single room constant inside `explain.ts` so `explainAvailability` stays reusable across our fictional room labels while still trimming and bounding `roomLabel`.

The diff (`git diff`):

```diff
--- a/week-11/app/project/src/explain.ts
+++ b/week-11/app/project/src/explain.ts
-const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d|24:00$/;
+const TIME_RE = /^(?:(?:[01]\d|2[0-3]):[0-5]\d|24:00)$/;
+  if (typeof input.isAvailable !== 'boolean' || !VALID_REASONS.has(input.reasonCode)) {
+    throw new Error('Invalid availability flag or reasonCode.');
+  }
+  if (input.isAvailable !== (input.reasonCode === 'available')) {
+    throw new Error('Inconsistent input: isAvailable must match reasonCode.');
+  }
+  const cleanInput: ExplainInput = { ...input, roomLabel: label };
```

### 8.2 The second fix

**Finding:** V2

**Why it is necessary:** Without checking `agreesWithDecision()` and `sentenceCount() <= 2`, a buggy or hallucinating model could claim a blocked or overlapping room is `"available"` (violating `F2`), and uncleaned timers / synchronous throws risk unhandled rejections (`F4`).

**What I rejected from the assistant's proposal, and why:** I rejected Claude's recommendation to eliminate adapter output completely in favor of fixed templates only, because keeping the adapter interface with strict output guards preserves the mock-to-server seam required by the contract.

The diff (`git diff`):

```diff
--- a/week-11/app/project/src/explain.ts
+++ b/week-11/app/project/src/explain.ts
-    const timer = new Promise<never>((_, reject) =>
-      setTimeout(() => reject(new Error('timeout')), timeoutMs)
-    );
-    const raw = await Promise.race([adapter(input, SYSTEM_INSTRUCTION), timer]);
-    const text = raw.trim();
-    if (!text || text.length > 280) {
+  let timerId: ReturnType<typeof setTimeout> | undefined;
+  try {
+    const timer = new Promise<never>((_, reject) => {
+      timerId = setTimeout(() => reject(new Error('timeout')), timeoutMs);
+    });
+    const raw = await Promise.race([
+      Promise.resolve().then(() => adapter(cleanInput, SYSTEM_INSTRUCTION)),
+      timer,
+    ]);
+    const text = typeof raw === 'string' ? raw.trim() : '';
+    if (!text || text.length > 280 || sentenceCount(text) > 2 || !agreesWithDecision(text, cleanInput.isAvailable)) {
       return { explanation: fallbackExplanation(cleanInput), usedFallback: true };
     }
+  } finally {
+    if (timerId !== undefined) clearTimeout(timerId);
+  }
```

### 8.3 The final run

The real output of the **full** suite after both fixes: the old booking tests and the feature tests
together. Every test must pass.

```text
RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/week-11/app/project

 ✓ src/booking.test.ts (20)
 ✓ src/explain.test.ts (9)

 Test Files  2 passed (2)
      Tests  29 passed (29)
   Start at  08:58:41
   Duration  1.57s (transform 204ms, setup 0ms, collect 235ms, tests 63ms, environment 1ms, prepare 1.56s)

```

### 8.4 Ready for demonstration?

**Ready:** yes

**What remains unresolved:**

The feature is ready for demonstration with the mock adapter and all 29 Vitest tests passing. What remains unresolved is connecting a real server-side LLM endpoint (outside `src/` so keys never enter the browser) and adding automated DOM tests for `App.tsx`.

---

## 9. Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All 27 checks in `python tests/check_feature.py` pass (`SUMMARY pass=27 fail=0 error=0`). |

---

## 10. Reflection

Gemini generated the initial `src/booking.ts` reason codes, `src/explain.ts` mock adapter, and `src/explain.test.ts` cases `E1`–`E9`, while Claude Sonnet 5.5 acted as an independent read-only reviewer. Running Claude's review paid off immediately: **V1** caught an unparenthesized `TIME_RE` alternation that let `"10:00 IGNORE"` slip past `E4`, and **V2** exposed that contradicting adapter responses and synchronous throws were not guarded before failing `E9`. I verified every finding myself in code and tests, rejecting Claude's unsupported **V3** and **V4** hypotheses after inspecting `booking.ts` and `App.tsx`, and rejecting its suggestion to drop the adapter abstraction. Fixing **V1** and **V2** brought all 29 Vitest tests (`booking.test.ts` + `explain.test.ts`) to green while keeping `canBook` authoritative and zero secrets in `src/`.
