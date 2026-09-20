# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name: Olzhabay Kuanysh**  
**Group: Monday (18:00-19:00)**  
**Date: 20.09.2026**

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| |                 |
| --- |-----------------|
| AI assistant | Claude          |
| Exact model name | Claude Sonnet 5 |
| Implementation language | Python          |
| Date of the runs | 20.09.2026      |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
(paste here, or write "n/a — used Python")
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes 
- No follow-up questions were asked before Part 7: yes 
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. Marks come as a CSV with one row per student and one column per subject, not a flat list
2. pandas is available and acceptable to use, despite no library constraint being given
3. A grading scheme with letter-grade cutoffs (90=A, 80=B, 70=C, 60=D, 50=E) that was never requested
4. Student ranking and inter-subject correlation output, never requested


**Questions it should have asked and did not:**

1. Should this analyze one list of marks, or many students across subjects?
2. What's the pass threshold, and should output be per-student, per-subject, or both?

**Is the function named `analyze_marks` with the required signature?** yes / no — if no, what is it
called:  
no, it's called
analyze(marks) and takes/returns a DataFrame, not a dict.

**First impression before testing** (one sentence — you will compare this with section 6 later):  
looked impressively thorough: full stats, grades,
rankings, correlations, but none of it matched what was actually asked.
---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100; raise ValueError for an empty list, non-numeric values, or out-of-range values. Use no external libraries. Return code plus a short explanation.
```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1. Correct function name and signature (analyze_marks(marks, pass_mark=50))
2. Returns exactly the four required dict keys; validates all three invalid-input cases with ValueError

**What B still leaves open:**

1. No rounding: pass_rate returned as 66.66666666666666 for case 1, only passed
   the harness because of its 0.01 tolerance, not because output matched the spec's
   implied 2-decimal formatting
2. No real automated tests: just one inline print() of an example call, which
   doesn't exercise any invalid-input case

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100; raise ValueError for an empty list, non-numeric values, or out-of-range values. Use no external libraries. Return code plus a short explanation. Example: analyze_marks([40, 60, 80], 50) -> average 60, highest 80, lowest 40, pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list, text value, and marks below 0 or above 100. State any remaining assumptions before the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- |----------------------------|
| one mark | yes                        |
| decimals | yes                        |
| custom pass_mark | yes                        |
| empty list | yes                        |
| text value | yes                        |
| below 0 / above 100 | yes                        |

**Do the AI's own tests pass against the AI's own code?** yes (9/9, verified with
python -m unittest)

**Do they agree with the harness in section 6?** yes

**Assumptions C stated explicitly before the code:**

---
Validates pass_mark, then emptiness, then per-mark type/range, before computing
anything - so invalid input never produces a partial result. Explicitly rejects
bool as a mark type and NaN via the range check.

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50).

Return a dictionary with exactly these keys: average, highest, lowest, pass_rate.
Round average and pass_rate to 2 decimal places using round().

Validation rules — raise ValueError (and only ValueError, never TypeError or any
other exception type) in every one of these cases: the list is empty, any mark is
not a number (int or float), or any mark is outside the range 0–100 inclusive.

A mark equal to pass_mark counts as passing (use >=, not >).

Use no external libraries — standard library only.

Example: analyze_marks([40, 60, 80], 50) -> average 60.0, highest 80, lowest 40,
pass_rate 66.67

Include tests for: one mark, decimals, a custom pass_mark, an empty list, a text
value in the list, and marks below 0 or above 100.

State any remaining assumptions before the code.
```

**What I deliberately added that A, B and C did not have:**

1. An explicit rule that only ValueError may be raised for any invalid input, never TypeError
2. An explicit rounding requirement (round to 2 decimals)
3. An explicit ">=" rule for the pass_mark boundary

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**
Nothing in the spec says which exception type covers a non-numeric mark versus an
out-of-range one. An earlier attempt at Prompt C actually raised TypeError for a
non-numeric mark, which the harness scores as ERROR rather than PASS, since only
ValueError is accepted. I resolved this in Prompt D by stating explicitly that only
ValueError may ever be raised, for every invalid case.
---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | **0/6** | **6/6** | **6/6** | **6/6** |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
|--------| --- | --- |
| A      | 	1–6|	No function named analyze_marks exists at all — the file defines analyze(marks) with a completely different signature and return type, so the harness fails at load time before any case runs.
		
		 |
|        | | |
|        | | |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
ERROR: code/prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
```

**Prompt B**

```
{'average': 60.0, 'highest': 90, 'lowest': 30, 'pass_rate': 60.0}
========================================================================
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: non-numeric mark: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range (0-100): -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_b.py)
========================================================================
```

**Prompt C**

```
========================================================================
analyze_marks harness — code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty.
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: Non-numeric mark: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Mark out of range (0-100): -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_c.py)
========================================================================
```

**Prompt D**

```
========================================================================
analyze_marks harness — code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks must not be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: mark is not a number: '60'
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: mark out of range 0-100: -1
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (code/prompt_d.py)
========================================================================
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- |---|---|---|---|
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 0 | 2 | 2 |
| Assumptions stated | 0 | 2 | 1 | 2 |
| Noise (2 = none) | 0 | 1 | 2 | 1 |
| **Total / 10** | 0 | 7 | 9 | 9 |

**Prompt length, in words:** 7 · B 44 · C 84 · D 136  
**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

---
B over A: 37 words bought a 7-point jump (0→7) — the single most valuable addition in the whole experiment. C over B: 40 words bought +2 points, entirely from verifiability (real tests) rather than correctness, since B already passed all six cases. D over C: 52 words bought 0 net points on this rubric — D ties C at 9/10, trading a noise point for an assumptions-stated point. Past Prompt B, more words stopped buying correctness and started buying verifiability and clarity instead.

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)

Prompt C and D tied at 9/10, ahead of B (7/10) and far ahead of A (0/10) — but not
because of raw correctness: B, C, and D all passed all six harness cases, so no
single addition after B actually improved measurable correctness. In practice I'd
use C at work: one prompt with an appended example and required tests produced the
same reliability as writing my own combined prompt, for less drafting effort. The
addition that bought the most correctness was Prompt B itself — going from A's zero
passing cases (it never even defined a function called analyze_marks) to 6/6 by
simply naming the function, its signature, the return keys, and the validation
rules. What separated B, C, and D was verifiability: B shipped no real tests, just a
printed example that never touched an invalid-input case, while C's and D's
unittest suites actually exercised cases 4-6. D's noise came from testing beyond
what was asked — NaN, infinity, None, and boolean marks weren't among the six
required situations. The real ambiguity in this spec is which exception type covers
which invalid case: an earlier attempt at Prompt C actually raised TypeError on a
non-numeric mark, which the harness scores as ERROR rather than PASS. I resolved
this in Prompt D by stating explicitly that only ValueError may ever be raised, for
any invalid input.

```

**Word count:** 196

---

## 9. Two questions for the debrief

Written before class, answered in class.

1. If B already passes all six cases, is C/D's extra effort worth it outside a graded exercise?
2. How do we test for ambiguities we don't already suspect, rather than ones we stumble into?
