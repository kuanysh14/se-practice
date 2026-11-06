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

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
(paste here)
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
(paste here)
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes / no

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | | | accept / revise / reject | |
| 2 | | | accept / revise / reject | |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
(paste here)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| | | | | |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
(paste here)
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
(paste here)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected / Survived | | |
| M2 | Treat touching endpoints as an overlap | Detected / Survived | | |
| M3 | Remove the blocked-room rejection | Detected / Survived | | |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
(paste here)
```

All three changes reverted, and the full suite run again (section 6.3): yes / no

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | | Pass / Fail / Not testable |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | | Pass / Fail / Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | | Pass / Fail / Not testable |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | | Pass / Fail / Not testable |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | | Pass / Fail / Not testable |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | | |
| Requirements with meaningful tests (AC IDs and gaps) | | |
| Selected mutants detected | | |
| Accepted / revised / rejected tests | | |
| Remaining limitations | | |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-

---

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
