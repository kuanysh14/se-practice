# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> <!-- comments if you like. -->

## 1. Setup and reuse

| Item | Value |
| --- | --- |
| Coding assistant (tool) | Claude.ai |
| Coding assistant model | Claude Sonnet 5.5 |
| Bolt.new model | not displayed |
| Bolt project link | https://bolt.new/~/sb1-jks36ria |
| Language | python |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | week-06 |

## 2. Baseline — before any new AI exchange

### 2.1 Scope in my own words

**Scope:** Build and verify a pure Python availability-checking function (`can_book`) and a single-page responsive web prototype for one campus room with fictional bookings that checks candidate intervals against AC1–AC6 without mutating state or adding login, backend, database, payments, or external APIs.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | Start and end must be integer minutes within the day (`0 <= start < end <= 1440`), and `start` must be strictly greater than `now` (`start > now`). |
| AC2 | The requested booking duration (`end - start`) must be at most 120 minutes, with exactly 120 minutes allowed. |
| AC3 | Every availability check must be rejected immediately whenever the selected room is marked as blocked (`blocked == True`). |
| AC4 | Any candidate interval that overlaps an existing booking `[a, b)` (`start < b and end > a`) must be rejected, while touching endpoints (`end == a` or `start == b`) are allowed. |
| AC5 | The check must return an unambiguous Boolean (`True` or `False`) or display `Available` / `Unavailable` without mutating the existing bookings list. |
| AC6 | The web page must provide clear human-readable validation feedback on rejected intervals and remain usable on both desktop and narrow mobile (`~375 px`) screens. |

### 2.3 Likely failure points

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Endpoint touching rejected as overlap (`start <= b and end >= a` instead of strict `start < b and end > a`) | AC4 | Run T1 (`660–720` right after existing `(600, 660)`) and verify `can_book` returns `True` and the page shows `Available`. |
| 2 | Boundary `start == now` accepted (`start < now` instead of `start <= now`) or live wall-clock used on the page | AC1 | Run T6 (`540–570` when `now = 540`) and verify `can_book` returns `False` and the page shows `Unavailable`. |
| 3 | Mutating `existing` in place (e.g., `existing.append(...)` or `existing.sort()`) during an availability check | AC5 | Run T11 (`660–720` twice on the same list) and pass an unsorted list `[(900, 960), (600, 660)]` in unit tests to assert `existing` is unchanged after `can_book`. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Candidate booking start time in minutes from midnight | `int`, valid candidate range `0 <= start < end <= 1440` and `start > now` |
| `end` | Candidate booking end time in minutes from midnight (half-open `[start, end)`) | `int`, valid candidate range `start < end <= 1440` with `end - start <= 120` |
| `now` | Supplied current campus time in minutes from midnight | `int`, assumed valid in `0..1439` |
| `blocked` | Whether the selected room is currently blocked from any booking | `bool` (`True` if blocked, `False` if open) |
| `existing` | Collection of existing bookings for the room as half-open `(start, end)` intervals | Sequence/list of `(int, int)` pairs (`0 <= a < b <= 1440`), must not be mutated |
| returns | Whether the candidate interval satisfies all rules AC1–AC4 | `bool` (`True` only when AC1–AC4 all hold, `False` otherwise) |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. All time arguments (`start`, `end`, `now`, and each `(a, b)` in `existing`) represent integer minutes since `00:00` (`0` to `1440`), and intervals are half-open `[start, end)`.
2. Checking availability is strictly a read-only query: neither `can_book` nor the web page ever reserves a slot or modifies the `existing` collection in place.
3. On the web page, standard HTML `<input type="time">` controls only express `00:00` through `23:59` (`0` to `1439`), so midnight-bound cases T8 (`1380–1440`) and T9 (`1380–1441`) are tested directly in Python and recorded as `Not testable` on the page unless custom minute inputs are used.

**Checked manually:**

- Verify by hand that every conditional branch in `booking_v1.py` and `booking.py` uses strict inequalities in the right direction (`0 <= start < end <= 1440`, `start <= now`, `end - start > 120`, and `start < b and end > a`) and that `existing` is never sorted or appended to.
- Verify in Chrome DevTools at `375 px` portrait width that all inputs, room cards, and validation reasons remain readable and testable across T1–T12.

## 3. Python v1 review

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not (0 <= start < end <= 1440): return False` | AC1 | Yes | Enforces day bounds `0..1440` (allowing `end == 1440` for T8 and rejecting `end == 1441` for T9) and positive length (`start < end`, rejecting reversed T7 and zero-length slots). |
| `if start <= now: return False` | AC1 | Yes | Uses `<=` so a booking starting at `now` (`start == now`, T6) or in the past (`start < now`) is rejected while `start == now + 1` passes. |
| `if end - start > 120: return False` | AC2 | Yes | Uses strict `>` so a 120-minute slot (`720–840`, T4) passes while 121 minutes (`720–841`, T5) returns `False`. |
| `if blocked: return False` | AC3 | Yes | Unconditionally rejects any request when the room is blocked (`blocked == True`, T3), even when `existing` is empty. |
| `for booked_start, booked_end in existing: if start < booked_end and booked_start < end: return False` | AC4, AC5 | Yes | Checks every booking in `existing` without mutating it; strict `<` on both sides allows touching endpoints (`660 < 660` is `False` on T1) while rejecting all true overlaps (T2, T10). |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements:
AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.
Intervals include the start and exclude the end.
Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

| Generated file or component | Path | Its role |
| --- | --- | --- |
| Availability checker module | `src/lib/availability.ts` | Implements `checkAvailability` and `overlapsExisting` enforcing AC1–AC5 against the selected room and bookings. |
| Time conversion helpers | `src/lib/time.ts` | Converts between `HH:MM` strings and integer minutes after midnight (`0..1440`). |
| Sample campus rooms data | `src/data/sampleData.ts` | Defines four fictional campus rooms (`Aurora Hall`, `Beacon Room`, `Cedar Seminar Room`, `Driftwood Lounge`) and their pre-set bookings. |
| Main application shell | `src/App.tsx` | Wires room selection, current time state, interval inputs, decision card, and timeline on one responsive page. |
| Current time clock widget | `src/components/Clock.tsx` | Displays the current campus time (`new Date()` in v1, replaced with an editable time input in final). |
| Room selector list | `src/components/RoomList.tsx` | Renders the four campus rooms with capacity, location, and blocked status badges. |

**What v1 does:**

- Renders four sample campus rooms (`Aurora Hall`, `Beacon Room`, `Cedar Seminar Room`, `Driftwood Lounge`) with a 24-hour visual booking timeline and read-only in-memory state that never mutates existing bookings on check (AC5 works).
- Evaluates candidate start and end times immediately in `IntervalForm.tsx` and shows an `Available` or `Unavailable` card with rejection reasons in `DecisionCard.tsx`.
- Locks `Current time` in `Clock.tsx` to `new Date()` with no input to set the supplied current time to `09:00` (`540`), disables clicking blocked `Cedar Seminar Room` (`disabled={room.blocked}` in `RoomList.tsx`), and formats overlap errors in raw minutes (`600–660 min`) while bundling unused `@supabase/supabase-js` in `package.json`.

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | | | | |
| T2 | Overlap | 630–690 | Unavailable | | | | |
| T3 | Blocked | 660–720, blocked | Unavailable | | | | |
| T4 | Exactly 120 min | 720–840 | Available | | | | |
| T5 | 121 min | 720–841 | Unavailable | | | | |
| T6 | Starts now | 540–570 | Unavailable | | | | |
| T7 | Reversed | 720–660 | Unavailable | | | | |
| T8 | Ends at midnight | 1380–1440 | Available | | | | |
| T9 | Past midnight | 1380–1441 | Unavailable | | | | |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | | | | |
| T11 | Same check twice | 660–720, twice | Available | | | | |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | | |

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC2 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC3 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC4 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC5 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC6 | (write here) | (write here) | (write here) | (write here) | (write here) |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | (write here) | (write here) | (write here) | (write here) | (write here) |
| 2 | (write here) | (write here) | (write here) | (write here) | (write here) |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue (write here)

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | (write here) | (write here) | (write here) | (write here) |
| 2 | (write here) | (write here) | (write here) | (write here) |
| 3 | (write here) | (write here) | (write here) | (write here) |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | (write here) |
| Model / plan | (write here) |
| Tool call | (write here) |
| Observation | (write here) |
| Next step | (write here) |
| Human review | (write here) |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** (write here)

**Reliability, security, responsibility:** (write here)

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

(write here)

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** Claude.ai
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-10-11
- **Stage:** Plan
- **Source:** week-05

**Prompt:**

~~~~text
We are implementing `can_book(start, end, now, blocked, existing)` in Python using only the standard library.
Before writing code, propose a short implementation plan:
1. The checks in order, mapped to AC1–AC5:
   - AC1: Candidate times are integer minutes after midnight: 0 <= start < end <= 1440; start strictly after now.
   - AC2: Duration at most 120 minutes; exactly 120 is permitted.
   - AC3: Reject every request when the room is blocked.
   - AC4: Reject overlap with any existing booking; touching at an endpoint is NOT overlap.
   - AC5: Return True only when AC1–AC4 hold, False otherwise, and never mutate existing bookings.
2. Key assumptions about inputs.
3. Boundary test cases to verify each rule.
~~~~

**Response:**

~~~~text
## Implementation plan for `can_book`

**Checks, in order (return `False` at the first failure, otherwise `True`):**

1. **Range (AC1):** `0 <= start < end <= 1440`.
2. **Not in the past (AC1):** `start > now` (strict).
3. **Duration (AC2):** `end - start <= 120`.
4. **Blocked (AC3):** if `blocked` is true, return `False`.
5. **Overlap (AC4):** scan `existing` and reject if any `(s, e)` satisfies `start < e and s < end`. This works with the half-open rule, so touching endpoints do not count as overlap.
6. **Otherwise:** return `True`.

The cheap, fixed checks run first and the loop over `existing` runs last. The checks are independent, so the order does not change the result, only the work done. The function only reads `existing` and never sorts, appends, or removes (AC5).

**Assumptions**

- All inputs are integers, and `blocked` is a real Boolean.
- Each tuple in `existing` is valid (`s < e`, within 0-1440), as the contract states, so I will not re-validate it.
- `existing` may be empty, unsorted, or contain bookings that do not relate to each other, so the overlap check cannot depend on order.
- A zero-length or reversed request (`start >= end`) is simply invalid, not an error, and returns `False` rather than raising.
- Because `start > now` is strict and `now >= 0`, a booking starting at minute 0 can never be valid.
- Exactly 120 minutes is allowed; 121 is not.
~~~~

### B2

- **Tool:** Claude.ai
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-10-11
- **Stage:** Generate
- **Source:** week-05

**Prompt:**

~~~~text
The implementation plan is approved. Now write the Python function `can_book(start, end, now, blocked, existing)` using only the Python standard library so that it implements the approved plan and satisfies AC1–AC5 without mutating `existing`.
~~~~

**Response:**

~~~~text
Here is the implementation of `can_book` following the approved plan and using only the standard library:

```python
def can_book(start, end, now, blocked, existing):
    """Return True only if the requested slot satisfies AC1-AC4.

    Times are integer minutes after midnight. Intervals include the start
    and exclude the end. `existing` is read but never modified.
    """
    # AC1: valid range, and the slot must start after the current time.
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False

    # AC2: at most 120 minutes.
    if end - start > 120:
        return False

    # AC3: the room must not be blocked.
    if blocked:
        return False

    # AC4: reject any overlap; touching endpoints are allowed.
    for booked_start, booked_end in existing:
        if start < booked_end and booked_start < end:
            return False

    # AC5: every rule held.
    return True

### B3

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B4

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
(paste here)
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
