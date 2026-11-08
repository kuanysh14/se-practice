# AI Usage Disclosure — Week 08

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- |---|
| Claude | Claude Sonnet 5.5 | diagnosis without the skill (Task 4) | none — "Do not edit code" |
| Claude | Claude Sonnet 5.5 | diagnosis with bug-detector (Task 5) | none — "Do not edit code" |
| Google Gemini | Gemini 3.1 Pro | regression test design (`BUG-A`, `BUG-B`), comparison table structuring, and checker verification | `app/project/src/booking.test.ts`, `lab-report.md`, `submission.yml` |

**`skills/bug-detector/SKILL.md` was typed by me from the deck's text, not generated:** yes

**I applied the patches myself, one minimal change per bug, after reviewing what the assistant
proposed:** yes
<!-- If an assistant edited app/ directly, say which change and how you reviewed it. -->

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes
<!-- If "yes" which one, the exact model, and for which section. -->
I used Google Gemini (`Gemini 3.1 Pro`) to help structure the regression test cases (`BUG-A` and `BUG-B`), format the comparison in Section 7, and verify `lab-report.md` and `submission.yml` against `check_debugging.py` and `validate_submission.py`.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain both bugs and both fixes — which line, why it was wrong, which test proves the
fix — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->
None, I verified both diagnoses against `src/booking.ts` and `src/booking.test.ts`, applied the 1-line overlap fix (`BUG-A`) and 1-line `bookings.push` removal (`BUG-B`) in separate commits, and ran Vitest after each change.

Signed: Olzhabay Kuanysh
Date: 2026-11-08
