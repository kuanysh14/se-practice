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
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | | | | |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | | | | |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | | | | |
| 4 | `analyze_marks([], 50)` | raises ValueError | | | | |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | | | | |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | | | | |
| | **Totals** | | /6 | /6 | /6 | /6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| | | |
| | | |
| | | |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```

```

**Prompt B**

```

```

**Prompt C**

```

```

**Prompt D**

```

```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | | | | |
| Requirement coverage | | | | |
| Verifiability (tests) | | | | |
| Assumptions stated | | | | |
| Noise (2 = none) | | | | |
| **Total / 10** | | | | |

**Prompt length, in words:** A ____ · B ____ · C ____ · D ____

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)



```

**Word count:**

---

## 9. Two questions for the debrief

Written before class, answered in class.

1.
2.
