# Week 05 — Lab report

**Name: Olzhabay Kuanysh**

**Group: Monday (18:00-19:00)**

**Date: 11.10.2026**

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| |   |
| --- |---|
| Assistant (tool) | Claude |
| **Exact** model name | Clause Sonnet 5.5 |
| Language and version | Python 3.14 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
## Implementation plan for `can_book`

**Checks, in order (return `False` at the first failure, otherwise `True`):**

1. **Range (AC1):** `0 <= start < end <= 1440`.
2. **Not in the past (AC1):** `start > now` (strict).
3. **Duration (AC2):** `end - start <= 120`.
4. **Blocked (AC3):** if `blocked` is true, return `False`.
5. **Overlap (AC4):** scan `existing` and reject if any `(s, e)` satisfies `start < e and s < end`. This works with the half-open rule, so touching endpoints don't count as overlap.
6. **Otherwise:** return `True`.

The cheap, fixed checks run first and the loop over `existing` runs last. The checks are independent, so the order doesn't change the result, only the work done. The function only reads `existing` and never sorts, appends, or removes (AC5).

**Assumptions**

- All inputs are integers, and `blocked` is a real Boolean.
- Each tuple in `existing` is valid (`s < e`, within 0-1440), as the contract states, so I won't re-validate it.
- `existing` may be empty, unsorted, or contain bookings that don't relate to each other, so the overlap check can't depend on order.
- A zero-length or reversed request (`start >= end`) is simply invalid, not an error, and returns `False` rather than raising.
- Because `start > now` is strict and `now >= 0`, a booking starting at minute 0 can never be valid.
- Exactly 120 minutes is allowed; 121 is not.
```
**Boundary cases to test**

| Area | Cases |
|---|---|
| Range | `start=-1`; `start == end`; `start > end`; `end=1440` (valid) vs `end=1441` (invalid); `start=0` (always `False`); `start=1439, end=1440, now=1438` (`True`) |
| Now | `start == now` (`False`); `start == now + 1` (`True`) |
| Duration | 120 minutes (`True`); 121 minutes (`False`); `1320 -> 1440` (`True`, combines the duration and day-end limits) |
| Blocked | Otherwise-valid request with `blocked=True` (`False`) |
| Touching | Existing `(600, 660)`: new `(660, 720)` and `(540, 600)` both `True` |
| Overlap | One-minute overlap on either side; new inside existing; new containing existing; identical interval |
| Existing list | Empty list; several unsorted bookings where only the last one conflicts (catches early returns or checking only the first item); a gap between two bookings that fits exactly |
| Immutability | Compare `existing` to a copy before and after the call, including after a `False` result |





**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says| What I did |
| --- | --- |---|---|
| 1 | Checked every step (range, start>now, duration, blocked, overlap formula, immutability) against AC1–AC5 and the contract one by one | Each step traces to exactly one AC or a contract-stated guarantee (existing tuples are pre-validated), no step introduces a rule not already in the spec | Kept the plan as it is, no corrections needed |

**Boundary cases the assistant suggested that I kept as tests:**

- `start=0` (always False, since `now>=0`)
- Exactly 120 minutes vs 121 minutes
- Touching on both sides: new booking right after, and right before, an existing one
- Unsorted `existing` where only the last entry conflicts
- A gap between two existing bookings that exactly fits a new request
- Immutability check: compare `existing` before/after, including after a `False` result

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.py`, exactly as the assistant returned it: yes

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- |---|
| 1 | `if not (0 <= start < end <= 1440): return False` | AC1 (range + day bounds) | Correct — verified by hand: `end==1440` passes (exclusive end), `start==end` fails, `start>end` fails |
| 2 | `if start <= now: return False` | AC1 (start strictly after now) | Correct — `<=` (not `<`) correctly rejects `start==now`; confirmed `now=0, start=1` passes |
| 3 | `if end - start > 120: return False` | AC2 | Correct, exactly 120 passes, 121 fails |
| 4 | `if blocked: return False` | AC3 | Correct, unconditional, independent of any other check |
| 5 | `for booked_start, booked_end in existing: if start < booked_end and booked_start < end: return False` | AC4 | Correct, standard half-open overlap test; by hand, touching case `(660,720)` vs `(600,660)`: `660<660` is False → no overlap → allowed, matching AC4 |
| 6 | `return True` | AC5 | Correct, reached only after all four checks pass |

**Anything in v1 that no AC asks for:**

- None found. No added validation, no buffer/gap logic, no sorting of `existing`, no logging, no change to the return type.

---

## 4. Task 3 — my tests

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | test_touching_end_is_allowed | (660, 720) | — | True | AC4 | PASS | PASS |
| 2 | test_overlap_is_rejected | (630, 690) | — | False | AC4 | PASS | PASS |
| 3 | test_blocked_room_is_rejected | (660, 720) | blocked=True | False | AC3 | PASS | PASS |
| 4 | test_exactly_two_hours_is_allowed | (720, 840) | — | True | AC2 | PASS | PASS |
| 5 | test_over_two_hours_is_rejected | (720, 841) | — | False | AC2 | PASS | PASS |
| 6 | test_starting_now_is_rejected | (540, 570) | — | False | AC1 | PASS | PASS |
| 7 | test_zero_length_is_rejected | (700, 700) | — | False | AC1 | PASS | PASS |
| 8 | test_reversed_interval_is_rejected | (720, 700) | — | False | AC1 | PASS | PASS |
| 9 | test_negative_start_is_rejected | (-30, 30) | — | False | AC1 | PASS | PASS |
| 10 | test_end_exactly_at_midnight_is_allowed | (1380, 1440) | — | True | AC1 | PASS | PASS |
| 11 | test_end_past_midnight_is_rejected | (1380, 1441) | — | False | AC1 | PASS | PASS |
| 12 | test_start_one_minute_after_now_is_allowed | (541, 571) | — | True | AC1 | PASS | PASS |
| 13 | test_one_minute_booking_is_allowed | (720, 721) | — | True | AC2 | PASS | PASS |
| 14 | test_blocked_with_no_existing_bookings | (660, 720) | blocked=True, existing=[] | False | AC3 | PASS | PASS |
| 15 | test_overlap_on_the_start_side_is_rejected | (570, 630) | — | False | AC4 | PASS | PASS |
| 16 | test_request_inside_existing_booking_is_rejected | (615, 645) | — | False | AC4 | PASS | PASS |
| 17 | test_request_containing_existing_booking_is_rejected | (570, 690) | — | False | AC4 | PASS | PASS |
| 18 | test_identical_interval_is_rejected | (600, 660) | — | False | AC4 | PASS | PASS |
| 19 | test_touching_start_is_allowed | (570, 600) | — | True | AC4 | PASS | PASS |
| 20 | test_fits_exactly_between_two_existing | (660, 720) | existing=[(600,660),(720,780)] | True | AC4 | PASS | PASS |
| 21 | test_conflicts_with_the_second_of_two_existing | (720, 780) | existing=[(600,660),(700,760)] | False | AC4 | PASS | PASS |
| 22 | test_conflict_found_in_an_unsorted_list | (610, 650) | existing=[(900,960),(600,660)] | False | AC4 | PASS | PASS |
| 23 | test_empty_existing_list_is_allowed | (600, 660) | existing=[] | True | AC4 | PASS | PASS |
| 24 | test_free_slot_among_three_existing | (760, 800) | existing=[(600,660),(700,760),(800,860)] | True | AC4 | PASS | PASS |
| 25 | test_result_is_a_real_boolean_on_success | (660, 720) | — | isinstance bool | AC5 | PASS | PASS |
| 26 | test_result_is_a_real_boolean_on_rejection | (630, 690) | — | isinstance bool | AC5 | PASS | PASS |
| 27 | test_existing_is_unchanged_after_an_accepted_request | (780, 840) | existing=[(900,960),(600,660),(700,760)] | existing unchanged | AC5 | PASS | PASS |
| 28 | test_existing_is_unchanged_after_a_rejected_request | (610, 650) | existing=[(900,960),(600,660),(700,760)] | existing unchanged | AC5 | PASS | PASS |
| 29 | test_start_at_midnight_with_now_at_midnight_is_rejected | (0, 60) | now=0 | False | AC1 | PASS | PASS |
| 30 | test_start_one_minute_after_midnight_with_now_at_midnight | (1, 61) | now=0 | True | AC1 | PASS | PASS |

---

## 5. Task 4 — debugging with evidence

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(0, 60, 0, False, [(600, 660)])` | False | False | `if start <= now: return False` — `now=0` is the earliest possible value, and the plan itself noted "a booking starting at minute 0 can never be valid"; this case confirms it holds | none needed | n/a — added as a new edge case per README's rule for a v1 that already passes everything |

**The debug prompt I sent, and the assistant's answer:** (left empty — no debugging was needed; v1 passed F1–F10 and all 30 of my tests on the first run)

---

## 6. Task 5 — the critique

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
I found no concrete issues. This code is identical to the version I gave you in booking.py, and I checked each line against the contract and AC1-AC5. I won't invent defects to fill the list of five.

Criteria checked

- AC1: `if not (0 <= start < end <= 1440):` covers the range, positive length, and the exclusive day end. `if start <= now:` makes the start strictly after `now`.
- AC2: `if end - start > 120:` allows exactly 120 and rejects 121.
- AC3: `if blocked:` rejects a blocked room.
- AC4: `if start < booked_end and booked_start < end:` is the correct overlap test for half-open intervals. Touching endpoints give a false comparison, so they are allowed. Every booking is checked, so order and an empty list don't matter.
- AC5: `return True` is reached only when every earlier check passed. The loop only reads `existing`, so it is never altered, and every path returns a Boolean.
- Contract: the signature matches, nothing outside the standard library is used, and no inputs are mutated.

Observations that are not violations

- The docstring says "satisfies AC1-AC4", while AC5 is the return rule (True only when AC1-AC4 hold). This is consistent, so no change is needed.
- `if blocked:` relies on truthiness. That is fine because the contract says `blocked` is a Boolean. A non-Boolean value would be outside the contract.

If you meant to review a different version, one where something was changed, please paste that one. I can only report differences I can see, and this text has none.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Docstring says "satisfies AC1-AC4" while AC5 is the return rule | reject | AC5 literally defines itself as "Return True only when AC1-AC4 hold" — so describing the earlier checks as the AC1-AC4 gate is accurate, not a defect. No contract line requires the docstring to restate AC5 too. | unchanged — 30/30, F1-F10 PASS |
| 2 | `if blocked:` relies on truthiness rather than an explicit `is True` check | reject | The contract states "blocked is a Boolean", so the function is entitled to assume it. Nothing in AC1-AC5 asks for defensive type-checking on inputs the contract already guarantees — adding it would be unrequested scope, the same category of invention §2 was checking for in the plan. | unchanged — 30/30, F1-F10 PASS |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- |---| --- | --- |
| 1 | No code changed, v1 is identical to final | v1 passed F1–F10 on the checker's first run, and my 28-test suite (later 30) passed 100% against it with zero fixes needed | `check_booking.py`: F1–F10 all PASS on both v1 and final; M1–M10 all PASS, confirming the test suite is what demonstrates correctness |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.001s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text

Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (27 lines)
FAIL   S1   your suite has at least 11 tests            1 test - the task asks for the six table cases plus five more kinds (README Part 3)
PASS   S2   your suite is green on your own code        1 tests, OK
FAIL   M1   your tests catch a fault in AC1             NOT caught - a can_book that breaks AC1 passed all 1 of your tests that follow the contract
FAIL   M2   your tests catch a fault in AC1             NOT caught - a can_book that breaks AC1 passed all 1 of your tests that follow the contract
FAIL   M3   your tests catch a fault in AC1             NOT caught - a can_book that breaks AC1 passed all 1 of your tests that follow the contract
FAIL   M4   your tests catch a fault in AC2             NOT caught - a can_book that breaks AC2 passed all 1 of your tests that follow the contract
FAIL   M5   your tests catch a fault in AC3             NOT caught - a can_book that breaks AC3 passed all 1 of your tests that follow the contract
PASS   M6   your tests catch a fault in AC4             caught by test_touching_end_is_allowed
FAIL   M7   your tests catch a fault in AC4             NOT caught - a can_book that breaks AC4 passed all 1 of your tests that follow the contract
FAIL   M8   your tests catch a fault in AC4             NOT caught - a can_book that breaks AC4 passed all 1 of your tests that follow the contract
FAIL   M9   your tests catch a fault in AC5             NOT caught - a can_book that breaks AC5 passed all 1 of your tests that follow the contract
FAIL   M10  your tests catch a fault in AC5             NOT caught - a can_book that breaks AC5 passed all 1 of your tests that follow the contract
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 1 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              6 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  30 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 2 points judged
PASS   L7   report 7: change log                        1 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
FAIL   L9   report 10: conclusion of 120-180 words      section 10 has 0 words, the task asks for 120-180
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes
SUMMARY pass=21 fail=11 error=0   (32 checks)
Every FAIL or ERROR you keep goes in lab-report.md section 9 and in submission.yml known_fails.
One you report and explain costs you nothing. One you hide costs the whole criterion.

```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->
