# Week 01 — Manual vs AI: Comparison

**Name: Olzhabay Kuanysh**   
**Group: Monday (18:00-19:00)**    
**Date: 13.09.2026**      

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2)                                                    |
| --- | --- |--------------------------------------------------------------------|
| Language / stack used | Python | React                                                              |
| Time to first version that ran | 40 minutes | 5 minutes                                                          |
| Time to all 4 test cases passing | 50 minutes | 10 minutes                                                         |
| Number of attempts / prompts needed | 3 | ~3 (initial prompt, one clarifying answer, one follow-up fix)      |
| Lines of code you actually wrote | 40 | 0                                                                  |
| Did it handle invalid marks (case B)? | Yes | Yes                                                                |
| Did it handle an empty list (case D)? | Yes | Partially - no crash, but no message, printed zeroed stats instead |
| Did it use the ≥ 50 pass threshold? | Yes | Yes                                                                |
| Output format matches the spec? | Yes | Yes                                                                |
| Can you explain every line of it? | Yes | No                                                                 |

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match?                  |
| --- | --- | --- | --- | --- |-------------------------|
| A | `85, 23, 45, 90, 92` | avg 67.00 · high 92 · low 23 · pass 60.0% | avg 67.00 · high 92 · low 23 · pass 60.0% | avg 67.00 · high 92 · low 23 · pass 60.0% | Both                    |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | avg 71.60 · high 100 · low 47 · pass 80.0% | avg 71.60 · high 100 · low 47 · pass 80.0% | avg 71.60 · high 100 · low 47 · pass 80.0% | Both                    |
| C | `10, 20, 30` | avg 20.00 · high 30 · low 10 · pass 0.0% | avg 20.00 · high 30 · low 10 · pass 0.0% | avg 20.00 · high 30 · low 10 · pass 0.0% | Both                    |
| D | `abc, , xyz` | "No valid marks were given"  | full stats block, all values 0.00/0 | clear message, no crash | Manual - yes · Rocket - no |

## 3. What the AI added that I never asked for

<!-- Tech stack, UI, extra features, a pass threshold it invented, styling, etc. -->

- A full web UI ("results screen"). The prompt never specified a platform or stack, it chose React on its own.
- Two extra statistics never mentioned in the initial prompt: median and standard deviation.


## 4. What the AI got wrong or silently skipped

<!-- Be concrete: input, expected, actual. -->

- **Case D, empty-list handling:** Input `abc, , xyz` → spec expects a clear message, no crash. Rocket instead printed a complete stats block with Average 0.00, Highest 0, Lowest 0, Pass Rate 0.0% - no crash, but nothing tells the user there were zero valid marks. Someone skimming the output could easily read "0.00" as a real average.
- **Inconsistent entry counting:** For case B (9 comma-separated entries), Rocket reported "Total Marks: 8." For case D (3 entries), it reported "Total Marks: 2." In both cases it's not counting exactly the number of empty entries in the input suggests that it drops blank entries before counting at all, rather than counting them and then marking them as invalid entries.

## 5. The defect I asked Rocket to fix

**Prompt I used:** "Remove those statistics from the output: median score and standard deviation."

**Result:** Fixed - output for case C after that showed only total marks, valid marks, average, highest, lowest, pass rate, and pass/fail counts, with median and std dev gone. Nothing else broke.

**What this tells me:** Rocket followed a narrow, direct fix instruction cleanly - but it never caught the more serious case D issue on its own, because I didn't point it at that specific behavior. It fixes what you tell it to fix, not what's actually wrong.

---

## 6. Reflection (200–300 words)

Answer all four, in your own words:

1) Which parts of the work did the AI genuinely speed up?
2) Where did the AI cost you time, or give you something that looked right but was not?
3) Which of these two artefacts would you be willing to put your name on, and why?
4) What must a human engineer still be responsible for after this experiment?

1. Rocket clearly created something that looked finished, one prompt produced a styled web app with a results screen in the time it would take me to just set up print statements. It also added things I wouldn't have bothered with, like the pass/fail counts.

2. It cost me confidence, not time. Case A, B, and C matched the spec numbers fully, which made me trust it, but that trust would have been misplaced if I'd stopped testing there. Case D looked fine at the beginning, but it doesn't actually satisfy the spec: "no valid marks". If I hadn't checked that specific case against the exact spec, I'd have uploaded a subtly wrong tool.

3. I'd put my name on the manual version. Because I wrote it and can explain exactly why case D returns a message instead of computing statistics on an empty list. I wouldn't sign off on the Rocket version without more testing, because I don't fully know what's inside it, and I already found one real spec violation it didn't mark itself.

4. A human engineer still has to own the spec, not just the demo. Rocket produced code that mostly followed the initial prompt and even added some extra things, but it took a line-by-line comparison against the written requirements. Only a human can check that.

Rocket did not let me download the code, so here's the preview link:https://www.rocket.new/6aa675ba22d01b0014317f0b#preview
