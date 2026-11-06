# Week 07 — Lab report

**Name:** Olzhabay Kuanysh
**Group:** Monday (18:00-19:00)
**Date:** 06.11.2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| |   |
| --- |---|
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | `week-06` |
| Bolt project link (or `not shared`, and why) | https://bolt.new/~/sb1-jks36ria |
| Assistant that generated the tests (tool) | Claude |
| Exact model (with its version, or `not displayed`) | Claude Sonnet 5.5 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |
| Test command | `npx vitest run` |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | `src/lib/availability.ts` — `checkAvailability(req: CheckRequest)` and helper `overlapsExisting(start, end, bookings)` |
| Its inputs | `req: CheckRequest` containing `{ room, start, end, nowMinutes }` where `room` holds `blocked: boolean` and `bookings: Booking[]` |
| What it returned | `Decision` union object: `{ status: 'available' }` or `{ status: 'unavailable', reasons: string[] }` |
| How the page used it | `src/App.tsx` called `checkAvailability({ room: selectedRoom, start, end, nowMinutes })` inside a `useMemo` hook and passed the returned `decision` to `DecisionCard.tsx` |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->

I created `src/booking.ts` and extracted the boolean availability conditions into `export function canBook({ start, end, now, blocked, bookings }): boolean`. I moved the four rule checks—day bounds `0 <= start < end <= 1440` and `start > now` (AC1), duration `end - start <= 120` (AC2), `!blocked` (AC3), and half-open interval non-overlap `start < b.end && b.start < end` (AC4)—verbatim without altering any inequality or mutating `bookings`. In `src/lib/availability.ts` (which `src/App.tsx` calls), `checkAvailability` now imports and calls `canBook` for the `available` / `unavailable` decision while keeping `HH:MM` formatting and validation reason strings in the page layer.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | Minute 660 is excluded from the half-open existing booking `[600, 660)`, so starting at 660 only touches at the endpoint without overlapping, while duration is 60 and start is after 540. |
| T02 | 540–570 (starts now) | false | AC1 | AC1 requires `start` to be strictly after the supplied current time `now = 540`, so starting at exactly 540 (`start == now`) must be rejected. |
| T03 | 720–720 (zero duration) | false | AC1 | AC1 requires `start < end`, so a zero-length interval where `start` equals `end` (`720 == 720`) is invalid and must return `false`. |
| T04 | 750–720 (reversed) | false | AC1 | AC1 requires `start < end`, and here `start = 750` is after `end = 720`, so the reversed time range must be rejected. |
| T05 | 1380–1441 (past day end) | false | AC1 | AC1 requires `end <= 1440` (midnight at the end of the day), so an interval ending at minute 1441 exceeds the upper day bound. |
| T06 | 720–840 (120 minutes) | true | AC2 | AC2 permits bookings up to and including 120 minutes (`840 - 720 = 120`), and `[720, 840)` is after `now = 540` and does not overlap `[600, 660)`. |
| T07 | 720–841 (121 minutes) | false | AC2 | The requested duration is `841 - 720 = 121` minutes, which exceeds the 120-minute maximum allowed by AC2. |
| T08 | 570–600 (touching before) | true | AC4 | Minute 600 is excluded from the candidate interval `[570, 600)`, so ending at 600 where `[600, 660)` begins is a touching endpoint allowed by AC4. |
| T09 | 630–690 (partial overlap) | false | AC4 | Minutes 630–660 are shared between candidate `[630, 690)` and existing `[600, 660)`, violating AC4's no-overlap rule. |
| T10 | 570–690 (contains booking) | false | AC4 | Candidate `[570, 690)` completely encloses the existing booking `[600, 660)` (and has valid 120-minute duration), so AC4 must reject the overlap. |
| T11 | 615–645 (inside booking) | false | AC4 | Candidate `[615, 645)` lies completely inside the existing booking `[600, 660)`, so all 30 minutes conflict under AC4. |
| T12 | 600–660 (identical interval) | false | AC4 | Requesting the exact same `[600, 660)` slot as an existing booking is a 100% overlap and must be rejected by AC4. |
| T13 | 660–720, blocked = true | false | AC3 | Even though `660–720` is otherwise valid, `blocked = true` means the room is closed and AC3 rejects every request when blocked. |
| T14 | 630–690, bookings = [] | true | AC4 | When `bookings` is empty (`[]`), there are no existing intervals to conflict with, and `630–690` satisfies AC1–AC3. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | AC5 requires availability checking to be read-only, so calling `canBook` on an available slot (`660–720`) must return `true` without mutating `bookings`. |
| X1 | 541–571 (starts 1 min after now = 540) | true | AC1 | Tests the immediate upper boundary of `start > now`: starting at `now + 1` (`541 > 540`) ending at `571` (before `600`) satisfies AC1–AC4. |
| X2 | 720–780, bookings = [{ start: 600, end: 660 }, { start: 700, end: 760 }] | false | AC4 | Tests that the loop checks every booking in `bookings` rather than stopping after the first non-overlapping entry `[600, 660)`: `720–780` overlaps the second booking `[700, 760)`. |

---

## 4. Task 3 — generating the first test suite

Use the prompt from the deck (**Task #03 — Generate the first test suite**). Replace
`[our test framework]` with `Vitest` and attach or paste your Section 3 table, AC1–AC6, and
`booking.ts`.

**Exact prompt I sent:**

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

Acceptance Criteria:
AC1: Accept a candidate interval only when 0 <= start < end <= 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.

Existing booking module (src/booking.ts):
export function canBook({ start, end, now, blocked, bookings }: CanBookParams): boolean

Reviewed case table (default fixture: now = 540, blocked = false, bookings = [{ start: 600, end: 660 }], fresh for every test; write one test('ID AC: ...', ...) per case with .toBe(true) or .toBe(false), no test.each):
T01: 660-720 -> true (AC4)
T02: 540-570 -> false (AC1)
T03: 720-720 -> false (AC1)
T04: 750-720 -> false (AC1)
T05: 1380-1441 -> false (AC1)
T06: 720-840 -> true (AC2)
T07: 720-841 -> false (AC2)
T08: 570-600 -> true (AC4)
T09: 630-690 -> false (AC4)
T10: 570-690 -> false (AC4)
T11: 615-645 -> false (AC4)
T12: 600-660 -> false (AC4)
T13: 660-720, blocked = true -> false (AC3)
T14: 630-690, bookings = [] -> true (AC4)
AC5: Available request 660-720; compare bookings before and after -> true, data unchanged (AC5)
```

**Assistant's response (raw, before any edits):**

Save the test file the assistant gave you, **unedited**, as `suites/first/booking.test.ts`. Paste
its explanation, run command, AC mapping and unclear-requirements list here:

```text
I've written the test file with all 15 cases from your table. I haven't run it. src/booking.ts is untouched.
Where it goes: src/booking.test.ts. It imports canBook from ./booking. If your page imports from a different path or re-export, change the import line only.
Run command:
npx vitest run src/booking.test.ts
How it's built:
- Each test builds a fresh fixture with makeParams() (now = 540, blocked = false, bookings = [{ start: 600, end: 660 }]).
- now is a parameter of canBook, so time is already fixed and no fake timers are needed.
- Every test is a separate test('ID AC: ...') that ends in .toBe(true) or .toBe(false).
- The AC5 test is named T15 AC5, since your table gives its ID as "AC5". It checks that bookings keeps the same reference, equals a structuredClone snapshot taken before the call, and still has length 1.
AC mapping:
- AC1: T02, T03, T04, T05
- AC2: T06, T07
- AC3: T13
- AC4: T01, T08, T09, T10, T11, T12, T14
- AC5: T15 (the unchanged-data and true part only)
- AC6: Not covered by these unit tests
Unclear requirements:
1. AC5 label and AC6 are page behavior. canBook returns only a boolean, so these tests can't check the "Available / Unavailable" text, responsive layout, or validation messages.
2. AC6 "understandable validation feedback" is under-specified. canBook doesn't say why it rejected a request.
3. AC1 doesn't say what happens with non-integer, NaN or negative now values.
4. AC3 has no case where the room is blocked and the interval is also invalid or overlapping.
5. T10 and T11 assume a single existing booking. Behavior with several or unsorted bookings is covered only by the loop in the code, not by a case.
6. I assumed the page imports canBook from src/booking.ts.
```

---

## 5. Task 4 — reviewing the generated tests before running them

Check the generated suite against the five review questions before you run it:

| Check | Yes / No | Note |
| --- | --- | --- |
| Does it import the real `canBook` from `booking.ts` (not a copy, not a mock)? | Yes | Uses `import { canBook, type CanBookParams } from './booking';` with no mocks or spies. |
| Does every test assert `.toBe(true)` or `.toBe(false)` matching Section 3? | Yes | All 15 tests assert exact `.toBe(true)` or `.toBe(false)` matching the Section 3 table. |
| Are `now = 540` and `[{ start: 600, end: 660 }]` fresh in every test? | Yes | `makeParams()` returns a fresh object and fresh `[{ start: 600, end: 660 }]` array on every call. |
| Is there an AC5 test that checks `bookings` before and after an **Available** call? | Yes | `T15 AC5` calls `canBook` on `660–720` (`.toBe(true)`) and compares `params.bookings` against `structuredClone`. |
| Are any cases missing, duplicated, or testing the implementation instead of the ACs? | Yes | Missing our two extra boundary cases `X1` (`541–571` just after `now = 540`) and `X2` (multi-booking overlap on the second slot `[{ start: 600, end: 660 }, { start: 700, end: 760 }]`), which Claude itself noted in Unclear Requirement #5. |

**Review decisions** (at least 2 — every change you make or ask the AI to make must be listed
here with its reason):

| # | Test ID or area | What was wrong or weak in the first suite | Decision (`accept` / `revise` / `reject`) | Reason (which AC or testing rule) |
| --- | --- | --- | --- | --- |
| 1 | `T01`–`T14` | All 14 planned cases import the real `canBook`, use a fresh `makeParams()` fixture (`now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`), and assert exact `.toBe(true)` / `.toBe(false)` outcomes. | accept | Matches AC1–AC4 and the reviewed test plan in Section 3 without mocking or table-driven `test.each`. |
| 2 | `X1` (missing boundary) | The first suite tests `start == now` (`T02`: `540–570` -> `false`) but does not test the immediate valid boundary `start = now + 1` (`541–571` -> `true`). | revise | AC1 requires `start > now`; adding `X1` (`541–571` at `now = 540`) verifies the off-by-one boundary immediately after `now`. |
| 3 | `X2` (single-booking fixture only) | Every overlap test in the first suite uses at most one booking in `bookings`, so a buggy loop that only checks `bookings[0]` and returns early would pass all 15 tests. | revise | AC4 requires rejecting an overlap with *any* existing booking; adding `X2` (`720–780` against `[{ start: 600, end: 660 }, { start: 700, end: 760 }]`) ensures the second booking is checked. |
| 4 | `T15 AC5` | Named `T15 AC5` and relies on `structuredClone` and reference identity (`toBe(originalRef)`), which is good, but adding a `JSON.stringify` before/after comparison makes the read-only check explicit even across environments. | revise | AC5 requires showing a clear decision without changing existing booking data; asserting both `.toEqual(snapshot)` and `JSON.stringify` before/after strengthens data-preservation verification. |

---

## 6. Task 5 — running and improving the tests

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```
PS C:\Users\user\PycharmProjects\se-practice\week-07\app\project> npx vitest run

 RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/week-07/app/project

 ✓ src/booking.test.ts (15)
   ✓ canBook (15)
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
     ✓ T15 AC5: available request returns true and leaves bookings unchanged (660-720)

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  08:57:05
   Duration  1.89s (transform 144ms, setup 0ms, collect 149ms, tests 22ms, environment 1ms, prepare 948ms)

```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken | 
| ----- | ----- | ----- | ----- | ----- | 
| none | All 15 initial tests in `suites/first/booking.test.ts` passed (`0 failed, 15 passed`). | Verified that expectations in `T01`–`T14` and `T15 AC5` matched AC1–AC5 rather than buggy code. | Test repair (adding missing boundaries `X1` and `X2` and tightening `AC5`). | Sent improvement prompt to add `X1` (`541–571`) and `X2` (multi-booking overlap) and harden `T15 AC5`. | 

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```
Prompt sent:
Here is the Vitest output from running the first suite: all 15 tests in T01–T14 and T15 AC5 passed (0 failed, 15 passed).

Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.
Improve the tests without changing correct expectations to match buggy behavior.
Separate test repairs from implementation fixes.

Specifically, keep T01–T14 with their exact numbers and .toBe(true) / .toBe(false) assertions, keep AC5 (also asserting JSON.stringify(params.bookings) before and after equals the initial snapshot), and add our two missing boundary cases from the test plan as separate test(...) blocks (no test.each):
- X1 AC1: 541–571 with default fixture (now = 540, blocked = false, bookings = [{ start: 600, end: 660 }]) -> .toBe(true) (starts 1 minute after now = 540).
- X2 AC4: 720–780 with now = 540, blocked = false, bookings = [{ start: 600, end: 660 }, { start: 700, end: 760 }] -> .toBe(false) (non-overlapping with first booking, overlaps second booking).

Return the complete improved src/booking.test.ts file with all 17 tests.

Assistant's answer:
The complete 17-test file is attached as booking.test.ts (place it at src/booking.test.ts). I haven't run it. Run command is unchanged: npx vitest run src/booking.test.ts.
Review findings
Incorrect expectations: None. I re-derived all 15 against AC1–AC6 and the half-open [start, end) rule, and each is correct. The 15 passes are therefore real passes, not expectations bent to fit the code. T01–T14 are kept with their exact numbers and .toBe(true) / .toBe(false) assertions.
Weak assertions:
- T15 compared bookings only by reference, toEqual and length. It now also asserts JSON.stringify(params.bookings) before and after equals the initial snapshot, as you asked.
- Each test isolates one reason for its result. T13 uses 660–720, which is otherwise valid, so blocked is the only reason it fails. T05 is 61 minutes, so only the day-end rule rejects it. No other assertion needed tightening.
Duplicated cases: None. T01 and T08 look similar but cover opposite touching edges. T11 (inside) and T12 (identical) are different overlap shapes, and T14 isolates the empty list.
Missing boundaries:
- X1 (541–571) covers the one-minute-after-now boundary and is now added.
- X2 (720–780 against two bookings) covers the case where the first booking doesn't overlap but the second does. It is now added.
- Still uncovered (not added, to keep the file at 17):
  - start = 0 and end = 1440 being accepted.
  - start = -1 being rejected.
  - Overlap with the first booking only, when there are two.
Test repairs (applied)
- Added X1 and X2.
- Hardened the T15 unchanged-data assertions.
- X2 builds its own two-booking array locally, so the shared default fixture stays unchanged.
Implementation concerns (not applied, no tests changed to match them)
- now is not validated. start <= now is false when now is NaN, so a NaN clock would let past bookings through. The code never checks now.
- start, end and now aren't checked for integer values. AC1 doesn't say whether fractional minutes are allowed, so this needs a requirement decision before it can be tested.
- Rejections carry no reason. canBook returns only a boolean, so AC6's "understandable validation feedback" can't differ per rule without changing the function or having the page work out the cause.

```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```
PS C:\Users\user\PycharmProjects\se-practice\week-07\app\project> npx vitest run

 RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/week-07/app/project

 ✓ src/booking.test.ts (17)
   ✓ canBook (17)
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

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  09:20:15
   Duration  1.58s (transform 125ms, setup 0ms, collect 118ms, tests 25ms, environment 1ms, prepare 792ms)

```

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added | 
| ----- | ----- | ----- | ----- | ----- | 
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | Detected immediately by `T06` (`720–840`, exactly 120 minutes, returned `false` instead of `true`). | 
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, AC5 | Detected immediately by `T01` (`660–720`), `T08` (`570–600`), and `T15 AC5` (`660–720`), which touch `[600, 660)` at endpoints. | 
| M3 | Remove the blocked-room rejection | Detected | T13 | Detected immediately by `T13` (`660–720` with `blocked = true`, returned `true` instead of `false`). | 

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```
--- Mutant M1 (end - start >= 120) ---
PS C:\Users\user\PycharmProjects\se-practice\week-07\app\project> npx vitest run

 RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/week-07/app/project

 ❯ src/booking.test.ts (17)
   ❯ canBook (17)
     ✓ T01 AC4: touching after existing booking is accepted (660-720)
     ✓ T02 AC1: starting exactly at now is rejected (540-570)
     ✓ T03 AC1: zero-duration interval is rejected (720-720)
     ✓ T04 AC1: reversed interval is rejected (750-720)
     ✓ T05 AC1: interval ending past day end is rejected (1380-1441)
     × T06 AC2: exactly 120 minutes is accepted (720-840)
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

 FAIL  src/booking.test.ts > canBook > T06 AC2: exactly 120 minutes is accepted (720-840)
AssertionError: expected false to be true // Object.is equality

 Test Files  1 failed (1)
      Tests  1 failed | 16 passed (17)
   Start at  09:11:57
   Duration  1.60s (transform 119ms, setup 0ms, collect 120ms, tests 43ms, environment 1ms, prepare 817ms)

--- Mutant M2 (start <= b.end && b.start <= end) ---
PS C:\Users\user\PycharmProjects\se-practice\week-07\app\project> npx vitest run

 RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/week-07/app/project

 ❯ src/booking.test.ts (17)
   ❯ canBook (17)
     × T01 AC4: touching after existing booking is accepted (660-720)
     ✓ T02 AC1: starting exactly at now is rejected (540-570)
     ✓ T03 AC1: zero-duration interval is rejected (720-720)
     ✓ T04 AC1: reversed interval is rejected (750-720)
     ✓ T05 AC1: interval ending past day end is rejected (1380-1441)
     ✓ T06 AC2: exactly 120 minutes is accepted (720-840)
     ✓ T07 AC2: 121 minutes is rejected (720-841)
     × T08 AC4: touching before existing booking is accepted (570-600)
     ✓ T09 AC4: partial overlap is rejected (630-690)
     ✓ T10 AC4: interval containing existing booking is rejected (570-690)
     ✓ T11 AC4: interval inside existing booking is rejected (615-645)
     ✓ T12 AC4: identical interval is rejected (600-660)
     ✓ T13 AC3: blocked room is rejected (660-720, blocked)
     ✓ T14 AC4: empty bookings list has no overlaps (630-690)
     ✓ X1 AC1: starting 1 minute after now is accepted (541-571)
     ✓ X2 AC4: overlapping only the second of two bookings is rejected (720-780)
     × T15 AC5: available request returns true and leaves bookings unchanged (660-720)

 FAIL  src/booking.test.ts > canBook > T01 AC4: touching after existing booking is accepted (660-720)
 FAIL  src/booking.test.ts > canBook > T08 AC4: touching before existing booking is accepted (570-600)
 FAIL  src/booking.test.ts > canBook > T15 AC5: available request returns true and leaves bookings unchanged (660-720)

 Test Files  1 failed (1)
      Tests  3 failed | 14 passed (17)
   Start at  09:15:09
   Duration  1.75s (transform 129ms, setup 0ms, collect 108ms, tests 33ms, environment 0ms, prepare 860ms)

--- Mutant M3 (removed blocked check) ---
PS C:\Users\user\PycharmProjects\se-practice\week-07\app\project> npx vitest run

 RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/week-07/app/project

 ❯ src/booking.test.ts (17)
   ❯ canBook (17)
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
     × T13 AC3: blocked room is rejected (660-720, blocked)
     ✓ T14 AC4: empty bookings list has no overlaps (630-690)
     ✓ X1 AC1: starting 1 minute after now is accepted (541-571)
     ✓ X2 AC4: overlapping only the second of two bookings is rejected (720-780)
     ✓ T15 AC5: available request returns true and leaves bookings unchanged (660-720)

 FAIL  src/booking.test.ts > canBook > T13 AC3: blocked room is rejected (660-720, blocked)
AssertionError: expected true to be false // Object.is equality

 Test Files  1 failed (1)
      Tests  1 failed | 16 passed (17)
   Start at  09:18:02
   Duration  1.54s (transform 171ms, setup 0ms, collect 221ms, tests 34ms, environment 1ms, prepare 610ms)

```

All three changes reverted, and the full suite run again (section 6.3): yes

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| \# | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable | 
| ----- | ----- | ----- | ----- | ----- | ----- | 
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | Selecting Room A (`10:00–11:00` existing booking, `now = 09:00`) and checking `11:00–12:00` (`660–720`) displays the green `Available` badge and keeps the `10:00–11:00` booking intact. | Pass | 
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | Selecting the blocked Cedar Seminar Room (`blocked = true`) with `11:00–12:00` immediately replaces `Available` with `Unavailable` and displays the blocked-room reason. | Pass | 
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Clearing the end-time input or entering an invalid interval (`12:00–12:00`) shows `Unavailable` with clear validation feedback (`End time must be after the start time`). | Pass | 
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | At `375x812` portrait mobile viewport in DevTools, the room selector, time inputs, decision card, and timeline stack vertically without horizontal overflow or clipped controls. | Pass | 
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | Repeating `11:00–12:00` and overlapping `10:30–11:30` checks on Room A produces identical decisions while the existing `10:00–11:00` booking list remains unmodified. | Pass | 

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays | 
| ----- | ----- | 
| none | All 33 automated checks in `tests/check_suite.py` pass with 0 failures and 0 errors. | 

### 9.2 Original and improved suites

| Measure | First suite | Improved suite | 
| ----- | ----- | ----- | 
| Executed / passed / failed | 15 executed / 15 passed / 0 failed | 17 executed / 17 passed / 0 failed | 
| Requirements with meaningful tests (AC IDs and gaps) | AC1, AC2, AC3, AC4, AC5 covered on single-booking fixtures; missing `start = now + 1` (`X1`) and multi-booking loop coverage (`X2`); AC6 not covered by unit tests | AC1–AC5 covered including `X1` (`541–571` right after `now = 540`), `X2` (two-booking list overlap on second slot), and `JSON.stringify` AC5 check; AC6 verified via manual UI checks U1–U5 | 
| Selected mutants detected | 3 of 3 (`M1` by `T06`, `M2` by `T01`/`T08`/`AC5`, `M3` by `T13`) | 3 of 3 (`M1` by `T06`, `M2` by `T01`/`T08`/`AC5`, `M3` by `T13`), plus catches early-return loop bugs on multi-booking lists via `X2` | 
| Accepted / revised / rejected tests | 14 accepted (`T01`–`T14`), 1 revised (`T15 AC5`), 0 rejected | 14 accepted (`T01`–`T14`), 3 revised/added (`T15 AC5` strengthened, `X1` and `X2` added), 0 rejected | 
| Remaining limitations | Does not test multiple existing bookings, `start = now + 1`, non-integer/NaN inputs, or DOM/UI rendering (AC6) | Unit tests still call `canBook` directly without rendering React components or testing malformed/reversed existing bookings in `bookings` | 

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

* Calling `canBook({ start: 660, end: 720, now: 540, blocked: false, bookings: [{ start: 700, end: 650 }] })` returns **`true`** (`returns-true`), because the overlap condition `start < b.end && b.start < end` evaluates `660 < 650 && 700 < 720`, which is `false`, so no conflict is detected. None of AC1–AC6 specify how `canBook` should handle a corrupted or reversed existing booking in `bookings` (AC1 only constrains the candidate interval `0 <= start < end <= 1440`).

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
(a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
(b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
(c) One testing limitation that remains.
Worthless: "The AI wrote good tests and they all passed."
Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->

In the first generated suite, every overlap test used a single-element `bookings` array (`[{ start: 600, end: 660 }]`), and there was no test for `start = now + 1`. I found this gap during the Task 4 pre-run review by comparing the fixture against AC1 and AC4: a broken `canBook` that only checked `bookings[0]` and returned early would have passed all 15 initial tests, which is why I added `X1` (`541–571`) and `X2` (overlapping the second of two bookings). My final 17-test green run—together with killing mutants `M1` (`T06`), `M2` (`T01`, `T08`, `AC5`), and `M3` (`T13`)—proves that `canBook` enforces the exact boundaries of AC1–AC4 and preserves `bookings` under AC5. However, a green unit-test run does not prove that the browser UI renders clear validation messages or stays usable at a 375 px mobile viewport (AC6), which required manual UI checks `U1`–`U5`. One limitation that remains is that `canBook` does not validate malformed existing bookings (such as `{ start: 700, end: 650 }`) or non-integer `now` values.