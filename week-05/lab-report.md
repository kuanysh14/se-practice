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

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes / no

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

-

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
(paste here)
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
(paste here)
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
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
